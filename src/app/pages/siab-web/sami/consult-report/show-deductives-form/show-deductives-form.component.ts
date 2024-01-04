import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICreditNote } from 'src/app/core/models/ms-order-entry/credit-nots.model';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { PENDING_DEDUCTIVES_COLUMNS } from './show-deductives.columns';

@Component({
  selector: 'app-show-deductives-form',
  templateUrl: './show-deductives-form.component.html',
  styles: [],
})
export class ShowDeductivesFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  deductivesP = new LocalDataSource();
  folio: string = '';
  total: number = 0;
  delegationId: number = 0;
  transferentId: number = 0;
  contractNumber: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  notePaymentSelect: ICreditNote[] = [];
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private orderEntryService: orderentryService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      selectMode: 'multi',
      actions: false,
      columns: PENDING_DEDUCTIVES_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCreditsNots());
  }

  prepareForm() {
    this.form = this.fb.group({
      total: [null],
      folios: [null],
    });

    this.form.get('folios').setValue(this.folio);
    this.form.get('total').setValue(this.total);
  }

  getCreditsNots() {
    this.loading = true;
    this.params.getValue()[
      'filter.delegationRegionalId'
    ] = `$eq:${this.delegationId}`;
    this.params.getValue()['filter.transfereeId'] = `$eq:${this.transferentId}`;
    this.params.getValue()[
      'filter.contractNumber'
    ] = `$eq:${this.contractNumber}`;

    this.orderEntryService.getCreditNots(this.params.getValue()).subscribe({
      next: response => {
        this.deductivesP.load(response.data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  selectDeductive(data: ICreditNote[]) {
    this.notePaymentSelect = data;
  }

  confirm() {
    if (this.notePaymentSelect.length) {
      let montDeduction: number;
      let success: boolean = false;
      let errorUpdate: boolean = false;
      this.notePaymentSelect.map(item => {
        montDeduction = Number(this.total) * Number(item.porcDeduction);

        const infoNotePayment: Object = {
          id: item.id,
          amountDeduction: montDeduction,
          amountPay: this.total,
        };

        this.orderEntryService
          .putCreditNots(item.id, infoNotePayment)
          .subscribe({
            next: () => {
              success = true;
              this.alert(
                'success',
                'Acción Correcta',
                'Monto de deducción generado correctamente'
              );
              this.modalRef.content.callback(true);
              this.modalRef.hide();
            },
            error: () => {
              errorUpdate = true;
              this.alert(
                'warning',
                'Acción Invalida',
                'Monto de deducción no generado'
              );
            },
          });
      });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar una deductiva para generar el monto de deducción'
      );
    }
  }

  close() {
    this.modalRef.hide();
  }
}
