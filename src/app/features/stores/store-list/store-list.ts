import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OnInit } from '@angular/core';
import { StoreApiService } from '../../../core/services/store-api.service';
import { Store } from '../../../core/models/store.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [RouterLink, CurrencyPipe],
  selector: 'app-store-list',
  styleUrl: './store-list.css',
  templateUrl: './store-list.html',
})
export class StoreList {
  private storeApiService = inject(StoreApiService);

  stores = signal<Store[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    this.storeApiService.getStores().subscribe({
      next: (store) => {
        this.stores.set(store);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      },
    });
  }
}
