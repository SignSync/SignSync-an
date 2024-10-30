import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';
//IMPORTAR HTTP
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

interface Usuario{
  correo:string,
  contrasena:string
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})


export default class SignInComponent {
  private apiUrl = 'http://127.0.0.1:5000/api/sign-in';
  constructor(private fb:FormBuilder, private http: HttpClient){}

  data:any;

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

    this.iniciarSesion(this.usuario).subscribe(
      response => {
        this.data = response;
        console.log(this.data);
      },
      error => {
        console.error('Error al iniciar sesión', error);
      }
    );
  }

  iniciarSesion(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }
}
