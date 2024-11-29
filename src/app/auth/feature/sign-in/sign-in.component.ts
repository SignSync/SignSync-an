import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ServicioAPIService } from '../../../components/servicio-api.service';
import { sign_in } from '../../../interfaces';
import { ApiResponse,ApiResponseEmpresa } from '../../../interfaces';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})


export default class SignInComponent{
  private apiUrl = 'http://127.0.0.1:5000/api/sign-in';
  constructor(private fb:FormBuilder,public servicio:ServicioAPIService,private router: Router){}

  data:any;
  idempresa:number|any
  mensajeapi = ''
  formGroup!:FormGroup;
  cargando:boolean = false;
  usuario:sign_in = {
    correo:'',
    contrasena:''
  }

  ngOnInit(): void {
    let nombreusuario = this.servicio.getCookie('user_name')
    if(nombreusuario){
      console.log(nombreusuario);

      this.router.navigate(['contratos'])
    }
    this.formGroup = this.initForm();
  }

  initForm():FormGroup{
    return this.fb.group({
      correo:[''],
      contrasena:[''],
    })
  }

  onSubmit(): void {
    this.mensajeapi = ''
    this.usuario = this.formGroup.value;
    this.cargando = true
    this.servicio.sign_in(this.usuario).subscribe({
      next: (response: ApiResponse) => {
        console.log('Mensaje:', response.message);
        console.log('Estado:', response.status);

        if (response.status) {
          console.log('Inicio de sesión exitoso');
          this.servicio.saveUserData({
            id: response.user_id,
            nombre: response.user_name,
            correo: response.correo
          })
          this.servicio.getEmpresa(response.user_id).subscribe({
            next: (response: ApiResponse) => {
              if(response.status){

                const valuesArray = Object.values(response.empresa);
                console.log(valuesArray);
                console.log(valuesArray[2]);
                this.servicio.saveUserEmpresa(valuesArray[2])
                console.log(this.servicio.getCookie('idEmpresa'));

                this.router.navigate(['/contratos']);
              }
            },
            error: (err) => {
              console.error('Error al realizar la solicitud:', err);
              this.router.navigate(['/contratos']);
            },
            complete: () => {
              console.info('Solicitud completada.');
            },

          });
        } else {
          this.mensajeapi = response.message
        }
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
      },
      complete: () => {
        console.info('Solicitud completada.');
        this.cargando = false
      },
    });
  }
}
