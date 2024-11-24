import { Component, OnInit} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ServDashboardService } from '../serv-dashboard.service';
import { dashboardResponse } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  providers:[ServDashboardService],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})


export default class TodosComponent implements OnInit {

  constructor(private serv:ServDashboardService, private router:Router) {}

  context!:object;
  graficas: any[] = [];


  ngOnInit(): void {
    const param = 'todos';
    this.serv.recuperarGraficas(param).subscribe({
      next: (response: dashboardResponse) => {
        // console.log('Mensaje:', response.message);
        // console.log('Estado:', response.status);
        // console.log('Context:', response.context);
        this.context = response.context
        console.log(this.context)
        this.procesarDatos(response.context);


      },
      error: (err:any) => {
        console.error('Error al realizar la solicitud:', err);
      },
      complete: () => {
        console.info('Solicitud completada.');
      },
    });
  }

  procesarDatos(response: any): void {
    // Procesar cada contenido y agregarlo a la lista de gráficas
    this.graficas = [];

    const secciones = [
      { key: 'contentAceptabilidad', label: 'Aceptabilidad' },
      { key: 'contentCrecimiento', label: 'Crecimiento' },
      { key: 'contentFuncionalidad', label: 'Funcionalidad' },
      { key: 'contentRentabilidad', label: 'Rentabilidad' },
      { key: 'contentSatisfaccion', label: 'Satisfacción' },
      { key: 'contentViabilidad', label: 'Viabilidad' }
    ];

    for (const seccion of secciones) {
      const contenido = response[seccion.key];
      if (contenido && contenido.preguntas_url) {
        this.graficas.push({
          titulo: seccion.label,
          preguntas: contenido.preguntas_url // El array con las preguntas
        });
      }
    }

    console.log('Gráficas procesadas:', this.graficas);
  }

  getURL_img(url:string):string{
    return `http://127.0.0.1:5000/${url}`
  }

  navigateToUrl(tabla:string):void {
    this.router.navigate([`dashboard/graficas/${tabla}`]);
  }

}
