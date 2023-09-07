import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IComerDetExpense } from 'src/app/core/models/ms-spent/comer-detexpense';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

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
  comerDetExpense: IComerDetExpense;
  expenseNumber: number;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private service: ComerDetexpensesService
  ) {
    super();
    this.prepareForm();
  }

  ngOnInit() {}

  private prepareForm() {
    this.form = this.fb.group({
      expenseDetailNumber: [null],
      amount: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.required],
      ],
      vat: [null, [Validators.pattern(NUMBERS_PATTERN), Validators.required]],
      isrWithholding: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.required],
      ],
      vatWithholding: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.required],
      ],
      transferorNumber: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.required],
      ],
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
  get vat() {
    return this.form.get('vat');
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
    console.log(event);
    if (body) {
      // this.service
      //   .edit({
      //     ...body,
      //     address: this.getAddressCode(body.address),
      //     automatic: body.automatic ? 'S' : 'N',
      //     numerary: body.numerary ? 'S' : 'N',
      //   })
      //   .pipe(takeUntil(this.$unSubscribe))
      //   .subscribe({
      //     next: response => {
      //       this.alert(
      //         'success',
      //         'Edición de Concepto de Pago ' + body.id,
      //         'Actualizado Correctamente'
      //       );
      //       this.modalRef.content.callback(true);
      //       this.modalRef.hide();
      //     },
      //     error: err => {
      //       this.alert(
      //         'error',
      //         'ERROR',
      //         'No se pudo actualizar el concepto de pago ' + body.id
      //       );
      //     },
      //   });
    }
  }

  private onAddConfirm(body: any) {
    console.log(body);
    if (body) {
      // this.service
      //   .create({
      //     ...body,
      //     expenseNumber: this.expenseNumber,
      //     total: ,
      //     numerary: body.numerary ? 'S' : 'N',
      //   })
      //   .pipe(takeUntil(this.$unSubscribe))
      //   .subscribe({
      //     next: response => {
      //       this.alert('success', 'Concepto de Pago', 'Creado Correctamente');
      //       this.modalRef.content.callback(true);
      //       this.modalRef.hide();
      //       // this.getData();
      //     },
      //     error: err => {
      //       this.alert(
      //         'error',
      //         'ERROR',
      //         'No se pudo crear el concepto de pago'
      //       );
      //     },
      //   });
    }
  }

  close() {
    this.modalRef.hide();
  }
}
