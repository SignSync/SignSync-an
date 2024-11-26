import { Component, OnInit } from '@angular/core';
import { ServicioAPIService } from '../servicio-api.service';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApiResponse, ApiResponseEmpresa, editarContrato, EditarEmpresa, EditarUsuario } from '../../interfaces';
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
  actualizardatos(){
    let datos:EditarUsuario = this.infousuario[0]
    this.formEditar.get('nombre')?.setValue(datos.usuario)
    if (datos.sexo != null) {
      this.formEditar.get('genero')?.setValue(datos.sexo)
    }
    if (datos.fecha_nacimiento != null) {

    }


  }
  onSubmit() {
    console.log(this.formEditar.value);
  }
}
