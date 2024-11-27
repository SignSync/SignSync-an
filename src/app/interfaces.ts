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
  empresa:ApiResponseEmpresa[]
  contratistas?:Contratista[]
  id_nuevo_contrato?:number
  contratos?:ContratoApi
  usuario:EditarUsuario
}
export interface ApiResponse2{
  contratos: Contrato[];
  status: boolean;
  message?:string
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
  contrato_inicio: boolean;
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
export interface Contrato {
  contrato_data: {
    color: string;
    fecha_entrega: string;
    fecha_inicio: string;
    idContrato: number;
    id_empresa: number;
    lugar: string;
    nombre: string;
    tipo: string;
  };
  contrato_inicio: boolean;
  dias_restantes: number;
}
export interface CrearContratista{
  id_empresa:number;
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
  telefono: string;
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
  id_empresa: number;
  idContratista: number;
  nombre: string;
  tipo: string;
  lugar: string;
  fecha_inicio: string;
  fecha_entrega: string;
  color: string;
}
export interface CrearContrato2 {
  idEmpresa: number;
  idContratista: number;
  nombre: string;
  tipo: string;
  lugar: string;
  fecha_inicio: string;
  fecha_entrega: string;
  color: string;
}
export interface editarContrato {
  id_contrato: number;
  idContratista: number;
  nombre: string;
  tipo: string;
  lugar: string;
  fecha_inicio: string;
  fecha_entrega: string;
  color: string;
}
export interface RespuestaContratista {
  contratista: Contratista;
  status: boolean;
}
export interface subirdocumento{
  id_contrato:number
  nombre:string
  url:string
}
export interface DeleteContra{
  idContrato:string
}
export interface EditarEmpresa{
  correo:string
  descripcion:string
  id_usuario:string|any
  nombre:string
  sector:string
  sitio_web:string
  telefono:string
}
export interface EditarUsuario{
  correo:string
  created_date:string
  fecha_nacimiento:string|any
  id_user:number
  sexo:string|any
  usuario:string
}
export interface EditarUsuarioApi{
  idUsuario:number
  usuario:string
  sexo:string
  fecha_nacimiento:string
}
