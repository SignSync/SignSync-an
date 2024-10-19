import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';

interface Usuario{
  correo:string,
  contrasena:string
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})


export default class SignInComponent {
  constructor(private fb:FormBuilder){}

  formGroup!:FormGroup;
  usuario:Usuario = {
    correo:'',
    contrasena:''
  }

  ngOnInit(): void {
    this.formGroup = this.initForm();
  }

  initForm():FormGroup{
    return this.fb.group({
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
