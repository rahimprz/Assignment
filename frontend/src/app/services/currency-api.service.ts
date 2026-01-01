import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, Subject, tap } from 'rxjs';
import { ConversionRecord } from '../models/conversion-record.interface';

@Injectable({
    providedIn: 'root'
})
export class CurrencyApiService {
    private readonly baseUrl = 'http://localhost:3000/currency';
    public loading: WritableSignal<boolean> = signal(false);
    private historyRefreshSubject = new Subject<void>();

    constructor(private http: HttpClient) { }

    get historyUpdates$(): Observable<void> {
        return this.historyRefreshSubject.asObservable();
    }

    getLatestRates(baseCurrency: string = 'USD'): Observable<any> {
        this.loading.set(true);
        return this.http.get(`${this.baseUrl}/latest?base_currency=${baseCurrency}`).pipe(
            finalize(() => this.loading.set(false))
        );
    }

    convertCurrency(payload: { amount: number; from: string; to: string; date?: string }): Observable<{ result: number; rate: number; history: ConversionRecord }> {
        this.loading.set(true);
        return this.http.post<{ result: number; rate: number; history: ConversionRecord }>(`${this.baseUrl}/convert`, payload).pipe(
            tap(() => this.historyRefreshSubject.next()),
            finalize(() => this.loading.set(false))
        );
    }

    getHistory(): Observable<ConversionRecord[]> {
        this.loading.set(true);
        return this.http.get<ConversionRecord[]>(`${this.baseUrl}/history`).pipe(
            finalize(() => this.loading.set(false))
        );
    }
}
