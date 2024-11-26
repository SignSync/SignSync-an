import { Routes } from '@angular/router';

const navRoutes: unknown = [
  {
    path: 'contratos',
    loadComponent: () => import('./vercontratos/vercontratos.component').then(m => m.VercontratosComponent),
  },
  {
    path: 'vista/:id_contrato',
    loadComponent: () => import('./vista-contrato/vista-contrato.component').then(m => m.VistaContratoComponent),
  },
  {
    path: 'miperfil',
    loadComponent: () => import('./miperfil/miperfil.component')
  },
  {
    path: 'miempresa',
    loadComponent: () => import('./miempresa/miempresa.component')
  },
  {
    path: 'calendario',
    loadComponent: () => import('./calendario/calendario.component')
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes')
  },
];

// Fuerza la conversión a Routes
export default navRoutes as Routes;
