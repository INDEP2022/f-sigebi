import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'ngx-form-depositaria',
  templateUrl: './form-depositaria.component.html',
  styleUrls: ['./form-depositaria.component.scss'],
})
export class FormDepositariaComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() formDepositario: FormGroup;
  @Input() nombrePantalla: string;
  @Input() btnDeshacerParam: string;

  @Output() formValues = new EventEmitter<any>();
  @Output() formDepositariaValues = new EventEmitter<any>();
  @Output() formValuesValidacion = new EventEmitter<any>();

  @Output() eliminarDispersionPagos = new EventEmitter<boolean>();
  constructor() {
    super();
  }

  ngOnInit(): void {}

  btnEjecutar() {
    console.log('Ejecutar');
    console.log(this.form.value);
    this.formValues.emit(this.form);
  }

  btnDeshacer() {
    console.log('Deshacer');
    this.eliminarDispersionPagos.emit(
      this.form.get(this.btnDeshacerParam).valid
    );
  }

  btnRecargaDepositario() {
    console.log('Depositario');
    console.log(this.formDepositario.value);
    this.formDepositariaValues.emit(this.formDepositario);
  }

  btnValidacionPagos() {
    console.log('Validacion');
    this.formValuesValidacion.emit(this.form);
  }
}
