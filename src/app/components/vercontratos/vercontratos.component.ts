import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ServicioAPIService } from '../servicio-api.service';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

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
  imports: [ReactiveFormsModule, CommonModule,  HttpClientModule],
  providers:[ServicioAPIService],
  templateUrl: './vercontratos.component.html',
  styleUrl: './vercontratos.component.css'
})
export class VercontratosComponent implements OnInit{
  constructor(private fb:FormBuilder, private apiService: ServicioAPIService){}
  formGroup!:FormGroup

  idUsuario:number = 2;
  data:any;

  ngOnInit(): void {
    this.formGroup = this.initForm();

    this.data = {'id_usuario': this.idUsuario};

     // Llamada a la API Flask usando el método getData del servicio
    this.apiService.getAPI(JSON.stringify(this.data), 'empresa/getempresa')
     .subscribe(
       response => {
         console.log('Datos recibidos:', response);
         this.data = response;
       },
       error => {
         console.error('Error al obtener los datos:', error);
       }
     );
  }

  initForm():FormGroup{
    return this.fb.group({
      nombre:[''],
      tipo:[''],
      color:[''],
      lugar:[''],
      fecha_inicio:[''],
      fecha_entrega:[''],
      id_contratista:[''],
    })
  }

  contrato:Contrato = {
    nombre: '',
    tipo:'',
    color:'',
    lugar:'',
    fecha_inicio: new Date(''),
    fecha_entrega: new Date(''),
    id_contratista: 0
  }


  OnSubmit():void{

    this.contrato = this.formGroup.value;

    console.log(this.contrato);



  }


}
