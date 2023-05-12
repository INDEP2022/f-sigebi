import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IPaymentsGensDepositary } from 'src/app/core/models/ms-depositarypayment/ms-depositarypayment.interface';
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
  @Input() deleteDateOption?: boolean = false;
  @Input() listDateOptions?: IPaymentsGensDepositary[] = [];

  @Output() formValues = new EventEmitter<any>();
  @Output() formDepositariaValues = new EventEmitter<any>();
  @Output() formValuesValidacion = new EventEmitter<any>();
  @Output() searchGoodNumber = new EventEmitter<number>();

  @Output() eliminarDispersionPagos = new EventEmitter<any>();
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.deleteDateOption = false;
  }

  btnEjecutar() {
    console.log('Ejecutar');
    console.log(this.form.value);
    this.formValues.emit(this.form);
  }

  btnDeshacer() {
    console.log('Deshacer');
    this.form.get(this.btnDeshacerParam).reset();
    this.form.get(this.btnDeshacerParam).setValue('');
    this.deleteDateOption = true;
    // this.eliminarDispersionPagos.emit(
    //   this.form.get(this.btnDeshacerParam).valid
    // );
  }

  btnRecargaDepositario() {
    console.log('Depositario');
    console.log(this.formDepositario.value);
    this.formDepositariaValues.emit(this.formDepositario);
  }

  btnValidacionPagos() {
    console.log('Validacion');
    console.log(this.formDepositario.value);
    this.formValuesValidacion.emit({
      form: this.form,
      depositario: this.formDepositario,
    });
  }

  btnSearchGood() {
    console.log(this.form.get('noBien').value, this.form.value);
    this.searchGoodNumber.emit(this.form.get('noBien').value);
  }

  btnExit() {
    this.deleteDateOption = false;
  }

  btnDeleteDispersalPay() {
    let resp = {
      validDate: this.form.get(this.btnDeshacerParam).valid,
      dateValue: this.form.get(this.btnDeshacerParam).value,
    };
    this.eliminarDispersionPagos.emit(resp);
  }

  formatTotalAmount(numberParam: number) {
    if (numberParam) {
      return new Intl.NumberFormat('es-MX').format(numberParam);
    } else {
      return '0.00';
    }
  }
}
