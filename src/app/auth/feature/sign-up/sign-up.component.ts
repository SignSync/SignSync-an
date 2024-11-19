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
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export default class SignUpComponent implements OnInit{
  constructor(private fb:FormBuilder, private servicio:ServicioAPIService){}
  display = 'none'
  cargando = false
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
    this.usuario = this.formGroup.value;
    this.servicio.sign_up(this.usuario).subscribe({
      next: (response: ApiResponse) => {
        console.log(response);

        console.log('Mensaje:', response.message);
        console.log('Estado:', response.status);

        if (response.status) {
          this.display = 'block'
        } else {
          this.cargando = false
          this.mensajeapi = response.message
        }
      }

    });
  }
}
