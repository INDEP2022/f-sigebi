import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RECEIPT_COLUMNS } from '../../programming-request-components/execute-reception/execute-reception-form/columns/minute-columns';

@Component({
  selector: 'app-assign-receipt-form',
  templateUrl: './assign-receipt-form.component.html',
  styles: [],
})
export class AssignReceiptFormComponent extends BasePage implements OnInit {
  settingsReceipt = { ...TABLE_SETTINGS, actions: false };
  programming: Iprogramming;
  params = new BehaviorSubject<ListParams>(new ListParams());
  receipts: any[] = [];
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private proceedingService: ProceedingsService,
    private receptionGood: ReceptionGoodService //private receiptService: ReceiptSer
  ) {
    super();
    this.settingsReceipt.columns = RECEIPT_COLUMNS;
  }

  ngOnInit(): void {
    this.getReceipts();
  }

  getReceipts() {
    console.log('programming', this.programming);
    this.params.getValue()['filter.programmingId'] = this.programming.id;
    this.params.getValue()['filter.statusReceipt'] = 'ABIERTO';
    this.receptionGood.getReceptions(this.params.getValue()).subscribe({
      next: response => {
        console.log('response', response);
      },
      error: error => {
        console.log('recibos', error);
      },
    });
  }

  confirm() {
    this.modalRef.content.callback(true);
    this.close();
  }

  close() {
    this.modalRef.hide();
  }

  createReceipt() {
    const form: Object = {
      idPrograming: this.programming.id,
    };

    this.proceedingService.createProceedings(form).subscribe({
      next: response => {
        console.log('acta creada', response);
        const receiptForm: Object = {
          actId: response.id,
          programmingId: this.programming.id,
          statusReceipt: 'ABIERTO',
        };
        this.receptionGood.createReception(receiptForm).subscribe({
          next: response => {
            console.log('recibo creado', response);
            this.getReceipts();
          },
          error: error => {
            console.log(error);
          },
        });
      },
      error: error => {
        console.log(error);
      },
    });
  }
}
