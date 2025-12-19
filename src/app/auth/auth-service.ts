import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from './login-request';
import { LoginResponse } from './login-response';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private tokenKey = "token_key";
  private _authStatus = new BehaviorSubject<boolean>(false);
  public authStatus = this._authStatus.asObservable();
  
  constructor(private http: HttpClient, private router: Router) {
  }

  init(){
    if(this.isAuthenticated()){
      this.setAuthStatus(true);
    }
  }

  setAuthStatus(status: boolean) {
    this._authStatus.next(status);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(environment.apiUrl + 'api/Admin/login', loginRequest)
    .pipe(tap(response => {
      if(response.success){
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

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}