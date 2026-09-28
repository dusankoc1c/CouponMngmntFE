import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BundleApiService } from '../../../core/services/bundle-api.service';
import { CouponApiService } from '../../../core/services/coupon-api.service';
import { Bundle } from '../../../core/models/bundle.model';
import { forkJoin } from 'rxjs';
import { Coupon } from '../../../core/models/coupon.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports: [RouterLink, CurrencyPipe, DatePipe],
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

  ngOnInit() {
    const idFromUrl = this.route.snapshot.params['id'];
    const bundleId = Number(idFromUrl);

    forkJoin({
      bundle: this.bundleApiService.getBundle(bundleId),
      coupon: this.couponApiService.getCouponsForBundle(bundleId),
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
}
