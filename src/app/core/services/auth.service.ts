import {
  Injectable,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import {
  Observable,
  tap
} from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';

import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;


  constructor(
    private http: HttpClient,

    @Inject(PLATFORM_ID)
    private platformId: Object
  ) {}


  private isBrowser(): boolean {

    return isPlatformBrowser(this.platformId);

  }


  login(data: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      data
    ).pipe(

      tap((respuesta) => {

        if (!this.isBrowser()) {
          return;
        }

        localStorage.setItem(
          'accessToken',
          respuesta.accessToken
        );

        localStorage.setItem(
          'refreshToken',
          respuesta.refreshToken
        );

        localStorage.setItem(
          'user',
          JSON.stringify(respuesta.user)
        );

      })

    );

  }


  refreshToken(): Observable<LoginResponse> {

    const refreshToken = this.getRefreshToken();

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/refresh`,
      {
        refreshToken: refreshToken
      }
    ).pipe(

      tap((respuesta) => {

        if (!this.isBrowser()) {
          return;
        }

        localStorage.setItem(
          'accessToken',
          respuesta.accessToken
        );

        localStorage.setItem(
          'refreshToken',
          respuesta.refreshToken
        );

        localStorage.setItem(
          'user',
          JSON.stringify(respuesta.user)
        );

      })

    );

  }


  getAccessToken(): string | null {

    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem('accessToken');

  }


  getRefreshToken(): string | null {

    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem('refreshToken');

  }


  getUser(): any | null {

    if (!this.isBrowser()) {
      return null;
    }

    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    try {

      return JSON.parse(user);

    } catch {

      return null;

    }

  }


  getRole(): string | null {

    const user = this.getUser();

    return user ? user.role : null;

  }


  isAuthenticated(): boolean {

    return this.getAccessToken() !== null;

  }


  logout(): Observable<any> {

    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {

      this.clearSession();

      return new Observable(observer => {

        observer.next(null);
        observer.complete();

      });

    }


    return this.http.post<any>(
      `${this.apiUrl}/auth/logout`,
      {
        refreshToken: refreshToken
      }
    ).pipe(

      tap(() => {

        this.clearSession();

      })

    );

  }


  clearSession(): void {

    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

  }

}