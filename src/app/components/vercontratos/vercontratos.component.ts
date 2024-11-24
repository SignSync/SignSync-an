import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ServicioAPIService } from '../servicio-api.service';
import { ApiResponse, ContratoApi } from '../../interfaces';
interface Contrato {
  nombre:string,
  tipo:string,
  color:string,
  lugar:string,
  fecha_inicio:Date,
  fecha_entrega:Date,
  id_contratista:number
}

@Component({
  selector: 'app-vercontratos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers:[ServicioAPIService],
  templateUrl: './vercontratos.component.html',
  styleUrl: './vercontratos.component.css'
})
export class VercontratosComponent implements OnInit{
  constructor(private fb:FormBuilder, public servicio:ServicioAPIService){}
  formGroup!:FormGroup
  id_empresa:number | any
  idUsuario:number = 2;
  data:any;
  contratos:ContratoApi|any
  cantidadContrato:number|any
  contratosActivos:number = 0
  contratosInactivos:number = 0
  ngOnInit(): void {
    this.id_empresa = this.servicio.getCookie('idEmpresa')
    this.obtenerContratos();
  }
  obtenerContratos() {
    this.servicio.getContratos(this.id_empresa).subscribe({
      next: (response: ApiResponse) => {
        this.contratos = response.contratos;
        this.cantidadContrato = this.contratos.length;



        console.log('Contratos:', this.contratos);
        console.log('Contratos activos:', this.contratosActivos);
        console.log('Contratos inactivos:', this.contratosInactivos);
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
      },
      complete: () => {
        console.info('Solicitud completada.');
      }
    });
  }




}
