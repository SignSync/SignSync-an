import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-vista-contrato',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './vista-contrato.component.html',
  styleUrl: './vista-contrato.component.css'
})
export class VistaContratoComponent {
  formGroup!: FormGroup;
  constructor(private fb: FormBuilder) {}
  isDisabled = true;
  ngOnInit(): void {
    this.formGroup = this.initForm();
    this.editar();
  }
  initForm(): FormGroup {
    return this.fb.group({
      nombre_contrato: [''],
      nombre_contratista: [''],
      edad_contratista: [''],
      ocupacion: [''],
      domicilio: [''],
      telefono: [''],
      fecha_inicio: [''],
      fecha_final: [''],
      ubicacion: [''],
    });
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
    const { nombre_contrato, nombre_contratista, edad_contratista, ocupacion,domicilio, telefono, fecha_inicio, fecha_final, ubicacion } = this.formGroup.value;
    console.log('Formulario enviado:', this.formGroup.value);
  }
}
