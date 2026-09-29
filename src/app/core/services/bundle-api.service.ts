import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Bundle } from '../models/bundle.model';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

export interface CouponRowData {
  receiver_name: string | null;
  receiver_email: string | null;
  discount_amount: number;
  send_date: string | null;
  send_immediately: boolean;
  expires_at: string | null;
}

export interface TierRowData {
  quantity: number;
  amount: number;
  expires_at: string | null;
}

export interface CreateBundleData {
  name: string;
  description: string | null;
  expires_at: string | null;
  coupons: CouponRowData[];
  tiers: TierRowData[];
}
@Injectable({
  providedIn: 'root',
})

export class BundleApiService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getBundlesForStore(storeId: number): Observable<Bundle[]>{
    return this.http.get<ApiResponse<Bundle[]>>(this.apiUrl + '/stores/' + storeId + '/bundles')
      .pipe(
        map((response) => response.data)
      )
  }

  getBundle(bundleId: number): Observable<Bundle> {
    return this.http.get<ApiResponse<Bundle>>(this.apiUrl + '/bundles/' + bundleId ).pipe(
      map((response) => response.data)
    )
  }

  createBundle(storeId: number, data: CreateBundleData): Observable<Bundle> {
    return this.http.post<ApiResponse<Bundle>>(this.apiUrl + '/stores/' + storeId + '/bundles', data)
      .pipe(map((response) => response.data));
  }

  deleteBundle(bundleId: number)
  {
    return this.http.delete(this.apiUrl + '/bundles/' + bundleId);
  }

  resendAll(bundleId: number): Observable<{ message: string; sent: number; skipped: number }> {
    return this.http.post<{ message: string; sent: number; skipped: number }>(
      this.apiUrl + '/bundles/' + bundleId + '/resend-all',
      {},
    );
  }
}
