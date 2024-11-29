import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule,Location  } from '@angular/common';
import { ServicioAPIService } from '../servicio-api.service';
import { ApiResponse2,Contratista,editarContrato,RespuestaContratista,CrearContrato, ApiResponse, DeleteContra, CrearPaquete, ApiResponsePaquete, Paquete, eliminarPaquete, SubirDocumento, APiDocumento, APiDocumentoGet, Documentos, eliminarDocumento } from '../../interfaces';
import { Router } from '@angular/router';
import { formatDate  } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-vista-contrato',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './vista-contrato.component.html',
  styleUrl: './vista-contrato.component.css'
})
export class VistaContratoComponent implements OnInit{
  formGroup!: FormGroup;
  formdocumento!: FormGroup
  formpaquete!:FormGroup
  idempresa:number|any
  idcontrato: number | any
  dataSource:any;
  arrayRecibido: any[] = [];
  cargando:boolean = false
  paquetes:Paquete|any
  total:number = 0
  documentos:Documentos [] = []
  infodocumento:editarContrato = {
    id_contrato: 0,
    nombre: '',
    idContratista: 0,
    tipo:'',
    lugar:'',
    fecha_entrega:'',
    fecha_inicio:'',
    color: ''
  }
  infoContratista:Contratista = {
    domicilio: '',
    edad: 0,
    idContratista: 0,
    id_empresa: 0,
    nombre: '',
    ocupacion: '',
    telefono: ''
  }
  constructor(private fb: FormBuilder,private location: Location, public servicio:ServicioAPIService, private router: Router) {}
  isDisabled = true;
  ngOnInit(): void {
    this.idempresa = this.servicio.getCookie('idEmpresa')
    this.idcontrato = this.location.path().split('/vista/:')
    console.log(this.idcontrato[1]);
    this.servicio.getContrato(parseInt(this.idcontrato[1])).subscribe({
      next: (response: ApiResponse2) => {
        //console.log('Estado:', response.status);
        //console.log("Info de contrato", response.contratos);
        if (response.status) {
          this.obtenerpaquetes(this.idcontrato[1])
          this.dataSource = response.contratos
          console.log(this.dataSource);
          this.agregarinformacion()

        }
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
      },
      complete: () => {
        console.info('Solicitud completada.');
      },

    });
    this.formGroup = this.initForm();
    this.formdocumento = this.initFormdocumento()
    this.formpaquete = this.initFormpaquete()
    this.editar();
    this.servicio.currentArray.subscribe((array) => {
      this.arrayRecibido = array
      console.log('array recibido',this.arrayRecibido);
    })
    this.obtener()
  }
  initForm(): FormGroup {
    return this.fb.group({
      nombre_contrato: [''],
      id_contratista: 0,
      fecha_inicio: [''],
      fecha_final: [''],
      ubicacion: [''],
      tipo:[''],
      color:['']
    });
  }
  initFormpaquete():FormGroup{
    return this.fb.group({
      nombre: [''],
      costo: 0
    })
  }
  initFormdocumento():FormGroup{
    return this.fb.group({
      nombre: ['']
    })
  }
  obtenerpaquetes(id_contrato:any){
    this.cargando = true
    this.servicio.getPaquetes(id_contrato).subscribe({
      next: (response: ApiResponsePaquete) => {
        //console.log('Estado:', response.status);
        //console.log("Info de contrato", response.contratos);
        if (response.status) {
          console.log(response);
          this.paquetes = response.paquetes
          this.cargando = false
          this.paquetes.forEach((element:Paquete) => {
            this.total += element.costo
          });
        }
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
        this.cargando = false
      },
      complete: () => {
        console.info('Solicitud completada.');
      }
    })
  }
  agregarinformacion() {
    console.log('Agregando informacion');

    this.cargando = true
    this.infodocumento.id_contrato = this.idcontrato[1];
    const contratoData = this.dataSource[0].contrato_data;

    const formatFecha = (fecha: string | Date): string => {
        const date = new Date(fecha);
        return date.toISOString().split('T')[0]; // Convierte la fecha a "yyyy-mm-dd"
    };
    this.servicio.getContratis(contratoData.idContratista).subscribe({
      next: (response: RespuestaContratista) => {
        //console.log('Estado:', response.status);
        //console.log("Info de contrato", response.contratos);
        if (response.status) {
          console.log(response.contratista);
          this.infoContratista = response.contratista
          this.formGroup.get('id_contratista')?.setValue(this.infoContratista.idContratista)
          this.cargando= false
        }
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
        this.cargando = false
      },
      complete: () => {
        console.info('Solicitud completada.');
      },

    });
    this.formGroup.get('nombre_contrato')?.setValue(contratoData.nombre)
    this.formGroup.get('fecha_inicio')?.setValue(contratoData.fecha_inicio)
    this.formGroup.get('fecha_final')?.setValue(contratoData.fecha_entrega)
    this.formGroup.get('ubicacion')?.setValue(contratoData.fecha_entrega)
    this.formGroup.get('color')?.setValue(contratoData.color)
    this.formGroup.get('tipo')?.setValue(contratoData.tipo)
    this.infodocumento.nombre = contratoData.nombre;
    this.infodocumento.tipo = contratoData.tipo;
    this.infodocumento.lugar = contratoData.lugar;
    this.infodocumento.fecha_inicio = formatFecha(contratoData.fecha_inicio);
    this.infodocumento.fecha_entrega = formatFecha(contratoData.fecha_entrega);
    this.infodocumento.color = contratoData.color;

    console.log(this.infodocumento);
  }


