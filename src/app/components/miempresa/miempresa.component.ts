import { Component, OnInit } from '@angular/core';
import { ServicioAPIService } from '../servicio-api.service';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApiResponse, ApiResponseEmpresa, editarContrato, EditarEmpresa } from '../../interfaces';
@Component({
  selector: 'app-miempresa',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './miempresa.component.html',
  styleUrl: './miempresa.component.css'
})
export default class MiempresaComponent implements OnInit{
  constructor(private fb:FormBuilder, public servicio:ServicioAPIService, private router:Router){}
  formempresa!:FormGroup
  idUsuario:number|any
  datosempresa:ApiResponseEmpresa |any= {}
  cargando:boolean = false
  ngOnInit(): void {
    this.cargando = true
    this.formempresa = this.initFormEditarEmpresa();
    this.idUsuario = this.servicio.getCookie('user_id')
    if(this.idUsuario){
      console.log(this.idUsuario);
      this.servicio.getEmpresa(this.idUsuario).subscribe({
        next: (response: ApiResponse) => {
          this.cargando = false
          if(response.status){
            console.log(response);
            this.datosempresa = response.empresa
            console.log(this.datosempresa);
            this.actualizarvalues()
          }
        },
        error: (err) => {
          this.cargando = false
          //console.error('Error al realizar la solicitud:', err);
        },
        complete: () => {
          this.cargando = false
          console.info('Solicitud completada.');
        },

      });
    }else{
      Swal.fire({
        title: "No cuentas con empresa!",
        text: "Porfavor de terminar tu perfil para poder tener acceso a esta seccion",
        icon: "warning",
        confirmButtonText: 'Continuar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['contratos'])
        }
      });
    }
  }
  initFormEditarEmpresa():FormGroup{
    return this.fb.group({
      nombre:[''],
      sector:[''],
      correo:[''],
      telefono:[''],
      sitio_web:[''],
      descripcion:['']
    })
  }
  actualizarvalues(){
    this.formempresa.get('nombre')?.setValue(this.datosempresa.nombre)
    this.formempresa.get('sector')?.setValue(this.datosempresa.sector)
    this.formempresa.get('correo')?.setValue(this.datosempresa.correo)
    this.formempresa.get('telefono')?.setValue(this.datosempresa.telefono)
    this.formempresa.get('sitio_web')?.setValue(this.datosempresa.sitio_web)
    this.formempresa.get('descripcion')?.setValue(this.datosempresa.descripcion)
  }
  onSubmit(){
    this.cargando = true
    console.log(this.formempresa.value);
    let id_usuario = this.servicio.getCookie('user_id')
    const {nombre,sector,telefono,correo,sitio_web,descripcion} = this.formempresa.value
    let data: EditarEmpresa = {
      id_usuario: id_usuario,
      nombre:nombre,
      sector:sector,
      correo:correo,
      telefono:telefono,
      sitio_web:sitio_web,
      descripcion:descripcion
    }
    this.servicio.editarEmpresa(data).subscribe({
      next: (response: ApiResponse) => {
        this.cargando = false
        if(response.status){
          console.log(response);
          Swal.fire({
            title: 'Datos de la empresa actualizados',
            text: 'Informacion actualizada con exito',
            icon: 'success',
            confirmButtonText:'Continuar'
          });
        }
      },
      error: (err) => {
        this.cargando = false
        //console.error('Error al realizar la solicitud:', err);
      },
      complete: () => {
        this.cargando = false
        console.info('Solicitud completada.');
      },
    })
  }
}
