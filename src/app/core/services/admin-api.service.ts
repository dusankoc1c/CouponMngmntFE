import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getAdmins(): Observable<User[]> {
    return this.http
      .get<ApiResponse<User[]>>(this.apiUrl + '/admins')
      .pipe(map((response) => response.data));
  }

  updateAdmin(adminId: number, data: { name: string; email: string }): Observable<User> {
    return this.http
      .put<ApiResponse<User>>(this.apiUrl + '/admins/' + adminId, data)
      .pipe(map((response) => response.data));
  }

  deleteAdmin(adminId: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/admins/' + adminId);
  }

  sendInvite(data: {email: string; value_limit : number | null}){
    return this.http.post(this.apiUrl + '/invite', data)
  }

  exportAll(data: {store_ids: number[]; created_from? : string; created_to? : string; amount_min : number; amount_max : number;}):Observable<Blob>
  {
    return this.http.post(this.apiUrl + '/export-all', data, {responseType: 'blob'});
  }
}
