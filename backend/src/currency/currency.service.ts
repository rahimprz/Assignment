import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConversionHistory } from './entities/conversion-history.entity';

@Injectable()
export class CurrencyService {
    private readonly apiKey: string;
    private readonly baseUrl = 'https://api.freecurrencyapi.com/v1';

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        @InjectRepository(ConversionHistory)
        private readonly conversionHistoryRepository: Repository<ConversionHistory>,
    ) {
        this.apiKey = this.configService.get<string>('FREE_CURRENCY_API_KEY') || '';
        if (!this.apiKey) {
            console.warn('FREE_CURRENCY_API_KEY is not set in environment variables');
        }
    }

    async getLatestRates(baseCurrency: string = 'USD', currencies?: string) {
        try {
            const params: any = {
                apikey: this.apiKey,
                base_currency: baseCurrency,
            };
            if (currencies) {
                params.currencies = currencies;
            }

            const response = await lastValueFrom(
                this.httpService.get(`${this.baseUrl}/latest`, { params }),
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getHistoricalRates(date: string, baseCurrency: string = 'USD', currencies?: string) {
        try {
            const params: any = {
                apikey: this.apiKey,
                date: date,
                base_currency: baseCurrency,
            };
            if (currencies) {
                params.currencies = currencies;
            }

            const response = await lastValueFrom(
                this.httpService.get(`${this.baseUrl}/historical`, { params }),
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async convertCurrency(amount: number, from: string, to: string, date?: string) {
        try {
            // Free Tier Calculation Strategy:
            // 1. Always fetch rates based on 'USD' (Free tier default).
            // 2. Fetch rates for BOTH 'from' and 'to' currencies relative to USD.
            // 3. Calculate cross-rate: (USD->TO) / (USD->FROM).

            const base = 'USD';
            let fromRateUSD = 1;
            let toRateUSD = 1;

            if (from === base && to === base) {
                return { result: amount, rate: 1, history: null }; // Should technically not happen in UI but good safety
            }

            let rateData;
            // Fetch rates for both FROM and TO currencies
            const currenciesToFetch = `${from},${to}`;

            // Check if date is today (UTC)
            const today = new Date().toISOString().split('T')[0];
            if (date === today) {
                date = undefined; // Use latest rates for today
            }

            if (date) {
                rateData = await this.getHistoricalRates(date, base, currenciesToFetch);
            } else {
                rateData = await this.getLatestRates(base, currenciesToFetch);
            }

            // Handle API error or missing data structure
            if (!rateData || !rateData.data) {
                throw new HttpException('Failed to fetch rates from external API', HttpStatus.BAD_GATEWAY);
            }

            // Extract rates. 
            // Structure: { data: { "EUR": 0.85, "GBP": 0.75 } } or { data: { "2023-01-01": { ... } } }
            let rates: Record<string, number>;

            if (date) {
                const dateKey = Object.keys(rateData.data)[0];
                rates = rateData.data[dateKey];
            } else {
                rates = rateData.data;
            }

            if (!rates) {
                throw new HttpException('Rates not found for date', HttpStatus.NOT_FOUND);
            }

            // Assign rates relative to USD
            // If currency is USD, rate is 1 (implicit, handled by initialization or check)
            if (from !== base) {
                fromRateUSD = rates[from];
            }
            if (to !== base) {
                toRateUSD = rates[to];
            }

            if (!fromRateUSD || !toRateUSD) {
                throw new HttpException(`Rate not available for ${!fromRateUSD ? from : to}`, HttpStatus.NOT_FOUND);
            }

            // Calculate Cross Rate
            // Example: 
            // 1 USD = 0.85 EUR (fromRateUSD)
            // 1 USD = 0.75 GBP (toRateUSD)
            // 1 EUR = ? GBP
            // 1 EUR = (1 / 0.85) USD = 1.176 USD
            // 1.176 USD * 0.75 = 0.882 GBP
            // Formula: toRateUSD / fromRateUSD
            const exchangeRate = toRateUSD / fromRateUSD;
            const convertedAmount = amount * exchangeRate;

            // Save to DB
            const history = this.conversionHistoryRepository.create({
                sourceCurrency: from,
                targetCurrency: to,
                amount: amount,
                convertedAmount: convertedAmount,
                exchangeRate: exchangeRate,
                date: new Date(), // Transaction time
            });
            await this.conversionHistoryRepository.save(history);

            return {
                result: convertedAmount,
                rate: exchangeRate,
                history: history
            };

        } catch (error) {
            if (error instanceof HttpException) throw error;
            this.handleError(error);
        }
    }

    async getHistory() {
        return this.conversionHistoryRepository.find({
            order: { date: 'DESC' },
            take: 20,
        });
    }

    private handleError(error: any) {
        if (error instanceof AxiosError) {
            const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.response?.data?.message || error.message || 'External API Error';
            throw new HttpException(message, status);
        }
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
