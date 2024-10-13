import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/feature/auth.routes')
  },
  {
    path:'*',
    redirectTo: ''
  }

];
