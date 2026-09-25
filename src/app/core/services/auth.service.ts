import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';


interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = 'http://127.0.0.1:8000/api';
  private http = inject(HttpClient);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.apiUrl + '/login', {
        email: email,
        password: password,
      })
      .pipe(
        tap((response) => {
          this.saveToken(response.token);
          this.saveUser(response.user);
        }),
      );
  }

  logout(): Observable<any> {
    return this.http.post(this.apiUrl + '/logout', {}).pipe(
      tap(() => {
        this.clearSession();
      }),
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('api_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('api_token');
  }

  saveUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  getUser(): User | null {
    const storedUser = localStorage.getItem('current_user');

    if (storedUser == null) {
      return null;
    }

    return JSON.parse(storedUser);
  }

  clearSession(): void {
    localStorage.removeItem('api_token');
    localStorage.removeItem('current_user');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null;
  }
}
