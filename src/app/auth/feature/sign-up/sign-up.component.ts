import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup} from '@angular/forms';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Importa esto



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
  private apiUrl = 'http://127.0.0.1:5000/api';
  constructor(private fb:FormBuilder,private http: HttpClient){}


  data: any;
  formGroup!:FormGroup;
  usuario:Usuario = {
    usuario:'',
    correo:'',
    contrasena:''
  }

  ngOnInit(): void {
    this.formGroup = this.initForm();
    this.getData().subscribe(response => {
      this.data = response;
      console.log(this.data);
    });
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

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