  editar(): void {
    if (this.isDisabled) {
      this.formGroup.disable(); // Deshabilitar todos los controles
    } else {
      this.formGroup.enable(); // Habilitar todos los controles
    }
    this.isDisabled = !this.isDisabled; // Alternar el estado
  }
  onSubmit(): void {
    this.cargando = true
    const { nombre_contrato,id_contratista ,tipo,color, fecha_inicio, fecha_final, ubicacion } = this.formGroup.value;
    const fechaInicioFormateada = formatDate(fecha_inicio, 'dd-MM-yyyy', 'en-US');
    const fechaFinalFormateada = formatDate(fecha_final, 'dd-MM-yyyy', 'en-US');
    let data:editarContrato = {
      id_contrato: parseInt(this.idcontrato[1]),
      idContratista: id_contratista,
      nombre:nombre_contrato,
      tipo:tipo,
      lugar:ubicacion,
      fecha_inicio:fechaInicioFormateada,
      fecha_entrega:fechaFinalFormateada,
      color:color
    }
    console.log(data);

    this.servicio.editarContrato(data).subscribe({
      next: (response: ApiResponse) => {
        console.log(response);
        this.cargando = false
        Swal.fire({
          title: 'Contrato Actualizado',
          text: 'Contrato actualizado con exito',
          icon: 'success',
          confirmButtonText:'Continuar'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload()
          }
        });
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
      },
      complete: () => {
        this.cargando = false
        console.info('Solicitud completada.');
      },

    });

  }
  agregardocumento() {
    this.cargando = true
    const { nombre } = this.formdocumento.value;
    const inputFile = document.querySelector('input[name="documento"]') as HTMLInputElement;

    if (inputFile && inputFile.files) {
      const archivo = inputFile.files[0];
      const data: SubirDocumento = {
        nombre: nombre,
        idContrato: this.idcontrato[1],
        file: archivo
      };

      console.log(data);
      const boton = document.getElementById('cerrar') as HTMLButtonElement;
      if (boton) {
        boton.click(); // Simula el clic
      } else {
        console.error('No se encontró el botón con el ID "cerrar".');
      }
      this.formdocumento.reset()
      inputFile.value = "";
      this.servicio.subirdocumento(data).subscribe({
        next: (response: APiDocumento) => {
          console.log(response);
          this.cargando = false;
          if (response.status) {
            Swal.fire({
              title: 'Documento Agregado',
              text: 'Documento agregado con éxito',
              icon: 'success',
              confirmButtonText: 'Continuar'
            });
            this.obtener()
          }
        },
        error: (err) => {
          console.error('Error al realizar la solicitud:', err);
        },
        complete: () => {
          this.cargando = false;
          console.info('Solicitud completada.');
        },
      });
    } else {
      console.log('No se seleccionó ningún archivo');
    }
  }

  agregarpaquete(){
    this.cargando = true
    const boton = document.getElementById('close') as HTMLButtonElement;
    if (boton) {
      console.log('click');
      boton.click(); // Simula el clic
    } else {
      console.error('No se encontró el botón con el ID "cerrar".');
    }
    const {nombre,costo} = this.formpaquete.value
    console.log(this.formpaquete.value);
    let data:CrearPaquete= {
      idContrato:this.idcontrato[1],
      nombre:nombre,
      costo:costo
    }
    this.servicio.crearpaquete(data).subscribe({
      next: (response: ApiResponse) => {
        console.log(response);
        this.cargando = false
        this.formpaquete.reset();
        console.log(response.status);
        if(response.status){

          Swal.fire({
            title: 'Paquete Agregado',
            text: 'Paquete Agregado con exito con exito',
            icon: 'success',
            confirmButtonText:'Continuar'
          })
          this.obtenerpaquetes(this.idcontrato[1])
        }

      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
      },
      complete: () => {
        this.cargando = false
        console.info('Solicitud completada.');
      },
    })

  }
  eliminar(){
    this.cargando = true
    console.log('Eliminar contrato:', this.idcontrato[1]);
    let data:DeleteContra = {
      idContrato:this.idcontrato[1]
    }
    Swal.fire({
      title: "Seguro que quieres eliminar el contrato?",
      text: "Esta acción es irreversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Si, eliminar contrato!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.deleteContrato(data).subscribe({
          next: (response: ApiResponse) => {
            console.log(response);
            if(response.status){
              this.cargando = false
              Swal.fire({
                title: "Contrato eliminado!",
                text: "Contrato eliminado con exito.",
                icon: "success",
                confirmButtonText: "Continuar"
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['contratos'])
                }
              });
            }
          },
          error: (err) => {
            console.error('Error al realizar la solicitud:', err);
            this.cargando = false
          },
          complete: () => {
            this.cargando = false
            console.info('Solicitud completada.');
            this.cargando = false
          },
        })
      }else if (result.isDismissed) {
        this.cargando = false
      }
    });
  }
  elimnarpaquete(idPaquete:any){
    this.cargando = true
    console.log('Eliminar contrato:', this.idcontrato[1]);
    let data:eliminarPaquete = {
      idPaquete:idPaquete
    }
    Swal.fire({
      title: "Seguro que quieres eliminar el paquete?",
      text: "Esta acción es irreversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Si, eliminar paquete!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.deletepaquete(data).subscribe({
          next: (response: ApiResponse) => {
            console.log(response);
            if(response.status){
              this.cargando = false
              Swal.fire({
                title: "Paquete eliminado!",
                text: "Paquete eliminado con exito.",
                icon: "success",
                confirmButtonText: "Continuar"
              }).then((result) => {
                if (result.isConfirmed) {
                  this.obtenerpaquetes(this.idcontrato[1])
                  this.total = 0
                }
              });
            }
          },
          error: (err) => {
            console.error('Error al realizar la solicitud:', err);
            this.cargando = false
          },
          complete: () => {
            this.cargando = false
            console.info('Solicitud completada.');
            this.cargando = false
          },
        })
      }else if (result.isDismissed) {
        this.cargando = false
      }
    });
  }
  obtener(){
    this.cargando = true
    this.servicio.getDocumentos(this.idcontrato[1]).subscribe({
      next: (response: APiDocumentoGet) => {
        if (response.status) {
          this.documentos = response.documentos
          console.log(this.documentos);
          this.cargando = false
        }
      },
      error: (err) => {
        console.error('Error al realizar la solicitud:', err);
        this.cargando = false
      },
      complete: () => {
        console.info('Solicitud completada.');
      }
    })
  }
  eliminardocumento(id_documento:any){
    this.cargando = true
    console.log('Eliminar documento:', id_documento);
    let data:eliminarDocumento = {
      idDocumento:id_documento
    }
    Swal.fire({
      title: "Seguro que quieres eliminar el documento?",
      text: "Esta acción es irreversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Si, eliminar documento!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.deleteDocumento(data).subscribe({
          next: (response: ApiResponse) => {
            console.log(response);
            if(response.status){
              this.cargando = false
              Swal.fire({
                title: "Documento eliminado!",
                text: "Documento eliminado con exito.",
                icon: "success",
                confirmButtonText: "Continuar"
              }).then((result) => {
                if (result.isConfirmed) {
                  this.obtener()
                }
              });
            }
          },
          error: (err) => {
            console.error('Error al realizar la solicitud:', err);
            this.cargando = false
          },
          complete: () => {
            this.cargando = false
            console.info('Solicitud completada.');
            this.cargando = false
          },
        })
      }else if (result.isDismissed) {
        this.cargando = false
      }
    });
  }
}
