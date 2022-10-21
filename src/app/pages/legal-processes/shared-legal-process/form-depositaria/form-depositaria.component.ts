import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-form-depositaria',
  templateUrl: './form-depositaria.component.html',
  styleUrls: ['./form-depositaria.component.scss'],
})
export class FormDepositariaComponent {
  @Input() form: FormGroup;
  @Input() formDepositario: FormGroup;
  @Input() nombrePantalla: string;

  //   public form: FormGroup;
  @Output() formValues = new EventEmitter<any>();
  @Output() formDepositariaValues = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  btnEjecutar() {
    console.log('Ejecutar');
    console.log(this.form.value);
    this.formValues.emit(this.form);
  }

  btnDeshacer() {
    console.log('Deshacer');
  }

  btnRecargaDepositario() {
    console.log('Depositario');
    console.log(this.formDepositario.value);
    this.formDepositariaValues.emit(this.formDepositario);
  }

  btnValidacionPagos() {
    console.log('Validacion');
  }

  /**
   * Formulario
   */
  // public returnField(form, field) { return form.get(field); }
  // public returnShowRequirements(form, field) { return this.returnField(form, field)?.errors?.required && this.returnField(form, field).touched; }
}
