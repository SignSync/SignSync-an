import { Injectable } from '@angular/core';
import { sign_in } from '../interfaces';
import { Observable,BehaviorSubject  } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { ApiResponse } from '../interfaces';
import { sign_up } from '../interfaces';
@Injectable({
  providedIn: 'root'
})
export class ServicioAPIService {
  private apiUrl = 'http://127.0.0.1:5000/';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  constructor(private http: HttpClient) { }

  sign_in(datos: sign_in): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl + 'api/sign-in', datos);
  }
  //Guardar datos de inicio de sesion
  saveUserData(userData: any): void {
    this.userSubject.next(userData);
  }

  // Limpiar el estado del usuario (cerrar sesión)
  clearUserData(): void {
    this.userSubject.next(null);
  }
  sign_up(data:sign_up):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.apiUrl + 'api/sign-up', data);
  }
}



