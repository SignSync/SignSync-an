import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, FormBuilder } from '@angular/forms';

//IMPORTAR HTTP
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // Importa esto

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
  private apiUrl = 'http://127.0.0.1:5000/api';
  constructor(private fb:FormBuilder, private http: HttpClient){}

  data:any;

  formGroup!:FormGroup;
  usuario:Usuario = {
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
