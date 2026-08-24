import { HttpInterceptorFn } from '@angular/common/http';

import {
  inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const platformId = inject(PLATFORM_ID);


  // Durante SSR no existe localStorage
  if (!isPlatformBrowser(platformId)) {

    return next(req);

  }


  const token = localStorage.getItem('accessToken');


  const isLoginRequest =
    req.url.includes('/auth/login');

  const isRefreshRequest =
    req.url.includes('/auth/refresh');


  // Login y refresh no llevan access token
  if (
    !token ||
    isLoginRequest ||
    isRefreshRequest
  ) {

    return next(req);

  }


  const request = req.clone({

    setHeaders: {

      Authorization: `Bearer ${token}`

    }

  });


  return next(request);

};