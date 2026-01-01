import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CurrencyApiService } from '../../services/currency-api.service';
import { ConversionRecord } from '../../models/conversion-record.interface';
import { Subscription, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './history-list.component.html',
  styleUrl: './history-list.component.scss'
})
export class HistoryListComponent implements OnInit, OnDestroy {
  private currencyService = inject(CurrencyApiService);
  private subscription: Subscription = new Subscription();

  history = signal<ConversionRecord[]>([]);
  displayedColumns: string[] = ['date', 'details', 'rate'];

  ngOnInit() {
    this.subscription.add(
      this.currencyService.historyUpdates$.pipe(
        startWith(null), // Load initially
        switchMap(() => this.currencyService.getHistory())
      ).subscribe(records => {
        this.history.set(records);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
