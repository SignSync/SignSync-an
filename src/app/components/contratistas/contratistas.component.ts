import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contratistas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contratistas.component.html',
  styleUrl: './contratistas.component.css'
})
export default class ContratistasComponent {
  cargando:boolean = false
}
