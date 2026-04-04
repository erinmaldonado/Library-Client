import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from './login-request';
import { LoginResponse } from './login-response';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
interface JwtPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string | string[];
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token_key';
  private _authStatus = new BehaviorSubject<boolean>(false);
  public authStatus = this._authStatus.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  init() {
    if (this.isAuthenticated()) this.setAuthStatus(true);
  }

  setAuthStatus(status: boolean) { this._authStatus.next(status); }
  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  isAuthenticated(): boolean { return this.getToken() !== null; }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(environment.apiUrl + 'api/Admin/login', loginRequest)
      .pipe(tap(response => {
        if (response.success) {
          localStorage.setItem(this.tokenKey, response.token);
          this.setAuthStatus(true);
        }
      }));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.setAuthStatus(false);
    this.router.navigate(['/login']);
  }

  private getDecodedToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try { return jwtDecode<JwtPayload>(token); }
    catch { return null; }
  }

  getUserId(): string | null {
    return this.getDecodedToken()?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? null;
  }

  getRoles(): string[] {
    const payload = this.getDecodedToken();
    if (!payload) return [];
    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return Array.isArray(role) ? role : [role];
  }

  isAdmin(): boolean {
    return this.getRoles().includes('Administrator');
  }
}