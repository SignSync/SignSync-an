import { Routes } from '@angular/router';

const navRoutes: unknown = [
  {
    path: 'contratos',
    loadComponent: () => import('./vercontratos/vercontratos.component').then(m => m.VercontratosComponent),
  },
  {
    path: 'vista',
    loadComponent: () => import('./vista-contrato/vista-contrato.component').then(m => m.VistaContratoComponent),
  }
];

// Fuerza la conversión a Routes
export default navRoutes as Routes;
