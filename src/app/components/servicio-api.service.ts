import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // Importa esto

@Injectable({
  providedIn: 'root'
})
export class ServicioAPIService {
  private apiUrl = 'http://127.0.0.1:5000/api'
  constructor(private http: HttpClient) { }

  getAPI(data: any, api_link: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/${api_link}`, data, {headers});
  }
}



