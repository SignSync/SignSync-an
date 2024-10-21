import { Component } from '@angular/core';
import { VistaContratoComponent } from "../vista-contrato/vista-contrato.component";
import { VercontratosComponent } from '../vercontratos/vercontratos.component';

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [VistaContratoComponent, VercontratosComponent],
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css'
})
export default class NavegacionComponent {

}
