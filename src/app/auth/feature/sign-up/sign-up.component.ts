import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ApiResponse } from '../../../interfaces';
import { ServicioAPIService } from '../../../components/servicio-api.service';
interface Usuario{
  usuario:string,
  correo:string,
  contrasena:string
}
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export default class SignUpComponent implements OnInit{
  constructor(private fb:FormBuilder, private servicio:ServicioAPIService){}
  display = 'none'
  cargando:boolean = false;
  confirmar:boolean = false;
  mensajeerror = ''
  data: any;
  formGroup!:FormGroup;
  usuario:Usuario = {
    usuario:'',
    correo:'',
    contrasena:''
  }
  mensajeapi:string = ''
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
    this.cargando = true
    const {usuario,correo,contrasena} = this.formGroup.value
    this.usuario = {
      usuario:usuario,
      correo:correo,
      contrasena: contrasena
    }
    this.servicio.sign_up(this.usuario).subscribe({
      next: (response: ApiResponse) => {
        console.log('Mensaje:', response.message);
        console.log('Estado:', response.status);

        if (response.status) {
          console.log('Registro exitoso');
          this.cargando = false
          this.confirmar = true
        } else {
          this.mensajeapi = response.message
        }
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
        console.log(err.error.message)
        this.mensajeerror = err.error.message
        this.cargando = false
      },
      complete: () => {
        console.info('Solicitud completada.');
        this.cargando = false
      },

    });
  }
}
