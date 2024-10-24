import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VistaContratoComponent } from "../vista-contrato/vista-contrato.component";
import { VercontratosComponent } from '../vercontratos/vercontratos.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [RouterOutlet,VistaContratoComponent, VercontratosComponent],
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css'
})
export default class NavegacionComponent {


}
