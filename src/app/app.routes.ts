import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/feature/auth.routes')
  },
  {
    path:'sign-in',
    loadComponent:()=> import('./auth/feature/sign-in/sign-in.component'),
  },
  {
    path:'sign-up',
    loadComponent:()=> import('./auth/feature/sign-up/sign-up.component')
  },{
    path:'inicio',
    loadComponent:()=> import('./components/navegacion/navegacion.component')
  },
  {
    path:'*',
    redirectTo: ''
  }

];
