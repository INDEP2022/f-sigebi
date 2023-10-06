import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { IComerDetExpense2 } from 'src/app/core/models/ms-spent/comer-detexpense';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
import { BasePage } from 'src/app/core/shared';
import {
  NUMBERS_PATTERN,
  NUMBERS_POINT_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-expense-composition-modal',
  templateUrl: './expense-composition-modal.component.html',
  styleUrls: ['./expense-composition-modal.component.css'],
})
export class ExpenseCompositionModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  comerDetExpense: IComerDetExpense2;
  expenseNumber: number;
  title = 'Composición de Gastos';
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private service: ComerDetexpensesService
  ) {
    super();
  }

  ngOnInit() {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      expenseDetailNumber: [
        this.comerDetExpense ? this.comerDetExpense.detPaymentsId : null,
      ],
      amount: [
        this.comerDetExpense ? this.comerDetExpense.amount : null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      vat: [
        this.comerDetExpense ? this.comerDetExpense.iva : null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      isrWithholding: [
        this.comerDetExpense ? this.comerDetExpense.retencionIsr : null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      vatWithholding: [
        this.comerDetExpense ? this.comerDetExpense.retencionIva : null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      transferorNumber: [
        this.comerDetExpense ? this.comerDetExpense.transferorNumber : null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.required],
      ],
      goodNumber: [
        this.comerDetExpense ? this.comerDetExpense.goodNumber : null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.required],
      ],
    });
  }

  get expenseDetailNumber() {
    return this.form.get('expenseDetailNumber');
  }

  get amount() {
    return this.form.get('amount');
  }

  get amountValue() {
    return this.amount ? (this.amount.value ? this.amount.value : 0) : 0;
  }

  get vat() {
    return this.form.get('vat');
  }

  get vatValue() {
    return this.vat ? (this.vat.value ? this.vat.value : 0) : 0;
  }

  get isrWithholding() {
    return this.form.get('isrWithholding');
  }
  get vatWithholding() {
    return this.form.get('vatWithholding');
  }
  get transferorNumber() {
    return this.form.get('transferorNumber');
  }
  get goodNumber() {
    return this.form.get('goodNumber');
  }

  confirm() {
    console.log(this.form.value);
    if (this.comerDetExpense) {
      this.onEditConfirm(this.form.value);
    } else {
      this.onAddConfirm(this.form.value);
    }
  }

  private getAddressCode(address: string) {
    switch (address) {
      case 'MUEBLES':
        return 'M';
      case 'INMUEBLES':
        return 'I';
      case 'GENERAL':
        return 'C';
      case 'VIGILANCIA':
        return 'V';
      case 'SEGUROS':
        return 'S';
      case 'JURIDICO':
        return 'J';
      case 'ADMINISTRACIÓN':
        return 'A';
      default:
        return '';
    }
  }

  private onEditConfirm(body: any) {
    console.log(body);
    const total = (
      +body.amount +
      +body.vat -
      +body.isrWithholding -
      +body.vatWithholding
    ).toFixed(2);
    console.log(total);
    // return;
    if (body) {
      this.service
        .edit({
          ...body,
          expenseNumber: this.expenseNumber,
          total,
        })
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.alert(
              'success',
              'Edición de Composición de Gasto ' + body.expenseDetailNumber,
              'Actualizado correctamente'
            );
            this.modalRef.content.callback(true);
            this.modalRef.hide();
          },
          error: err => {
            this.alert(
              'error',
              'Edición de Composición de Gasto ' + body.expenseDetailNumber,
              'No se pudo actualizar'
            );
          },
        });
    }
  }

  private onAddConfirm(body: any) {
    console.log(body);
    const total = (
      +body.amount +
      +body.vat -
      +body.isrWithholding -
      +body.vatWithholding
    ).toFixed(2);
    delete body.expenseDetailNumber;
    let newBody = {
      ...body,
      expenseNumber: this.expenseNumber,
      total,
    };
    console.log(total, this.expenseNumber, newBody);
    // return;
    if (body) {
      this.service
        .create(newBody)
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.alert(
              'success',
              'Composición de Gasto',
              'Creado Correctamente'
            );
            this.modalRef.content.callback(true);
            this.modalRef.hide();
            // this.getData();
          },
          error: err => {
            console.log(err);
            this.alert(
              'error',
              'Creación Composición de Gasto',
              'No se pudo realizar correctamente'
            );
          },
        });
    }
  }

  close() {
    this.modalRef.hide();
  }
}
