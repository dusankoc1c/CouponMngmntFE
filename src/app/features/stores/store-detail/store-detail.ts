import { Component, inject, signal } from '@angular/core';
import { StoreApiService } from '../../../core/services/store-api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '../../../core/models/store.model';
import { Bundle } from '../../../core/models/bundle.model';
import { forkJoin } from 'rxjs';
import { BundleApiService } from '../../../core/services/bundle-api.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { StoreEditModal } from '../store-edit-modal/store-edit-modal';
import { BundleAddModal } from '../../bundles/bundle-add-modal/bundle-add-modal';

@Component({
  imports: [CurrencyPipe, DatePipe, RouterLink, StoreEditModal, BundleAddModal],
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
  isLoading = signal<boolean>(true);
  errorMessage = signal('');

  storeId = signal(0);
  ngOnInit() {
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    this.storeId.set(Number(idFromUrl));

    forkJoin({
      store: this.storeApiService.getStore(this.storeId()),
      bundles: this.bundleApiService.getBundlesForStore(this.storeId()),
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

        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);

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

  onDeleteBundle(bundleId: number) {
    const confirmed = confirm('Obrisi ovaj bundle?');
    if (!confirmed) {
      return;
    }

    this.bundleApiService.deleteBundle(bundleId).subscribe({
      next: (result) => {
        const remainingBundles = this.bundles().filter((bundle) => bundle.id !== bundleId);

        this.bundles.set(remainingBundles);
        this.updateTotalValue(remainingBundles, this.store());
      },
      error: (error) => {
        alert('Brisanje nije uspelo');
      },
    });
  }

  private updateTotalValue(bundles: Bundle[], store: Store | null) {
    let total: number = 0;
    let index: number;

    for (index = 0; index < bundles.length; index++) {
      total = total + Number(bundles[index].total_value);
    }

    this.totalValue.set(total);

    if (store != null && store.value_limit !== null) {
      this.remainingValue.set(Number(store.value_limit) - total);
    } else {
      this.remainingValue.set(null);
    }
  }

  isEditModalOpen = signal(false);

  onOpenEditModal() {
    this.isEditModalOpen.set(true);
  }

  onEditModalClose() {
    this.isEditModalOpen.set(false);
  }

  onEditModalSaved(updatedStore: Store) {
    this.store.set(updatedStore);
    this.isEditModalOpen.set(false);
  }

  isAddBundleModalOpen = signal(false);
  onOpenAddBundleModal() {
    this.isAddBundleModalOpen.set(true);
  }

  onAddBundleModalClosed() {
    this.isAddBundleModalOpen.set(false);
  }

  onBundleSaved(newBundle: Bundle): void {
    const updatedBundles = [...this.bundles(), newBundle];
    this.bundles.set(updatedBundles);
    this.updateTotalValue(updatedBundles, this.store());
    this.isAddBundleModalOpen.set(false);
  }
}
