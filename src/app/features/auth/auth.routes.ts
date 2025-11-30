import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Sign In - Pawshop',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign Up - Pawshop',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
