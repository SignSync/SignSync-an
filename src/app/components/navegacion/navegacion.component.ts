import { Component,InputOptions,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VistaContratoComponent } from "../vista-contrato/vista-contrato.component";
import { VercontratosComponent } from '../vercontratos/vercontratos.component';
import { CommonModule } from '@angular/common';
import { ServicioAPIService } from '../servicio-api.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../../interfaces';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { infoEmpresa,ApiResponseEmpresa,CrearContratista,Contratista,CrearContrato} from '../../interfaces';
@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [RouterOutlet,CommonModule,ReactiveFormsModule],
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css'
})
export default class NavegacionComponent implements OnInit{
  formContratista!:FormGroup;
  formcontrato!:FormGroup
  formempresa!:FormGroup
  id_empresa:number|any
  usuario:string = ''
  contratistas:boolean = false
  empresa:boolean = false
  id:number|any
  cargando:boolean = false
  empresacreada: boolean = false
  empresainfo:ApiResponseEmpresa|any
  contratislista:Contratista |any
  constructor(private fb:FormBuilder,public servicio:ServicioAPIService,private router: Router){}
  ngOnInit(): void {
    this.formContratista = this.initFormContratis();
    this.formcontrato = this.initFormContrato()
    this.formempresa = this.initFormCrearEmpresa();
    let nombreusuario = this.servicio.getCookie('user_name')
    this.id_empresa = this.servicio.getCookie('idEmpresa')
    if(nombreusuario){
      this.usuario = nombreusuario;
    }else{
      this.usuario = 'Usuario no identificado'
    }
    let id_usuario = this.servicio.getCookie('user_id')
    if(id_usuario){
      this.id = id_usuario
      this.obtenerContratista()
      this.obtenerEmpresa(id_usuario)
    }else{
      this.router.navigate(['/sign-in']);
    }
  }
  initFormContratis():FormGroup{
    return this.fb.group({
      nombre:[''],
      edad:[''],
      ocupacion:[''],
      domicilio:[''],
      telefono:['']
    })
  }
  initFormContrato():FormGroup{
    return this.fb.group({
      nombre:[''],
      tipo:[''],
      color:[''],
      lugar:[''],
      fecha_inicio:[''],
      fecha_entrega:[''],
      id_contratista:['']
    })
  }
  initFormCrearEmpresa():FormGroup{
    return this.fb.group({
      nombre:[''],
      sector:[''],
      ubicacion:[''],
      correo:[''],
      telefono:[''],
      sitio_web:[''],
      descripcion:['']
    })
  }
  cerrarsesion(){
    this.servicio.clearUserData();
    this.router.navigate(['sign-in']);
  }
  obtenerEmpresa(id_usuario:any){
    this.servicio.getEmpresa(id_usuario).subscribe({
      next: (response: ApiResponse) => {
        if(response.status){
          this.empresa = true
          this.empresainfo = response.empresa
          this.servicio.saveUserEmpresa(this.empresainfo.idEmpresa)
          this.id_empresa = this.servicio.getCookie('idEmpresa')
          console.log(this.id_empresa);
          this.obtenerContratista()
        }
      },
      error: (err) => {
        //console.error('Error al realizar la solicitud:', err);
        this.empresa = false
      },
      complete: () => {
        console.info('Solicitud completada.');
      },

    });
  }
  obtenerContratista(){

    if(this.id_empresa){
      this.servicio.getContratista(this.id_empresa).subscribe({
        next: (response: ApiResponse) => {
          if(response.status){
            this.contratistas = true
            this.contratislista = response.contratistas;
            console.log(this.contratislista);

          }
        },
        error: (err) => {
          //console.error('Error al realizar la solicitud:', err);
          this.contratistas = false
        },
        complete: () => {
          console.info('Solicitud completada.');
        },

      });
    }

  }
  agregarempresa(){
    this.cargando = true
    const {nombre,sector,ubicacion,correo,telefono,sitio_web,descripcion} = this.formempresa.value
    const data:infoEmpresa = {
      id_usuario:this.id,
      nombre:nombre,
      sector:sector,
      correo:correo,
      telefono:telefono,
      sitio_web:sitio_web,
      descripcion:descripcion
    }
    this.servicio.crearEmpresa(data).subscribe({
      next: (response: ApiResponse) => {
        console.log('Mensaje:', response.id_new_empresa);
        console.log('Estado:', response.status);
        if(response.status){
          this.cargando = false
          this.empresacreada = true
        }
        const boton = document.getElementById('cerrar') as HTMLButtonElement;
        if (boton) {
          boton.click(); // Simula el clic
        } else {
          console.error('No se encontró el botón con el ID "cerrar".');
        }
        this.obtenerEmpresa(this.id)
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
        this.cargando = false
      },
      complete: () => {
        console.info('Solicitud completada.');
      },

    });
  }
  agregarcontratista(){
    const {nombre,edad,ocupacion,domicilio,telefono} = this.formContratista.value
    let data:CrearContratista = {
      idEmpresa: this.id_empresa,
      nombre:nombre,
      edad:edad,
      ocupacion:ocupacion,
      domicilio:domicilio,
      telefono:telefono
    }
    console.log(data);

    this.servicio.crearContratista(data).subscribe({
      next: (response: ApiResponse) => {
        console.log(response);
        console.log('Mensaje:', response.message);
        console.log('Estado:', response.status);
        if (response.status) {
          console.log('Exito pa');
          const boton = document.getElementById('cerrar') as HTMLButtonElement;
          if (boton) {
            boton.click(); // Simula el clic
          } else {
            console.error('No se encontró el botón con el ID "cerrar".');
          }
          this.formContratista.reset();
          this.obtenerContratista();
        }
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
      },
      complete: () => {
        console.info('Solicitud completada.');
      },

    });

  }
  agregarcontrato() {
    const { nombre, tipo, color, lugar, fecha_inicio, fecha_entrega, id_contratista } = this.formcontrato.value;
    const formatearFecha = (fecha: string): string => {
      const date = new Date(fecha);
      return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    };
    const fechaInicioFormateada = formatearFecha(fecha_inicio);
    const fechaEntregaFormateada = formatearFecha(fecha_entrega);
    console.log('Datos del formulario:', this.formcontrato.value);
    console.log('Fecha inicio formateada:', fechaInicioFormateada);
    console.log('Fecha entrega formateada:', fechaEntregaFormateada);
    const data: CrearContrato = {
      idEmpresa: this.id_empresa,
      idContratista: id_contratista,
      nombre: nombre,
      tipo: tipo,
      lugar: lugar,
      fecha_inicio: fechaInicioFormateada,
      fecha_entrega: fechaEntregaFormateada,
      color: color
    };

    this.servicio.crearContrato(data).subscribe({
      next: (response: ApiResponse) => {
        console.log(response);
        console.log('Mensaje:', response.message);
        console.log('Estado:', response.status);
        if (response.status) {
          console.log('Éxito al crear contrato');
          const boton = document.getElementById('cerrar') as HTMLButtonElement;
          if (boton) {
            boton.click();
          } else {
            console.error('No se encontró el botón con el ID "cerrar".');
          }
          this.formcontrato.reset();
          this.empresacreada = true;
        }
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
      },
      complete: () => {
        console.info('Solicitud completada.');
      },
    });
  }
  terminar(){
    this.empresacreada = false;
  }
}
