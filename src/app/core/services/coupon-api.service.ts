import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Coupon } from '../models/coupon.model';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class CouponApiService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getCouponsForBundle(bundleId : number): Observable<Coupon[]>{
    return this.http.get<ApiResponse<Coupon[]>>(this.apiUrl + '/bundles/' + bundleId + '/coupons')
      .pipe(
        map((response) => response.data)
      )
  }

}
