import { Component, OnInit } from '@angular/core';
import { ServicioAPIService } from '../../servicio-api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [HttpClientModule],
  providers:[ServicioAPIService],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})


export default class TodosComponent implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // this.recuperarGraficas(this.usuario).subscribe(
    //   response => {
    //     this.data = response;
    //     this.router.navigate(['/sign-in']);
    //     console.log(this.data);
    //   },
    //   error => {
    //     console.error('Error al registrar usuario', error);
    //   }
    // );

  }

}
