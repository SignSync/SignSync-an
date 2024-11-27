import { Component, OnInit } from '@angular/core';
import { ServicioAPIService } from '../servicio-api.service';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApiResponse, ApiResponseEmpresa, editarContrato, EditarEmpresa, EditarUsuario, EditarUsuarioApi } from '../../interfaces';
@Component({
  selector: 'app-miperfil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './miperfil.component.html',
  styleUrl: './miperfil.component.css'
})
export default class MiperfilComponent implements OnInit {
  formEditar!: FormGroup;
  cargando: boolean = false;
  id_user: number | any;
  infousuario: EditarUsuario | any;
  correo:string|any
  dias: number[] = [];
  meses: { valor: string; nombre: string }[] = [
    { valor: '01', nombre: 'Enero' },
    { valor: '02', nombre: 'Febrero' },
    { valor: '03', nombre: 'Marzo' },
    { valor: '04', nombre: 'Abril' },
    { valor: '05', nombre: 'Mayo' },
    { valor: '06', nombre: 'Junio' },
    { valor: '07', nombre: 'Julio' },
    { valor: '08', nombre: 'Agosto' },
    { valor: '09', nombre: 'Septiembre' },
    { valor: '10', nombre: 'Octubre' },
    { valor: '11', nombre: 'Noviembre' },
    { valor: '12', nombre: 'Diciembre' },
  ];
  anios: number[] = []; // Array para los años.
  nombre_usuario:string = ''
  constructor(private fb: FormBuilder, public servicio: ServicioAPIService, private router: Router) {}

  ngOnInit(): void {
    this.cargando = true;
    this.formEditar = this.initFormEditarUsuario();
    this.id_user = this.servicio.getCookie('user_id');
    this.generarDias(31); // Inicia con 31 días por defecto.
    this.generarAnios(1960, 2030); // Genera los años del rango deseado.

    if (this.id_user) {
      this.servicio.getInfoUsuario(this.id_user).subscribe({
        next: (response: ApiResponse) => {
          this.cargando = false;
          if (response.status) {
            console.log(response);
            this.infousuario = response.usuario;
            this.actualizardatos()
          }
        },
        error: (err) => {
          this.cargando = false;
          console.error('Error al realizar la solicitud:', err);
        },
        complete: () => {
          this.cargando = false;
          console.info('Solicitud completada.');
        },
      });
    }

    // Escucha cambios en el mes para ajustar los días.
    this.formEditar.get('mes')?.valueChanges.subscribe((mes) => {
      this.actualizarDias(mes);
    });
  }

  initFormEditarUsuario(): FormGroup {
    return this.fb.group({
      genero: [''],
      nombre: [''],
      dia: [''],
      mes: [''],
      anio: [''],
    });
  }

  generarDias(cantidad: number): void {
    this.dias = Array.from({ length: cantidad }, (_, i) => i + 1);
  }

  generarAnios(inicio: number, fin: number): void {
    this.anios = Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
  }

  actualizarDias(mes: number): void {
    const anio = this.formEditar.get('anio')?.value || new Date().getFullYear();
    const diasEnMes = new Date(anio, mes, 0).getDate(); // Calcula los días en el mes.
    this.generarDias(diasEnMes);
  }
  actualizardatos() {
    let datos: EditarUsuario = this.infousuario[0];
    this.correo = datos.correo;
    this.formEditar.get('nombre')?.setValue(datos.usuario);
    this.nombre_usuario = datos.usuario
  
    if (datos.sexo != null) {
      this.formEditar.get('genero')?.setValue(datos.sexo);
    }
  
    if (datos.fecha_nacimiento) {
      let fecha = new Date(datos.fecha_nacimiento);
      let dia = fecha.getDate();
      let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      let anio = fecha.getFullYear();
      console.log(`Día: ${dia}, Mes: ${mes}, Año: ${anio}`);
      this.formEditar.get('dia')?.setValue(dia);
      this.formEditar.get('mes')?.setValue(mes);
      this.formEditar.get('anio')?.setValue(anio);
    }
  }
  
  onSubmit() {
    this.cargando = true
    console.log(this.formEditar.value);
    const {genero,nombre,dia,mes,anio} = this.formEditar.value
    let fecha_nacimiento = (anio+'-'+mes+'-'+dia)
    console.log(fecha_nacimiento);
    let data:EditarUsuarioApi = {
      idUsuario:this.id_user,
      usuario:nombre,
      sexo:genero,
      fecha_nacimiento:fecha_nacimiento
    }
    this.servicio.editarUsuario(data).subscribe({
      next: (response: ApiResponse) => {
        this.cargando = false;
        if (response.status) {
          this.nombre_usuario = nombre
          Swal.fire({
            title: 'Datos de usuario actualizados',
            text: 'Informacion actualizada con exito',
            icon: 'success',
            confirmButtonText:'Continuar'
          }).then((result) => {
            if (result.isConfirmed) {
              
            }
          });
        }
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al realizar la solicitud:', err);
      },
      complete: () => {
        this.cargando = false;
        console.info('Solicitud completada.');
      }
    })
  }
  datosnuevos(){
    this.cargando = true
    this.servicio.getInfoUsuario(this.id_user).subscribe({
      next: (response: ApiResponse) => {
        this.cargando = false;
        if (response.status) {
          this.cargando = false
          console.log(response);
          this.infousuario = response.usuario;
          this.actualizardatos()
        }
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al realizar la solicitud:', err);
      },
      complete: () => {
        this.cargando = false;
        console.info('Solicitud completada.');
      },
    });
  }
}
