import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import NavegacionComponent from './components/navegacion/navegacion.component';
export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    loadChildren: () => import('./auth/feature/auth.routes')
  },
  {
    path:'',
    component: NavegacionComponent,
    loadChildren: () => import('./components/components.routes')
  },
  {
    path:'*',
    redirectTo: ''
  }

];
