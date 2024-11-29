import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ServicioAPIService } from '../servicio-api.service';
import { ApiResponse, ContratoApi, DeleteContra } from '../../interfaces';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export default class CalendarioComponent implements OnInit {
  id_empresa: string | null = null;
  cargando: boolean = false;
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  daysInMonth: (number | null)[] = []; // Días del mes (incluye días vacíos)
  daysOfWeek: string[] = ['D', 'L', 'M', 'M', 'J', 'V', 'S']; // Días de la semana
  maxRange: number = 5; // Rango de 5 años hacia adelante y atrás
  contratos: ContratoApi |any = []; // Lista de contratos

  constructor(private fb: FormBuilder, public servicio: ServicioAPIService, private router: Router) {}

  ngOnInit() {
    this.cargando = true;
    this.id_empresa = this.servicio.getCookie('idEmpresa');
    if (this.id_empresa) {
      this.servicio.getContratos(this.id_empresa).subscribe({
        next: (response: ApiResponse) => {
          this.cargando = false;
          this.contratos = response.contratos;
          console.log(this.contratos);
        },
        error: (err) => {
          console.error('Error al realizar la solicitud:', err);
          this.cargando = false;
        },
        complete: () => {
          console.info('Solicitud completada.');
          this.cargando = false;
        }
      });
    }
    this.generateCalendar();
  }

  eliminar(idContrato: any) {
    this.cargando = true;
    const data: DeleteContra = { idContrato: idContrato };
    Swal.fire({
      title: '¿Seguro que quieres eliminar el contrato?',
      text: '¡Esta acción es irreversible!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: '¡Sí, eliminar contrato!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicio.deleteContrato(data).subscribe({
          next: (response: ApiResponse) => {
            if (response.status) {
              Swal.fire({
                title: 'Contrato eliminado',
                text: 'Contrato eliminado con éxito.',
                icon: 'success',
                confirmButtonText: 'Continuar'
              }).then(() => {
                window.location.reload();
              });
            }
          },
          error: (err) => {
            console.error('Error al realizar la solicitud:', err);
          },
          complete: () => {
            this.cargando = false;
          }
        });
      } else if (result.isDismissed) {
        this.cargando = false;
      }
    });
  }

  // Generar los días del mes actual
  generateCalendar() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate(); // Días en el mes
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay(); // Día de inicio del mes (0-6)

    // Inicializar el array con espacios vacíos para los días anteriores al primer día del mes
    this.daysInMonth = Array(firstDayOfMonth).fill(null);

    // Rellenar los días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      this.daysInMonth.push(i);
    }
  }

 // Obtener el color del contrato para un día específico (fecha de inicio o fin)
  getContractColor(day: number): string | null {
    if (!this.contratos || !this.contratos.length) return null;

    const contrato = this.contratos.find((contrato: any) => {
      const fechaInicio = new Date(contrato.contrato_data.fecha_inicio);
      const fechaEntrega = new Date(contrato.contrato_data.fecha_entrega);

      return (
        (fechaInicio.getUTCFullYear() === this.currentYear &&
          fechaInicio.getUTCMonth() === this.currentMonth &&
          fechaInicio.getUTCDate() === day) ||
        (fechaEntrega.getUTCFullYear() === this.currentYear &&
          fechaEntrega.getUTCMonth() === this.currentMonth &&
          fechaEntrega.getUTCDate() === day)
      );
    });

    return contrato ? contrato.contrato_data.color : null;
  }


  // Verificar si el día es de fin de contrato
  isContractEndDay(day: number): boolean {
    if (!this.contratos || !this.contratos.length) return false;

    return this.contratos.some((contrato: any) => {
      const fechaEntrega = new Date(contrato.contrato_data.fecha_entrega);
      return (
        fechaEntrega.getUTCFullYear() === this.currentYear &&
        fechaEntrega.getUTCMonth() === this.currentMonth &&
        fechaEntrega.getUTCDate() === day
      );
    });
  }

  // Obtener los nombres de los contratos para un día específico
  getContractNames(day: number): string[] {
    if (!this.contratos || !this.contratos.length) return [];

    return this.contratos
      .filter((contrato: any) => {
        const fechaInicio = new Date(contrato.contrato_data.fecha_inicio);
        const fechaEntrega = new Date(contrato.contrato_data.fecha_entrega);

        return (
          (fechaInicio.getUTCFullYear() === this.currentYear &&
            fechaInicio.getUTCMonth() === this.currentMonth &&
            fechaInicio.getUTCDate() === day) ||
          (fechaEntrega.getUTCFullYear() === this.currentYear &&
            fechaEntrega.getUTCMonth() === this.currentMonth &&
            fechaEntrega.getUTCDate() === day)
        );
      })
      .map((contrato: any) => contrato.contrato_data.nombre);
  }

  // Navegar al mes anterior
  prevMonth() {
    if (this.canNavigateBack()) {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear -= 1;
      } else {
        this.currentMonth -= 1;
      }
      this.generateCalendar();
    }
  }

  // Navegar al mes siguiente
  nextMonth() {
    if (this.canNavigateForward()) {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear += 1;
      } else {
        this.currentMonth += 1;
      }
      this.generateCalendar();
    }
  }

  // Verificar si puede retroceder hasta 5 años antes
  canNavigateBack(): boolean {
    const limitYear = new Date().getFullYear() - this.maxRange; // 5 años atrás
    return this.currentYear > limitYear;
  }

  // Verificar si puede avanzar hasta 5 años después
  canNavigateForward(): boolean {
    const limitYear = new Date().getFullYear() + this.maxRange; // 5 años adelante
    return this.currentYear < limitYear;
  }

  // Obtener el nombre del mes actual
  getMonthName(): string {
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ];
    return monthNames[this.currentMonth];
  }
}
