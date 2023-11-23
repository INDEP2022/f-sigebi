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
  manCV: string;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private service: ComerDetexpensesService
  ) {
    super();
    this.prepareForm();
  }

  ngOnInit() {
    console.log(this.comerDetExpense);
    // this.prepareForm();
    setTimeout(() => {
      if (this.comerDetExpense) {
        this.expenseDetailNumber.setValue(this.comerDetExpense.detPaymentsId);
        this.amount.setValue(this.comerDetExpense.amount);
        this.vat.setValue(this.comerDetExpense.iva);
        this.isrWithholding.setValue(this.comerDetExpense.retencionIsr);
        this.vatWithholding.setValue(this.comerDetExpense.retencionIva);
        this.transferorNumber.setValue(this.comerDetExpense.transferorNumber);
        this.goodNumber.setValue(this.comerDetExpense.goodNumber);
      }
    }, 500);
  }

  getTransferent(result: any) {
    console.log(result);
    this.manCV = result.cvman;
  }

  private prepareForm() {
    this.form = this.fb.group({
      expenseDetailNumber: [null],
      amount: [
        null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      vat: [
        null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      isrWithholding: [
        null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      vatWithholding: [
        null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      transferorNumber: [null, [Validators.required]],
      goodNumber: [
        null,
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
          cvman: this.manCV,
          total,
        })
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.alert(
              'success',
              'Se ha actualizado la composición del gasto ' +
                body.expenseDetailNumber,
              ''
            );
            this.modalRef.content.callback(true);
            this.modalRef.hide();
          },
          error: err => {
            this.alert(
              'error',
              'No se pudo actualizar la composición del gasto ' +
                body.expenseDetailNumber,
              ''
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
      cvman: this.manCV,
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
            this.alert('success', 'Se ha creado la composición de gasto', '');
            this.modalRef.content.callback(true);
            this.modalRef.hide();
            // this.getData();
          },
          error: err => {
            console.log(err);
            this.alert('error', 'No se pudo crear la composición de gasto', '');
          },
        });
    }
  }

  close() {
    this.modalRef.hide();
  }
}
