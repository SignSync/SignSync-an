import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';

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
export class VercontratosComponent {
  constructor(private fb:FormBuilder){}
  formGroup!:FormGroup

  ngOnInit(): void {
    this.formGroup = this.initForm();
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

    console.log(this.contrato)

  }


}
