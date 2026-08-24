import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError
} from 'rxjs';

import { inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';


// Indica si actualmente hay una renovación en progreso
let isRefreshing = false;


// Guarda el nuevo access token para las peticiones
// que llegaron mientras se estaba renovando
let refreshTokenSubject =
  new BehaviorSubject<string | null>(null);


export const tokenRefreshInterceptor: HttpInterceptorFn =
  (req, next) => {

    const authService = inject(AuthService);


    // No debemos intentar refrescar cuando estamos
    // haciendo login o precisamente el refresh
    const isRefreshRequest =
      req.url.includes('/auth/refresh');

    const isLoginRequest =
      req.url.includes('/auth/login');


    if (isLoginRequest || isRefreshRequest) {
      return next(req);
    }


    return next(req).pipe(

      catchError((error: HttpErrorResponse) => {

        // Verificamos específicamente el error
        // TOKEN_EXPIRED
        const tokenExpired =
          error.status === 401 &&
          error.error?.error?.code === 'TOKEN_EXPIRED';


        // Si es otro error, lo dejamos pasar
        if (!tokenExpired) {
          return throwError(() => error);
        }


        // Obtenemos el refresh token
        const refreshToken =
          authService.getRefreshToken();


        // Si no existe refresh token,
        // cerramos la sesión
        if (!refreshToken) {

          authService.clearSession();

          return throwError(() => error);
        }


        /*
         * PRIMERA PETICIÓN QUE DETECTA EL 401
         */
        if (!isRefreshing) {

          isRefreshing = true;

          // Limpiamos el valor anterior
          refreshTokenSubject.next(null);


          return authService.refreshToken().pipe(

            switchMap((respuesta) => {

              const newAccessToken =
                respuesta.accessToken;


              // Terminó la renovación
              isRefreshing = false;


              // Avisamos a todas las peticiones
              // que estaban esperando
              refreshTokenSubject.next(
                newAccessToken
              );


              // Reintentamos la petición original
              const request = req.clone({
                setHeaders: {
                  Authorization:
                    `Bearer ${newAccessToken}`
                }
              });


              return next(request);

            }),


            catchError((refreshError) => {

              // Terminó la renovación
              isRefreshing = false;


              /*
               * IMPORTANTE:
               *
               * Errorizamos el BehaviorSubject para
               * liberar las peticiones simultáneas
               * que estaban esperando.
               */
              refreshTokenSubject.error(
                refreshError
              );


              // Creamos uno nuevo para futuras
              // renovaciones
              refreshTokenSubject =
                new BehaviorSubject<string | null>(
                  null
                );


              // Limpiamos la sesión
              authService.clearSession();


              return throwError(
                () => refreshError
              );

            })

          );

        }


        /*
         * PETICIONES SIMULTÁNEAS
         *
         * Si otra petición recibió 401 mientras
         * la primera estaba renovando el token,
         * NO hacemos otro refresh.
         *
         * Esperamos el nuevo access token.
         */
        return refreshTokenSubject.pipe(

          filter(
            (token): token is string =>
              token !== null
          ),

          take(1),

          switchMap((token) => {

            // Reintentamos con el nuevo token
            const request = req.clone({
              setHeaders: {
                Authorization:
                  `Bearer ${token}`
              }
            });


            return next(request);

          })

        );

      })

    );

  };