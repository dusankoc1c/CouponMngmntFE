import { inject, Inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Store } from '../models/store.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class StoreApiService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = Inject(Router);

  getStores(): Observable<Store[]> {
    return this.http
      .get<ApiResponse<Store[]>>(this.apiUrl + '/stores')
      .pipe(map((response) => response.data));
  }

  getStore(storeId: number): Observable<Store> {
    return this.http
      .get<ApiResponse<Store>>(this.apiUrl + '/stores/' + storeId)
      .pipe(map((response) => response.data));
  }

  updateStore(
    storeId: number,
    data: { name: string; description: string | null; reminder_days: number | null },
  ): Observable<Store> {
    return this.http
      .put<ApiResponse<Store>>(this.apiUrl + '/stores/' + storeId, data)
      .pipe(map((response) => response.data));
  }

  exportCodes(
    storeId: number,
    data: {
      bundle_ids: number[];
      created_from?: string;
      created_to?: string;
      status?: string;
      amount_min?: number;
      amount_max?: number;
    },
  ): Observable<Blob> {
    return this.http.post(this.apiUrl + '/stores/' + storeId + '/export-codes', data, {
      responseType: 'blob',
    });
  }
  getEmailTemplate(
    storeId: number,
  ): Observable<{ initial_email_template: string; reminder_email_template: string }> {
    return this.http.get<{ initial_email_template: string; reminder_email_template: string }>(
      this.apiUrl + '/stores/' + storeId + '/email-templates',
    );
  }

  updateEmailTemplate(
    storeId: number,
    data: { initial_email_template: string; reminder_email_template: string },
  ) {
    return this.http.put(this.apiUrl + '/stores/' + storeId + '/email-templates', data);
  }
}
