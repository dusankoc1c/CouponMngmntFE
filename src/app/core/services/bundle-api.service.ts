import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Bundle } from '../models/bundle.model';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';


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
}
