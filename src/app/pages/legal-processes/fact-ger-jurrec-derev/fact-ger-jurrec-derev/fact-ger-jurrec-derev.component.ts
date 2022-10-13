import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-fact-ger-jurrec-derev',
  templateUrl: './fact-ger-jurrec-derev.component.html',
  styleUrls: ['./fact-ger-jurrec-derev.component.scss'],
})
export class FactGerJurrecDerevComponent {
  public form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.form = this.fb.group({
      delegacion: '', // Delegación Detalle
      subdelegacion: '', // Subdelegación Detalle
      fechaPresentacionRecursoDesde: '',
      fechaPresentacionRecursoHasta: '',
      delBien: '', // Del Bien Detalle
      alBien: '', // Al Bien Detalle
    });
  }

  btnEjecutar() {
    console.log('Ejecutar');
  }

  /**
   * Formulario
   */
  //  public returnField(form, field) { return form.get(field); }
  //  public returnShowRequirements(form, field) {
  //    return this.returnField(form, field)?.errors?.required && this.returnField(form, field).touched;
  //  }
}
