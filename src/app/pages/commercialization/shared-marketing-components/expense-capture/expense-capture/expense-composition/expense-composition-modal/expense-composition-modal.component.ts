import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, map, of, take, takeUntil } from 'rxjs';
import { IComerDetExpense2 } from 'src/app/core/models/ms-spent/comer-detexpense';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
import { BasePage } from 'src/app/core/shared';
import {
  NUMBERS_PATTERN,
  NUMBERS_POINT_PATTERN,
} from 'src/app/core/shared/patterns';
import { IValidGood } from '../../../models/expense-good-process';

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
  expense: IComerExpense;
  transferent = '';
  title = 'Composición de Gastos';
  selectedGood: IValidGood;
  cvmans: { cvman: string; key: string }[] = [
    { cvman: '007200', key: 'DIRECCION EJECUTIVA ' },
  ];
  loadingCvmans = false;
  CHCONIVA: string;
  IVA: number;
  address: string;
  chargeGoodsByLote: boolean;
  data: IComerDetExpense2[];
  V_VALCON_ROBO: number;
  PDEVPARCIALBIEN: string;
  PVALIDADET: string;
  private goodDescription: string;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private service: ComerDetexpensesService
  ) {
    super();
    this.prepareForm();
  }

  private fillCvmans() {
    this.loadingCvmans = true;
    this.service
      .getValidatesCvmans(+this.expense.eventNumber, +this.expense.lotNumber)
      .pipe(
        takeUntil(this.$unSubscribe),
        catchError(x => of({ data: [] })),
        map(x => (x ? x.data : []))
      )
      .subscribe(x => {
        this.loadingCvmans = false;
        this.cvmans = x;
        if (this.comerDetExpense) {
          this.cvman.setValue(this.comerDetExpense.manCV);
        }
      });
  }

  private fillGoods() {
    if (this.comerDetExpense) {
      this.goodNumber.setValue(+this.comerDetExpense.goodNumber);
    }
  }

  get bodyPost() {
    return {
      lotId: +this.expense.lotNumber,
      pevent: +this.expense.eventNumber,
      pDevPartialGood: this.address !== 'M' ? 'N' : this.PDEVPARCIALBIEN,
      conceptId: +this.expense.conceptNumber,
      PVALIDADET: this.address !== 'M' ? 'N' : this.PVALIDADET,
    };
  }

  // onChange(goodNumber: number) {
  //   console.log(goodNumber);
  //   let goodData = this.goods.find(x => x.goodNumber === goodNumber);
  //   if (goodData && this.address === 'M') {
  //     this.amount.setValue(goodData.amount2);
  //     this.vat.setValue(goodData.iva2);
  //     this.goodDescription = goodData.description;
  //     if (
  //       this.expense.conceptNumber + '' === '643' &&
  //       goodData.iva2 === 0 &&
  //       this.CHCONIVA
  //     ) {
  //       this.vat.setValue(goodData.amount2 * this.IVA);
  //     }
  //   }
  // }

  get pathGood() {
    return (
      'goodprocess/api/v1/application/get-good-expedients-trans' +
      (this.comerDetExpense
        ? this.comerDetExpense.goodNumber
          ? '?filter.goodNumber=$eq:' + this.comerDetExpense.goodNumber
          : ''
        : '')
    );
  }

  fillGoodM(row: any) {
    console.log(row);
    if (row) {
      if (row.transferorNumber) {
        this.transferent = row.transferorNumber;
      }
      if (row.mandate2) {
        this.cvman.setValue(row.mandate2);
      }
      if (row.iva2) {
        this.vat.setValue(row.iva2);
      }
      if (row.amount2) {
        this.amount.setValue(row.amount2);
      }
    }
  }

  setCvmanI(row: any) {
    console.log(row);
    if (row) {
      if (row.transferenteId) {
        this.transferent = row.transferenteId;
      }
      if (row.cvman) {
        this.cvman.setValue(row.cvman);
      }
    }
  }

  ngOnInit() {
    console.log(this.comerDetExpense);
    // this.prepareForm();
    if (this.comerDetExpense) {
      this.expenseDetailNumber.setValue(this.comerDetExpense.detPaymentsId);
      this.amount.setValue(this.comerDetExpense.amount);
      this.vat.setValue(this.comerDetExpense.iva);
      this.isrWithholding.setValue(this.comerDetExpense.retencionIsr);
      this.vatWithholding.setValue(this.comerDetExpense.retencionIva);
      this.budgetItem.setValue(this.comerDetExpense.departure);
    }
    if (this.expense) {
      this.fillCvmans();
      this.fillGoods();
    }
    // this.goodNumber.valueChanges.pipe(takeUntil(this.$unSubscribe)).subscribe({
    //   next: response => {
    //     if (response) {
    //       if (this.address === 'M') {
    //         this.selectedGood =
    //           this.goods.filter(x => x.goodNumber === response)[0] ?? null;
    //         if (this.selectedGood) {
    //           if (this.selectedGood.transferorNumber) {
    //             this.transferent = this.selectedGood.transferorNumber;
    //           }
    //           if (this.selectedGood.mandate2) {
    //             this.cvman.setValue(this.selectedGood.mandate2);
    //           }
    //         }
    //       }
    //     }
    //   },
    // });
  }

  getTransferent(result: any) {
    console.log(result);
    this.transferent = result.transferNumberExpedient;
  }

  private prepareForm() {
    this.form = this.fb.group({
      expenseDetailNumber: [null],
      amount: [
        null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      budgetItem: [null],
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
      cvman: [null],
      goodNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });
  }

  get expenseDetailNumber() {
    return this.form.get('expenseDetailNumber');
  }

  get amount() {
    return this.form.get('amount');
  }

  get budgetItem() {
    return this.form.get('budgetItem');
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
  get cvman() {
    return this.form.get('cvman');
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

  private getBody(body: any) {
    const total = (
      +body.amount +
      +body.vat -
      +body.isrWithholding -
      +body.vatWithholding
    ).toFixed(2);
    return {
      ...body,
      expenseNumber: this.expense.expenseNumber,
      transferorNumber: this.transferent,
      total,
    };
  }
  private onEditConfirm(body: any) {
    // return;
    if (body) {
      if (this.chargeGoodsByLote) {
        this.modalRef.content.callback(
          this.data.map(x => {
            if (x.goodNumber + '' === body.goodNumber + '') {
              const total = (
                +body.amount +
                +body.vat -
                +body.isrWithholding -
                +body.vatWithholding
              ).toFixed(2);
              return {
                ...x,
                amount: body.amount,
                iva: body.iva,
                retencionIsr: body.isrWithholding,
                retencionIva: body.vatWithholding,
                transferorNumber: this.transferent,
                amount2: body.amount,
                iva2: body.iva,
                total: +total,
                total2: +total,
                departure: body.budgetItem,
              };
            } else {
              return x;
            }
          })
        );
        this.modalRef.hide();
      } else {
        this.service
          .edit(this.getBody(body))
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
  }

  private onAddConfirm(body: any) {
    // return;
    if (body) {
      if (this.chargeGoodsByLote) {
        const total = (
          +body.amount +
          +body.vat -
          +body.isrWithholding -
          +body.vatWithholding
        ).toFixed(2);

        this.data.push({
          detPaymentsId: null,
          paymentsId: null,
          amount: body.amount,
          iva: body.iva,
          retencionIsr: body.isrWithholding,
          retencionIva: body.vatWithholding,
          transferorNumber: this.transferent,
          goodNumber: body.goodNumber,
          total: +total,
          manCV: body.cvman,
          departure: body.budgetItem,
          origenNB: null,
          partialGoodNumber: null,
          priceRiAtp: null,
          transNumberAtp: null,
          expendientNumber: null,
          clasifGoodNumber: null,
          value: null,
          description: this.goodDescription,
          eventId: null,
          amount2: body.amount,
          iva2: body.iva,
          total2: +total,
          parameter: null,
          mandato: body.cvman,
          vehiculoCount: null,
          changeStatus: false,
          reportDelit: false,
          V_VALCON_ROBO: this.V_VALCON_ROBO,
          SELECT_CAMBIA_CLASIF_ENABLED: null,
        });
        this.modalRef.content.callback(this.data);
        this.modalRef.hide();
      } else {
        this.service
          .create(this.getBody(body))
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
              this.alert(
                'error',
                'No se pudo crear la composición de gasto',
                ''
              );
            },
          });
      }
    }
  }

  close() {
    this.modalRef.hide();
  }
}
