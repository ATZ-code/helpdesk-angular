import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login';

import { RegisterComponent } from './auth/register/register';

import { HomeComponent } from './dashboard/home/home';

import { TicketDetailComponent } from './dashboard/ticket-detail';

import { authGuard } from './auth/guards/auth-guard';

import { CreateTicketComponent } from './dashboard/create-ticket/create-ticket';


export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  {
    path: 'login',
    component: LoginComponent
  },


  {
    path: 'register',
    component: RegisterComponent
  },


  {
    path: 'dashboard',
    component: HomeComponent,
    canActivate: [authGuard]
  },

  {
  path: 'tickets/create',
  component: CreateTicketComponent,
  canActivate: [authGuard]
},

  {
    path: 'tickets/:id',
    component: TicketDetailComponent,
    canActivate: [authGuard]
  },


  {
    path: '**',
    redirectTo: 'login'
  }

];