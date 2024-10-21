import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup} from '@angular/forms';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Importa esto

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


interface Usuario{
  usuario:string,
  correo:string,
  contrasena:string
}
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})

export default class SignUpComponent implements OnInit{
  private apiUrl = 'http://127.0.0.1:5000/api/sign-up';
  constructor(private fb:FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router){}


  data: any;
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

    this.registrarUsuario(this.usuario).subscribe(
      response => {
        this.data = response;
        this.router.navigate(['/sign-in']);
        console.log(this.data);
      },
      error => {
        console.error('Error al registrar usuario', error);
      }
    );
  }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }
}
