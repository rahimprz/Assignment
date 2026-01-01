export interface ConversionRecord {
    id: number;
    sourceCurrency: string;
    targetCurrency: string;
    amount: number;
    convertedAmount: number;
    exchangeRate: number;
    date: Date;
}
