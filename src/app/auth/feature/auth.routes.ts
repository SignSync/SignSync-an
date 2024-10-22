import { Routes } from "@angular/router";
export default[
  {
      path:'sing-in',
      loadComponent:()=> import('./sign-in/sign-in.component')
  },
  {
      path:'sing-up',
      loadComponent:()=> import('./sign-up/sign-up.component')
  }
] as Routes
