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
  id_new_empresa?:number
  empresa?:ApiResponseEmpresa[]
  contratistas?:Contratista[]
  id_nuevo_contrato?:number
  contratos?:ContratoApi
}
export interface ContratoApi {
  contratoData: {
    color: string; // Ejemplo: "#FFD3E2"
    fechaEntrega: string; // Formato ISO: "YYYY-MM-DD"
    fechaInicio: string; // Formato ISO: "YYYY-MM-DD"
    idContrato: number;
    idEmpresa: number;
    lugar: string;
    nombre: string;
    tipo: string; // Ejemplo: "Servicios"
  };
  contratoInicio: boolean;
  diasRestantes: number;
}

export interface ApiResponseEmpresa{
  correo:string
  descripcion:string
  idEmpresa:number
  id_usuario:number
  nombre:string
  sector:string
  sitio_web:string
  telefono:string
}
export interface sign_up {
  usuario:string,
  correo:string,
  contrasena:string
}

export interface dashboardResponse {
  message: string;
  status: boolean;
  context:any;
}
export interface CrearContratista{
  idEmpresa:number;
  nombre:string;
  edad:number;
  ocupacion:string;
  domicilio:string;
  telefono:string;
}
export interface Contratista {
  domicilio: string;
  edad: number;
  idContratista: number;
  id_empresa: number;
  nombre: string;
  ocupacion: string;
  telefono: number;
}
export interface infoEmpresa{
  id_usuario:number
  nombre:string;
  sector:string;
  correo:string;
  telefono:string;
  sitio_web:string;
  descripcion:string;
}
export interface CrearContrato {
  idEmpresa: number;
  idContratista: number;
  nombre: string;
  tipo: string;
  lugar: string;
  fecha_inicio: string;
  fecha_entrega: string;
  color: string;
}

