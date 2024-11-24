import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ServDashboardService } from '../serv-dashboard.service';
import { dashboardResponse } from '../../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-graficas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './graficas.component.html',
  styleUrl: './graficas.component.css'
})
export default class GraficasComponent implements OnInit {

  constructor(private serv:ServDashboardService, private route: ActivatedRoute, private router:Router) {}

  context!:object;
  param!:string;
  graficas:any[] = []

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const param = params.get('grafica') ?? '';

      this.serv.recuperarGraficas(param).subscribe({
        next: (response: dashboardResponse) => {
          this.param = param;
          console.log('Mensaje:', response.message);
          console.log('Estado:', response.status);
          console.log('Context:', response.context);
          this.graficas = response.context['preguntas_url'];
          console.log(this.graficas)
          // this.procesarDatos(response.context, param);
        },
        error: (err:any) => {
          console.error('Error al realizar la solicitud:', err);
        },
        complete: () => {
          console.info('Solicitud completada.');
        },
      });
    });

  }

  getURL_img(url:string):string{
    return `http://127.0.0.1:5000/${url}`
  }

  navigateToUrl(tabla:string):void {
    this.router.navigate([`dashboard/graficas/${tabla}`]);
  }
}
