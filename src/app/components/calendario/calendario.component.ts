import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export default class CalendarioComponent {
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  daysInMonth: (number | null)[] = []; // Incluye días vacíos
  daysOfWeek: string[] = ['D', 'L', 'M', 'M', 'J', 'V', 'S']; // Días de la semana
  maxRange: number = 5; // Rango de 5 años adelante y 5 años atrás

  ngOnInit() {
    this.generateCalendar();
  }

  // Generar los días del mes actual
  generateCalendar() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate(); // Total de días en el mes actual
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay(); // Día de la semana del primer día del mes (0-6)

    // Inicializar el array con espacios vacíos para los días anteriores al primer día del mes
    this.daysInMonth = Array(firstDayOfMonth).fill(null);

    // Rellenar los días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      this.daysInMonth.push(i);
    }
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
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames[this.currentMonth];
  }
}
