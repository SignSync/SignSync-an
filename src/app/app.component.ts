import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import SignInComponent from './auth/feature/sign-in/sign-in.component';
import SignUpComponent from './auth/feature/sign-up/sign-up.component';
import { CommonModule } from '@angular/common';
import { ServicioAPIService } from './components/servicio-api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'SignSync_';
  constructor(public servicio:ServicioAPIService,private router: Router){}
  ngOnInit(): void {
    let nombreusuario = this.servicio.getCookie('user_name')
    if(nombreusuario){
      this.router.navigate(['contratos']);
    }
  }
}
