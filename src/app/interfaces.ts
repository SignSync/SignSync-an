export interface sign_in {
  correo:string
  contrasena:string
}
export interface ApiResponse {
  message: string;
  status: boolean;
  user_id?:number;
  correo?:string;
  user_name?:string;
}
export interface sign_up {
  usuario:string,
  correo:string,
  contrasena:string
}
