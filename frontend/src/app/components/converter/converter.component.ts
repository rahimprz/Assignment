import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { CurrencyApiService } from '../../services/currency-api.service';
import { ConversionRecord } from '../../models/conversion-record.interface';
import { HistoryListComponent } from '../history-list/history-list.component';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    HistoryListComponent,
    MatCardModule
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent {
  private currencyService = inject(CurrencyApiService);

  currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'SGD'];

  converterForm = new FormGroup({
    amount: new FormControl<number>(100, [Validators.required, Validators.min(0.01)]),
    from: new FormControl<string>('USD', [Validators.required]),
    to: new FormControl<string>('EUR', [Validators.required]),
    date: new FormControl<Date>(new Date(), [Validators.required])
  });

  result = signal<{ value: number; rate: number; from: string; to: string } | null>(null);
  conversionHistory = signal<ConversionRecord | null>(null);
  isLoading = this.currencyService.loading;

  constructor() { }

  convert() {
    if (this.converterForm.invalid) return;

    const { amount, from, to, date } = this.converterForm.value;

    // Format date as YYYY-MM-DD for backend
    const dateStr = date ? date.toISOString().split('T')[0] : undefined;

    this.currencyService.convertCurrency({
      amount: amount!,
      from: from!,
      to: to!,
      date: dateStr
    }).subscribe({
      next: (response) => {
        this.result.set({
          value: response.result,
          rate: response.rate,
          from: from!,
          to: to!
        });
        this.conversionHistory.set(response.history);
      },
      error: (err) => {
        console.error('Conversion failed', err);
        // Could add snackbar here
      }
    });
  }
}
