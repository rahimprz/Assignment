import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
    constructor(private readonly currencyService: CurrencyService) { }

    @Get('latest')
    async getLatest(
        @Query('base_currency') baseCurrency?: string,
        @Query('currencies') currencies?: string,
    ) {
        return this.currencyService.getLatestRates(baseCurrency, currencies);
    }

    @Get('historical')
    async getHistorical(
        @Query('date') date: string,
        @Query('base_currency') baseCurrency?: string,
        @Query('currencies') currencies?: string,
    ) {
        return this.currencyService.getHistoricalRates(date, baseCurrency, currencies);
    }

    @Post('convert')
    async convertCurrency(
        @Body() body: { amount: number; from: string; to: string; date?: string },
    ) {
        return this.currencyService.convertCurrency(body.amount, body.from, body.to, body.date);
    }

    @Get('history')
    async getHistory() {
        return this.currencyService.getHistory();
    }
}
