import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule,Location  } from '@angular/common';
import { ServicioAPIService } from '../servicio-api.service';
import { ApiResponse2,Contratista,editarContrato,RespuestaContratista,CrearContrato, ApiResponse, DeleteContra, CrearPaquete, ApiResponsePaquete, Paquete, eliminarPaquete, editarcontratista, eliminarContratista } from '../../interfaces';
import { Router } from '@angular/router';
import { formatDate  } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contratistas',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './contratistas.component.html',
  styleUrl: './contratistas.component.css'
})
export default class ContratistasComponent implements OnInit{
  constructor(private fb: FormBuilder,private location: Location, public servicio:ServicioAPIService, private router: Router) {}
  cargando:boolean = false
  arrayRecibido: any[] = [];
  formContratista!:FormGroup;
  ngOnInit(): void {
    this.servicio.currentArray.subscribe((array) => {
      this.arrayRecibido = array
    })
    this.formContratista = this.initFormContratis();
  }
  initFormContratis():FormGroup{
    return this.fb.group({
      id:[''],
      nombre:[''],
      edad:[''],
      ocupacion:[''],
      domicilio:[''],
      telefono:['']
    })
  }
  editarcontratista(){
    this.cargando = true
    console.log(this.formContratista.value);
    const {id,nombre,edad,ocupacion,domicilio,telefono} = this.formContratista.value
    let data:editarcontratista = {
      idContratista:id,
      nombre:nombre,
      edad:edad,
      ocupacion:ocupacion,
      domicilio:domicilio,
      telefono:telefono
    }
    const boton = document.getElementById('cerrar3') as HTMLButtonElement;
    if (boton) {
      console.log('click');
      boton.click(); // Simula el clic
    } else {
      console.error('No se encontró el botón con el ID "cerrar".');
    }
    this.servicio.editarContratista(data).subscribe({
      next: (response: ApiResponse) => {
        console.log(response);
        this.cargando = false
        Swal.fire({
          title: 'Contratista Actualizado',
          text: 'Contratista actualizado con exito',
          icon: 'success',
          confirmButtonText:'Continuar'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload()
          }
        });
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
      },
      complete: () => {
        this.cargando = false
        console.info('Solicitud completada.');
      },
    })
  }
  agregarinfo(indexcontratista:any){
    this.arrayRecibido.forEach(element => {
      if(indexcontratista === element.idContratista){
        console.log(element.idContratista);
        this.formContratista.get('id')?.setValue(element.idContratista)
        this.formContratista.get('nombre')?.setValue(element.nombre)
        this.formContratista.get('edad')?.setValue(element.edad)
        this.formContratista.get('ocupacion')?.setValue(element.ocupacion)
        this.formContratista.get('domicilio')?.setValue(element.domicilio)
        this.formContratista.get('telefono')?.setValue(element.telefono)
      }
    });
  }
  eliminar(id_contratista:any){
    this.cargando = true
    let data:eliminarContratista = {
      idContratista:id_contratista
    }
    Swal.fire({
      title: "Seguro que quieres eliminar el contratista?",
      text: "Esta acción es irreversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7066e0",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Si, eliminar contratista!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.deleteContratista(data).subscribe({
          next: (response: ApiResponse) => {
            console.log(response);
            if(response.status){
              this.cargando = false
              Swal.fire({
                title: "Contratista eliminado!",
                text: "Contratista eliminado con exito.",
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
