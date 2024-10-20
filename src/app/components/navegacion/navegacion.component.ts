import { Component } from '@angular/core';
import { VistaContratoComponent } from "../vista-contrato/vista-contrato.component";

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [VistaContratoComponent],
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css'
})
export default class NavegacionComponent {

}
