import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take, takeUntil } from 'rxjs';
import { IComerDetExpense2 } from 'src/app/core/models/ms-spent/comer-detexpense';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_POINT_PATTERN } from 'src/app/core/shared/patterns';
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
  transferent = '';
  title = 'Composición de Gastos';
  selectedGood: IValidGood;
  cvmans: { cvman: string; key: string }[] = [
    { cvman: '007200', key: 'DIRECCION EJECUTIVA ' },
  ];
  loadingCvmans = false;
  eventNumber: number;
  conceptNumber: number;
  lotNumber: number;
  expenseNumber: number;
  CHCONIVA: string;
  IVA: number;
  address: string;
  chargeGoodsByLote: boolean;
  data: IComerDetExpense2[];
  V_VALCON_ROBO: number;
  PDEVPARCIALBIEN: string;
  PVALIDADET: string;
  clickedButton = false;
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
    // this.service
    //   .getValidatesCvmans(+this.eventNumber, +this.lotNumber)
    //   .pipe(
    //     takeUntil(this.$unSubscribe),
    //     catchError(x => of({ data: [] })),
    //     map(x => (x ? x.data : []))
    //   )
    //   .subscribe(x => {
    //     this.loadingCvmans = false;
    //     this.cvmans = x;
    //     if (this.comerDetExpense) {
    //       this.cvman.setValue(this.comerDetExpense.manCV);
    //     }
    //   });
    setTimeout(() => {
      if (this.comerDetExpense) {
        this.cvman.setValue(this.comerDetExpense.manCV);
      }
      this.loadingCvmans = false;
      console.log(this.goodNumber.value);
    }, 300);
  }

  private fillGoods() {
    if (this.comerDetExpense) {
      setTimeout(() => {
        this.goodNumber.setValue(this.comerDetExpense.goodNumber);
        console.log(this.goodNumber.value);
      }, 300);
    }
  }

  get bodyPost() {
    return {
      lotId: this.lotNumber ? this.lotNumber : null,
      pevent: +this.eventNumber,
      pDevPartialGood: this.address !== 'M' ? 'N' : this.PDEVPARCIALBIEN,
      conceptId: +this.conceptNumber,
      pValidDet: this.address !== 'M' ? 'N' : this.PVALIDADET,
    };
  }
  get bodyPostI() {
    return {
      event: +this.eventNumber,
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

  get pathCvmans() {
    return 'spent/api/v1/aplication/query-validate-transfer?limit=100';
  }

  get bodyPostCVman() {
    return {
      eventId: this.eventNumber,
      lotId: this.address === 'M' ? this.lotNumber : null,
    };
  }

  get pathGood() {
    return 'goodprocess/api/v1/application/query-pro-list-good';
    // return (
    //   'goodprocess/api/v1/application/query-pro-list-good' +
    //   (this.comerDetExpense
    //     ? this.comerDetExpense.goodNumber
    //       ? '?filter.goodNumber=$eq:' + this.comerDetExpense.goodNumber
    //       : ''
    //     : '')
    // );
  }

  get pathGoodI() {
    return 'goodprocess/api/v1/application/get-good-expedients-trans';
    // return (
    //   'goodprocess/api/v1/application/get-good-expedients-trans' +
    //   (this.comerDetExpense
    //     ? this.comerDetExpense.goodNumber
    //       ? '?filter.goodNumber=$eq:' + this.comerDetExpense.goodNumber
    //       : ''
    //     : '')
    // );
  }

  fillCvman(row: any) {
    if (row && row.goodNumber + '' == this.goodNumber.value + '') {
      this.cvman.disable();
    }
  }

  fillGoodM(row: any) {
    console.log(row);
    if (row) {
      if (row.transferorNumber) {
        this.transferent = row.transferorNumber;
      }
      if (row.mandate2) {
        this.cvman.setValue(row.mandate2);
        this.cvman.disable();
      } else {
        this.cvman.enable();
      }
      if (row.iva2) {
        this.vat.setValue(row.iva2);
        this.vat.disable();
      } else {
        this.vat.setValue(0);
        this.vat.enable();
      }
      if (row.amount2) {
        this.amount.setValue(row.amount2);
        this.amount.disable();
      } else {
        this.amount.setValue(0);
        this.amount.enable();
      }
    } else {
      this.cvman.enable();
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
        this.cvman.disable();
      } else {
        this.cvman.enable();
      }
    } else {
      this.cvman.enable();
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
      this.vatWithholding.setValidators(
        Validators.max(this.comerDetExpense.iva)
      );
      this.isrWithholding.setValidators(
        Validators.max(this.comerDetExpense.amount)
      );
    }
    if (this.eventNumber) {
      this.fillCvmans();
    }
    this.fillGoods();
    this.vat.valueChanges.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        console.log(response);
        this.vatWithholding.setValidators(Validators.max(response));
      },
    });
    this.amount.valueChanges.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        console.log(response);
        this.isrWithholding.setValidators(Validators.max(response));
      },
    });
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
        [
          Validators.pattern(NUMBERS_POINT_PATTERN),
          Validators.required,
          Validators.max(this.amountValue),
        ],
      ],
      vatWithholding: [
        null,
        [
          Validators.pattern(NUMBERS_POINT_PATTERN),
          Validators.required,
          Validators.max(this.vatValue),
        ],
      ],
      cvman: [null],
      goodNumber: [null],
    });
  }

  get expenseDetailNumber() {
    return this.form.get('expenseDetailNumber');
  }

  get amount() {
    return this.form ? this.form.get('amount') : null;
  }

  get budgetItem() {
    return this.form.get('budgetItem');
  }

  get amountValue() {
    return this.amount ? (this.amount.value ? this.amount.value : 0) : 0;
  }

  get vat() {
    return this.form ? this.form.get('vat') : null;
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
    this.clickedButton = true;
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
      expenseNumber: this.expenseNumber,
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
                iva: body.vat,
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
              this.clickedButton = false;
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
          iva: body.vat,
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
              this.clickedButton = false;
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
