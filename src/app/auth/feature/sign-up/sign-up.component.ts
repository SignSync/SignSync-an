import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup} from '@angular/forms';

interface Usuario{
  usuario:string,
  correo:string,
  contrasena:string
}
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export default class SignUpComponent implements OnInit{
  constructor(private fb:FormBuilder){}

  formGroup!:FormGroup;
  usuario:Usuario = {
    usuario:'',
    correo:'',
    contrasena:''
  }

  ngOnInit(): void {
    this.formGroup = this.initForm();
  }

  initForm():FormGroup{
    return this.fb.group({
      usuario:[''],
      correo:[''],
      contrasena:[''],
    })
  }

  onSubmit():void{
    this.usuario = this.formGroup.value;
    console.log('Datos: ');
    console.log(this.usuario);
  }
}
