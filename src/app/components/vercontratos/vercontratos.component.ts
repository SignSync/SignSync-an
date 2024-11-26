import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ServicioAPIService } from '../servicio-api.service';
import { ApiResponse, ContratoApi, DeleteContra } from '../../interfaces';
import { Element } from '@angular/compiler';
import { elementAt } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
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
  templateUrl: './vercontratos.component.html',
  styleUrl: './vercontratos.component.css'
})
export class VercontratosComponent implements OnInit{
  constructor(private fb:FormBuilder, public servicio:ServicioAPIService, private router:Router){}
  formGroup!:FormGroup
  id_empresa:number | any
  idUsuario:number = 2;
  data:any;
  contratos:ContratoApi|any
  cantidadContrato:number|any
  contratosActivos:number = 0
  contratosInactivos:number = 0
  cargando = false
  ngOnInit(): void {
    this.id_empresa = this.servicio.getCookie('idEmpresa')
    this.obtenerContratos();
    this.servicio.triggerFunction$.subscribe(() => {
      this.obtenerContratos();
    });
  }
  actualizat(){
    console.log('ya queda ');

  }
  obtenerContratos() {
    this.cargando = true
    if (this.id_empresa) {
      this.servicio.getContratos(this.id_empresa).subscribe({
        next: (response: ApiResponse) => {
          this.cargando = false
          this.contratos = response.contratos;
          this.cantidadContrato = this.contratos.length;
          console.log(this.contratos);
          this.contratos.forEach((Element:ContratoApi) => {
            if (Element.contrato_inicio) {
              this.contratosActivos ++
            }else{
              this.contratosInactivos ++
            }
          });
        },
        error: (err) => {
          console.error('Error al realizar la solicitud:', err);
          this.cargando = false
        },
        complete: () => {
          console.info('Solicitud completada.');
          this.cargando = false
        }
      });
    }else{
      console.log('No hay emprsa');

    }
  }
  eliminar(idContrato:any){
    this.cargando = true
    let data:DeleteContra = {
      idContrato:idContrato
    }
    console.log(data);

    Swal.fire({
      title: "Seguro que quieres eliminar el contrato?",
      text: "Esta acción es irreversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Si, eliminar contrato!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.deleteContrato(data).subscribe({
          next: (response: ApiResponse) => {
            console.log(response);
            if(response.status){
              this.cargando = false
              Swal.fire({
                title: "Contrato eliminado!",
                text: "Contrato eliminado con exito.",
                icon: "success",
                confirmButtonText: "Continuar"
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload()
                }
              });
            }
          },
          error: (err) => {
            console.error('Error al realizar la solicitud:', err);
            this.cargando = false
          },
          complete: () => {
            this.cargando = false
            console.info('Solicitud completada.');
            this.cargando = false
          },
        })
      }else if (result.isDismissed) {
        this.cargando = false
      }
    });
  }




}
