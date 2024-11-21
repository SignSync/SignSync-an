import { Injectable } from '@angular/core';

import { Observable,   BehaviorSubject  } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { dashboardResponse } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ServDashboardService {
  private apiUrl = 'http://127.0.0.1:5000/api/graficos';
  // 127.0.0.1:5000/api/graficos?grafico=todos
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  constructor(private http: HttpClient) { }

  /**
   * Recupera los datos de una gráfica desde la API.
   * @param grafico Nombre de la gráfica a recuperar
   * @returns Observable con la respuesta de la API
   */
  recuperarGraficas(grafico: string): Observable<dashboardResponse> {
    const url = `${this.apiUrl}?grafico=${grafico}`;
    return this.http.get<dashboardResponse>(url);
  }

}
