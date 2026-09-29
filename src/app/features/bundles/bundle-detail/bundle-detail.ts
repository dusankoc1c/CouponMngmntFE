import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BundleApiService } from '../../../core/services/bundle-api.service';
import { CouponApiService } from '../../../core/services/coupon-api.service';
import { Bundle } from '../../../core/models/bundle.model';
import { forkJoin } from 'rxjs';
import { Coupon } from '../../../core/models/coupon.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CouponAddModal } from '../../coupons/coupon-add-modal/coupon-add-modal';
import { extractErrorMessage } from '../../../core/utils/extract-error-message';
import { CsvImportModal } from '../csv-import-modal/csv-import-modal';
import { HostListener } from '@angular/core';

@Component({
  imports: [RouterLink, CurrencyPipe, DatePipe, CouponAddModal, CsvImportModal],
  selector: 'app-bundle-detail',
  styleUrl: './bundle-detail.css',
  templateUrl: './bundle-detail.html',
})
export class BundleDetail {
  private route = inject(ActivatedRoute);
  private bundleApiService = inject(BundleApiService);
  private couponApiService = inject(CouponApiService);

  bundle = signal<Bundle | null>(null);
  coupons = signal<Coupon[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  bundleId = signal(0);

  ngOnInit() {
    const idFromUrl = this.route.snapshot.params['id'];
    this.bundleId.set(Number(idFromUrl));

    forkJoin({
      bundle: this.bundleApiService.getBundle(this.bundleId()),
      coupon: this.couponApiService.getCouponsForBundle(this.bundleId()),
    }).subscribe({
      next: (res) => {
        this.bundle.set(res.bundle);
        this.coupons.set(res.coupon);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage = err.message;
      },
    });
  }

  onToggleUsed(couponId: number): void {
    this.couponApiService.toggleUsed(couponId).subscribe({
      next: (updatedCoupon) => {
        const updatedCoupons = this.coupons().map((coupon) => {
          if (coupon.id === updatedCoupon.id) {
            return updatedCoupon;
          }

          return coupon;
        });

        this.coupons.set(updatedCoupons);
      },
      error: () => {
        alert('Izmena statusa nije uspela.');
      },
    });
  }

  isAddCouponModalOpen = signal(false);

  onOpenAddCouponModal(): void {
    this.isAddCouponModalOpen.set(true);
  }

  onAddCouponModalClosed(): void {
    this.isAddCouponModalOpen.set(false);
  }

  onCouponSaved(newCoupon: Coupon): void {
    const updatedCoupons = [...this.coupons(), newCoupon];
    this.coupons.set(updatedCoupons);
    this.isAddCouponModalOpen.set(false);
  }

  successMessage = signal('');
  private showSuccessMessage(message: string): void {
    this.successMessage.set(message);

    setTimeout(() => {
      this.successMessage.set('');
    }, 3000);
  }

  onResendInitial(couponId: number): void {
    this.couponApiService.resendInitial(couponId).subscribe({
      next: () => {
        this.showSuccessMessage('Inicijalni mejl poslat');
        this.resfreshCoupons(couponId);
      },
      error: (err) => {
        alert(extractErrorMessage(err));
      },
    });
  }

  onResendReminder(couponId: number): void {
    this.couponApiService.resendReminder(couponId).subscribe({
      next: () => {
        this.showSuccessMessage('Reminder mejl je ponovo poslat.');
        this.reloadCoupons();
      },
      error: (err) => {
        alert(extractErrorMessage(err));
      },
    });
  }

  onResendAll(): void {
    this.bundleApiService.resendAll(this.bundleId()).subscribe({
      next: (result) => {
        this.showSuccessMessage(
          'Poslato: ' + result.sent + ', preskoceno: ' + result.skipped + '.',
        );
        this.reloadCoupons();
      },
      error: () => {
        alert('Slanje nije uspelo.');
      },
    });
  }

  private resfreshCoupons(couponId: number): void {
    this.couponApiService.getCouponsForBundle(this.bundleId()).subscribe((freshCoupons) => {
      this.coupons.set(freshCoupons);
    });
  }

  private reloadCoupons(): void {
    this.couponApiService.getCouponsForBundle(this.bundleId()).subscribe((freshCoupons) => {
      this.coupons.set(freshCoupons);
    });
  }

  isImportModalOpen = signal(false);

  onOpenImportModal(): void {
    this.isImportModalOpen.set(true);
  }

  onImportModalClosed(): void {
    this.isImportModalOpen.set(false);
  }

  onImportFinished(): void {
    this.isImportModalOpen.set(false);
    this.showSuccessMessage('Kuponi su uvezeni.');
    this.reloadCoupons();
  }

  openDropdownId = signal<number | null>(null);

  toggleDropdown(couponId: number, event: Event): void {
    event.stopPropagation();

    if (this.openDropdownId() === couponId) {
      this.openDropdownId.set(null);
    } else {
      this.openDropdownId.set(couponId);
    }
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.openDropdownId.set(null);
  }
}
