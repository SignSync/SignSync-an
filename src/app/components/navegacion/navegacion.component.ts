import { Component,InputOptions,OnInit,ViewChild  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VistaContratoComponent } from "../vista-contrato/vista-contrato.component";
import { VercontratosComponent } from '../vercontratos/vercontratos.component';
import { CommonModule } from '@angular/common';
import { ServicioAPIService } from '../servicio-api.service';
import { Router } from '@angular/router';
import { ApiResponse, ContratoApi, ContratoApi2, CrearContrato2 } from '../../interfaces';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { infoEmpresa,ApiResponseEmpresa,CrearContratista,Contratista,CrearContrato} from '../../interfaces';
import Swal from 'sweetalert2'
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
  contratos:ContratoApi|any
  contratosProximos:ContratoApi |any
  contratosCercanos:ContratoApi |any
  contratosConTiempo:ContratoApi |any
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
      this.obtenerContratos()
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
            //console.log(this.contratislista);
            this.servicio.actualizarArray(this.contratislista)
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
        const boton = document.getElementById('cerrar2') as HTMLButtonElement;
        if (boton) {
          console.log('click');

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
    this.cargando = true
    const {nombre,edad,ocupacion,domicilio,telefono} = this.formContratista.value
    let data:CrearContratista = {
      id_empresa: Number(this.id_empresa),
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
          const boton = document.getElementById('cerrar3') as HTMLButtonElement;
          if (boton) {
            boton.click(); // Simula el clic
          } else {
            console.error('No se encontró el botón con el ID "cerrar".');
          }
          this.formContratista.reset();
          this.obtenerContratista();
          this.cargando = false
          Swal.fire({
            title: 'Contratista Creado',
            text: 'Contratista Generado con exito',
            icon: 'success',
            confirmButtonText:'Continuar'
          })
        }
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
        this.cargando = false
      },
      complete: () => {
        console.info('Solicitud completada.');
        this.cargando = false
      },

    });

  }
  agregarcontrato() {
    this.cargando = true
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
    const data: CrearContrato2 = {
      idEmpresa: this.id_empresa,
      idContratista: id_contratista,
      nombre: nombre,
      tipo: tipo,
      lugar: lugar,
      fecha_inicio: fechaInicioFormateada,
      fecha_entrega: fechaEntregaFormateada,
      color: color
    };
    console.log(data);

    this.servicio.crearContrato(data).subscribe({

      next: (response: ApiResponse) => {
        console.log(response);
        console.log('Mensaje:', response.message);
        console.log('Estado:', response.status);
        if (response.status) {
          this.cargando = false
          console.log('Éxito al crear contrato');
          const boton = document.getElementById('cerrar') as HTMLButtonElement;
          if (boton) {
            boton.click();
          } else {
            console.error('No se encontró el botón con el ID "cerrar".');
          }
          this.formcontrato.reset();
          Swal.fire({
            title: 'Contrato Creado',
            text: 'Contrato generado con exito',
            icon: 'success',
            confirmButtonText:'Continuar'
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
        console.info('Solicitud completada.');
       this.cargando = false
      },
    });
  }
  terminar(){
    this.empresacreada = false;
    window.location.reload()
  }
  triggerOtherComponentFunction() {
    this.servicio.triggerFunction();
  }
  obtenerContratos(){
    this.cargando = true
    let id_usuario = this.servicio.getCookie('user_id')
    this.servicio.getContratos(this.id_empresa).subscribe({
      next: (response: ApiResponse) => {
        this.cargando = false
        this.contratos = response.contratos;
        console.log(response.contratos);
        this.clasificarContratos(this.contratos)
        this.contratos.forEach((element:ContratoApi) => {

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
    })
  }
  clasificarContratos(contratos: ContratoApi2[]) {

    console.log('Info recibida',contratos);

    this.contratosProximos = [];
    this.contratosCercanos = [];
    this.contratosConTiempo = [];

    contratos.forEach((contrato: ContratoApi2) => {
      console.log(contrato.dias_restantes);
        if (contrato.dias_restantes < 2) {
            this.contratosProximos.push(contrato);
        } else if (contrato.dias_restantes >= 2 && contrato.dias_restantes <= 7) {
            this.contratosCercanos.push(contrato);
        } else {
            this.contratosConTiempo.push(contrato);
        }
    });

    console.log("Contratos próximos a vencer:", this.contratosProximos);
    console.log("Contratos que faltan una semana o menos:", this.contratosCercanos);
    console.log("Contratos con más tiempo disponible:", this.contratosConTiempo);
}

}
