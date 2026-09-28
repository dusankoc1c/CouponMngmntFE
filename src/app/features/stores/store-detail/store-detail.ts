import { Component, inject, signal } from '@angular/core';
import { StoreApiService } from '../../../core/services/store-api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '../../../core/models/store.model';
import { Bundle } from '../../../core/models/bundle.model';
import { forkJoin } from 'rxjs';
import { BundleApiService } from '../../../core/services/bundle-api.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink],
  selector: 'app-store-detail',
  styleUrl: './store-detail.css',
  templateUrl: './store-detail.html',
})
export class StoreDetail {
  private storeApiService = inject(StoreApiService);
  private bundleApiService = inject(BundleApiService);
  private route = inject(ActivatedRoute);

  store = signal<Store | null>(null);
  bundles = signal<Bundle[]>([]);
  totalValue = signal(0);
  remainingValue = signal<number | null>(null);
  isLoadding = signal<boolean>(true);
  errorMessage = signal('');

  ngOnInit() {
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    const storeId = Number(idFromUrl);

    forkJoin({
      store: this.storeApiService.getStore(storeId),
      bundles: this.bundleApiService.getBundlesForStore(storeId),
    }).subscribe({
      next: (result) => {
        let total: number = 0;
        let index: number;

        for (index = 0; index < result.bundles.length; index++) {
          total = total + Number(result.bundles[index].total_value);
        }

        this.store.set(result.store);
        this.bundles.set(result.bundles);
        this.totalValue.set(total);

        if (result.store.value_limit !== null) {
          this.remainingValue.set(Number(result.store.value_limit) - total);
        } else {
          this.remainingValue.set(null);
        }

        this.isLoadding.set(false);
      },
      error: (error) => {
        this.isLoadding.set(false);

        if (error.status === 403) {
          this.errorMessage.set('Nije autorizovano');
        } else if (error.status === 404) {
          this.errorMessage.set('Prodavnica ne postoji');
        } else {
          this.errorMessage.set('nije ucitano');
        }
      },
    });
  }

  protected readonly isSecureContext = isSecureContext;
}
