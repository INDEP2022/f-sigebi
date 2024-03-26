import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IMandExpenseCont } from 'src/app/core/models/ms-accounting/mand-expensecont';
import { AccountingService } from 'src/app/core/services/ms-accounting/accounting.service';
import { ICabms } from 'src/app/core/services/ms-payment/payment-service';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_POINT_PATTERN } from 'src/app/core/shared/patterns';
import { PartContSirsaeComponent } from '../../part-cont-sirsae/part-cont-sirsae.component';

@Component({
  selector: 'app-mand-by-goods-modal',
  templateUrl: './mand-by-goods-modal.component.html',
  styleUrls: ['./mand-by-goods-modal.component.css'],
})
export class MandByGoodsModalComponent extends BasePage implements OnInit {
  form: FormGroup;
  row: IMandExpenseCont;
  spentId: number;
  selected: ICabms;
  apply: boolean;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private accountingService: AccountingService,
    private detExpenseService: ComerDetexpensesService
  ) {
    super();
    this.prepareForm();
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.row) {
        this.mandxexpensecontId.setValue(this.row.mandxexpensecontId);
        this.amount.setValue(this.row.amount);
        this.vat.setValue(this.row.vat);
        this.retentionisr.setValue(this.row.retentionisr);
        this.retentionvat.setValue(this.row.retentionvat);
        this.cvman.setValue(this.row.cvman);
        this.appliesto.setValue(this.row.appliesto);
        this.departurestop.setValue(this.row.departurestop);
        this.cabms.setValue(this.row.cabms);
        this.descabms.setValue(this.row.descabms);
        this.cooperation.setValue(this.row.cooperation);
        this.departure.setValue(this.row.departure);
        this.categorycabms.setValue(this.row.categorycabms);
      }
    }, 500);
  }

  private prepareForm() {
    this.form = this.fb.group({
      mandxexpensecontId: [null],
      cvman: [null],
      amount: [
        null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      vat: [
        null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      retentionisr: [
        null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      retentionvat: [
        null,
        [Validators.pattern(NUMBERS_POINT_PATTERN), Validators.required],
      ],
      appliesto: [''],
      departurestop: [null],
      cabms: [null, [Validators.required]],
      descabms: [null],
      cooperation: [null],
      departure: [null],
      categorycabms: [null],
    });
  }

  showPartContSirsae() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      callback: (obj: { selected: ICabms; apply: boolean }) => {
        console.log(obj);
        this.loading = true;
        this.selected = obj.selected;
        this.apply = obj.apply;
        this.cabms.setValue(this.selected.CLKCABMS);
        this.descabms.setValue(obj.selected.CVDSC);
        this.cooperation.setValue(obj.selected.CODOPE);
        this.departure.setValue(obj.selected.CVPART);
        this.categorycabms.setValue(obj.selected.CLKSUBCAT + '');
        // if (obj.apply) {
        //   let filterData = this.dataTemp
        //     .filter(row => row.departurestop === this.selected.departurestop)
        //     .map(row => {
        //       return {
        //         ...row,
        //         cabms: obj.selected.CLKCABMS,
        //         descabms: obj.selected.CVDSC,
        //         cooperation: obj.selected.CODOPE,
        //         departure: obj.selected.CVPART,
        //         categorycabms: obj.selected.CLKSUBCAT + '',
        //       };
        //     });
        //   this.dataService
        //     .updateMassive(filterData)
        //     .pipe(take(1))
        //     .subscribe({
        //       next: response => {
        //         this.getData();
        //         this.alert('success', 'Partidas actualizada correctamente', '');
        //       },
        //       error: err => {
        //         this.loading = false;
        //         this.alert(
        //           'success',
        //           'No se pudieron actualizar las partidas',
        //           'Favor de verificar'
        //         );
        //       },
        //     });
        //   //update massive
        //   this.loading = false;
        // } else {
        //   let newRow = {
        //     ...this.selected,
        //     cabms: obj.selected.CLKCABMS,
        //     descabms: obj.selected.CVDSC,
        //     cooperation: obj.selected.CODOPE,
        //     departure: obj.selected.CVPART,
        //     categorycabms: obj.selected.CLKSUBCAT + '',
        //   };
        //   this.dataService
        //     .update(newRow)
        //     .pipe(take(1))
        //     .subscribe({
        //       next: response => {
        //         // this.data.forEach(x => {
        //         //   if (x.mandxexpensecontId === this.selected.mandxexpensecontId) {
        //         //     x = newRow;
        //         //   }
        //         // });
        //         // this.dataTemp = [...this.data];
        //         // this.getPaginated(this.params.value);
        //         // this.loading = false;
        //         this.getData();
        //         this.alert('success', 'Partida actualizada correctamente', '');
        //       },
        //       error: err => {
        //         this.loading = false;
        //         this.alert(
        //           'success',
        //           'No se pudo actualizar la partida',
        //           'Favor de verificar'
        //         );
        //       },
        //     });
        // }
      },
    };
    this.modalService.show(PartContSirsaeComponent, modalConfig);
  }

  get mandxexpensecontId() {
    return this.form.get('mandxexpensecontId');
  }

  get departurestop() {
    return this.form.get('departurestop');
  }

  get amount() {
    return this.form.get('amount');
  }

  get amountValue() {
    return this.amount ? (this.amount.value ? this.amount.value : 0) : 0;
  }

  get vatValue() {
    return this.vat ? (this.vat.value ? this.vat.value : 0) : 0;
  }

  get vat() {
    return this.form.get('vat');
  }

  get retentionisr() {
    return this.form.get('retentionisr');
  }
  get retentionvat() {
    return this.form.get('retentionvat');
  }
  get cvman() {
    return this.form.get('cvman');
  }

  get appliesto() {
    return this.form.get('appliesto');
  }
  get cabms() {
    return this.form.get('cabms');
  }
  get descabms() {
    return this.form.get('descabms');
  }
  get cooperation() {
    return this.form.get('cooperation');
  }
  get departure() {
    return this.form.get('departure');
  }
  get categorycabms() {
    return this.form.get('categorycabms');
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    console.log(this.form.value);
    if (this.row) {
      this.onEditConfirm(this.form.value);
    } else {
      this.onAddConfirm(this.form.value);
    }
  }

  private getBody(body: any) {
    const total = (
      +body.amount +
      +body.vat -
      +body.retentionisr -
      +body.retentionvat
    ).toFixed(2);
    let newBody = {
      ...body,
      spentId: this.spentId,
      total,
    };
    if (newBody.appliesto === '') {
      newBody.appliesto = null;
    }
    return newBody;
  }

  private getBodyDetail(body: any) {
    const total = (
      +body.amount +
      +body.vat -
      +body.isrWithholding -
      +body.vatWithholding
    ).toFixed(2);
    let newBody = {
      ...body,
      expenseNumber: this.spentId,
      cvman: this.cvman.value,
      total,
    };
    if (newBody.appliesto === '') {
      newBody.appliesto = null;
    }
    return newBody;
  }

  private onAddDetailConfirm(body: any) {
    // return;
    if (body) {
      this.detExpenseService
        .create(this.getBodyDetail(body))
        .pipe(take(1))
        .subscribe({
          next: response => {
            // this.alert('success', 'Se ha creado la composición de gasto', '');
            this.modalRef.content.callback(this.apply);
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

  private onEditConfirm(body: any) {
    // return;
    if (body) {
      this.accountingService
        .update(this.getBody(body))
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.alert('success', 'Se ha actualizado correctamente', '');
            this.modalRef.content.callback(this.apply);
            this.modalRef.hide();
          },
          error: err => {
            this.alert('error', 'No se pudo actualizar', '');
          },
        });
    }
  }

  private onAddConfirm(body: any) {
    if (body) {
      let newBody = this.getBody(body);
      delete newBody.mandxexpensecontId;
      this.accountingService
        .create(newBody)
        .pipe(take(1))
        .subscribe({
          next: response => {
            console.log(response);
            this.alert('success', 'Se ha creado la partida por mandato', '');
            this.modalRef.content.callback(this.apply);
            this.modalRef.hide();
            // this.onAddDetailConfirm({
            //   expenseDetailNumber: null,
            //   amount: '0',
            //   budgetItem: '0',
            //   vat: '0',
            //   isrWithholding: '0',
            //   vatWithholding: '0',
            //   transferorNumber: null,
            //   goodNumber: null,
            // });
            // this.getData();
          },
          error: err => {
            console.log(err);
            this.alert('error', 'No se pudo crear la partida por mandato', '');
          },
        });
    }
  }
}
