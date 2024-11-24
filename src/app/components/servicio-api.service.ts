import { Injectable } from '@angular/core';
import { sign_in } from '../interfaces';
import { Observable,BehaviorSubject  } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { ApiResponse } from '../interfaces';
import { sign_up } from '../interfaces';
import { infoEmpresa,CrearContratista,CrearContrato } from '../interfaces';
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
  saveUserData(userData: any): void {
    this.setCookie('user_id', userData.id, 7);
    this.setCookie('user_name', userData.nombre, 7);
    this.setCookie('correo', userData.correo, 7);
  }
  saveUserEmpresa(id_empresa:any):void{
    this.setCookie('idEmpresa',id_empresa,7)
  }
  // Limpiar las cookies (cerrar sesión)
  clearUserData(): void {
    this.deleteCookie('user_id');
    this.deleteCookie('user_name');
    this.deleteCookie('correo');
    this.deleteCookie('idEmpresa')
  }
  sign_up(data:sign_up):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.apiUrl + 'api/sign-up', data);
  }
  // Métodos para gestionar cookies
  private setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
  getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return value;
      }
    }
    return null;
  }
  getContratista(id_usuario:any):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.apiUrl + '/api/contratistas/listarcontratistas?idEmpresa='+id_usuario);
  }
  getEmpresa(id_usuario:any):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.apiUrl+'/api/empresa/getempresa?id_usuario='+id_usuario)
  }
  crearEmpresa(data:infoEmpresa):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.apiUrl + '/api/empresa/createempresa', data);
  }
  crearContratista(data:CrearContratista):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.apiUrl + '/api/contratistas/crearcontratistas', data);
  }
  crearContrato(data:CrearContrato):Observable<ApiResponse>{
    return this.http.post<ApiResponse>(this.apiUrl + '/api/contratos/crearcontrato', data);
  }
  getContratos(id_usuario:any):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.apiUrl+'/api/contratos/listarcontratos?idEmpresa='+id_usuario)
  }
}



