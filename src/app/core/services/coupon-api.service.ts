import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Coupon } from '../models/coupon.model';

export interface CreateCouponData {
  receiver_name: string | null;
  receiver_email: string | null;
  discount_amount: number;
  send_date: string | null;
  send_immediately: boolean;
  expires_at: string | null;
}
@Injectable({
  providedIn: 'root',
})
export class CouponApiService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getCouponsForBundle(bundleId: number): Observable<Coupon[]> {
    return this.http
      .get<ApiResponse<Coupon[]>>(this.apiUrl + '/bundles/' + bundleId + '/coupons')
      .pipe(map((response) => response.data));
  }

  toggleUsed(couponId: number): Observable<Coupon> {
    return this.http
      .post<ApiResponse<Coupon>>(this.apiUrl + '/coupons/' + couponId + '/toogle-used', {})
      .pipe(map((response) => response.data));
  }

  createCoupon(bundleId: number, data: CreateCouponData) {
    return this.http
      .post<ApiResponse<Coupon>>(this.apiUrl + '/bundles/' + bundleId + '/coupons', data)
      .pipe(map((response) => response.data));
  }

  resendInitial(couponId: number) {
    return this.http.post(this.apiUrl + '/coupons/' + couponId + '/resend-initial', {});
  }

  resendReminder(couponId: number) {
    return this.http.post(this.apiUrl + '/coupons/' + couponId + '/resend-reminder', {});
  }

  importCsv(bundleId: number, file: File) {
    const formData = new FormData();
    formData.append('csv_file', file);
    return this.http.post(this.apiUrl + '/bundles/' + bundleId + '/import-codes', formData)
  }
}
