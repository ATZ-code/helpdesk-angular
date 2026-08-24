import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthService
} from '../../core/services/auth.service';


export const roleGuard: CanActivateFn =
  (route, state) => {

    const authService =
      inject(AuthService);

    const router =
      inject(Router);


   
    if (!authService.isAuthenticated()) {

      return router.createUrlTree(
        ['/login'],
        {
          queryParams: {
            returnUrl: state.url
          }
        }
      );

    }


    const role =
      authService.getRole();


   
    const allowedRoles =
      route.data?.['roles'] as string[];


    if (
      allowedRoles &&
      allowedRoles.includes(role || '')
    ) {

      return true;

    }


    
    return router.createUrlTree(
      ['/dashboard']
    );

  };