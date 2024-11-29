import { Component } from '@angular/core';
import { ServicioAPIService } from '../../servicio-api.service';

@Component({
  selector: 'app-base-datos',
  standalone: true,
  imports: [],
  providers: [ServicioAPIService],
  templateUrl: './base-datos.component.html',
  styleUrl: './base-datos.component.css'
})
export class BaseDatosComponent {

}
