import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import SignInComponent from './auth/feature/sign-in/sign-in.component';
import SignUpComponent from './auth/feature/sign-up/sign-up.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SignInComponent, SignUpComponent,CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SignSync_';
}
