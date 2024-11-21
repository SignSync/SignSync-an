import { Routes } from '@angular/router';

const dashboardRoutes: unknown = [
  {
    path: 'graficas',
    loadComponent: () => import('./todos/todos.component')
  },
  {
    path: 'graficas/:grafica',
    loadComponent: () => import('./graficas/graficas.component')
  },
];

// Fuerza la conversión a Routes
export default dashboardRoutes as Routes;
