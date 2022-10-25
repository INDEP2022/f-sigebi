import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-gena-db-bienes-dep',
  templateUrl: './fact-gena-db-bienes-dep.component.html',
  styleUrls: ['./fact-gena-db-bienes-dep.component.scss'],
})
export class FactGenaDBBienesXDepComponent {
  public form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      delegacion: ['', [Validators.required]], //* Delegación Detalle
      subdelegacion: ['', [Validators.required]], //* Subdelegación Detalle
      depositaria: ['', [Validators.required]], //*  Depositaria Detalle
      entidadFederativa: ['', [Validators.required]], //* Entidad Federativa Detalle
      tipoBien: ['', [Validators.required]], //* Tipo Bien Detalle
      subtipoBien: ['', [Validators.required]], //* Subtipo Bien Detalle
      tipo: ['', [Validators.required]], //* "Administrador, Depositaría, Interventor, Todos"
      fechaNombramientoProvicional: ['', [Validators.required]], //*
      fechaRemocion: ['', [Validators.required]], //*
      fechaNombramientoDefinitivo: ['', [Validators.required]], //*
      todasFechas: ['', [Validators.required]], //*
      desdeFecha: ['', [Validators.required]], //*
      hastaFecha: ['', [Validators.required]], //*
    });
  }

  btnImprimir(): any {
    console.log(this.form.value);
  }

  /**
   * Formulario
   */
  public returnField(form, field) {
    return form.get(field);
  }
  public returnShowRequirements(form, field) {
    return (
      this.returnField(form, field)?.errors?.required &&
      this.returnField(form, field).touched
    );
  }
}
