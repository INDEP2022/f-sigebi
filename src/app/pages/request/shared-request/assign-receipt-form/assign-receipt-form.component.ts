import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodProgramming } from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IReceipt } from 'src/app/core/models/receipt/receipt.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
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
  selectGoods: IGoodProgramming[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  receipts: IReceipt[] = [];
  receiptId: number = 0;
  actId: number = 0;
  statusReceipt: string = '';
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private proceedingService: ProceedingsService,
    private receptionGoodService: ReceptionGoodService,
    private programminGoodService: ProgrammingGoodService,
    private goodService: GoodService,
    private authService: AuthService
  ) {
    super();
    this.settingsReceipt.columns = RECEIPT_COLUMNS;
  }

  ngOnInit(): void {
    this.getReceipts();
  }

  getReceipts() {
    this.loading = true;
    this.params.getValue()['filter.programmingId'] = this.programming.id;

    this.receptionGoodService.getReceipt(this.params.getValue()).subscribe({
      next: response => {
        this.receipts = response.data;
        this.loading = false;
      },
      error: error => {},
    });
  }

  receiptSelect(receipt: IReceipt) {
    console.log('receipt', receipt);
    this.receiptId = receipt.id;
    this.actId = receipt.actId;
    this.statusReceipt = receipt.statusReceipt;
  }

  confirm() {
    if (this.statusReceipt == 'ABIERTO') {
      const user: any = this.authService.decodeToken();
      this.selectGoods.map(item => {
        const formData: Object = {
          /*id: 1,
          receiptId: this.receiptId,
          actId: this.actId,
          goodId: item.goodId,
          programmationId: this.programming.id,
          userCreation: user.username,
          creationDate: new Date(),
          userModification: user.username,
          modificationDate: new Date(), */
          id: 1,
          receiptId: this.receiptId,
          actId: this.actId,
          goodId: item.goodId,
          programmationId: this.programming.id,
          userCreation: user.username,
          creationDate: new Date(),
          userModification: user.username,
          modificationDate: new Date(),
        };
        console.log('formData', formData);
        this.receptionGoodService.createReceiptGood(formData).subscribe({
          next: response => {
            console.log('creando recibo bien', true);
            const formData: Object = {
              programmingId: this.programming.id,
              goodId: item.goodId,
              status: 'EN_RECEPCION_TMP',
            };

            this.programminGoodService
              .updateGoodProgramming(formData)
              .subscribe({
                next: response => {
                  console.log('Actualizando programminggood', true);
                  const formData: Object = {
                    id: item.id,
                    goodId: item.goodId,
                    goodStatus: 'EN_RECEPCION_TMP',
                    programmationStatus: 'EN_RECEPCION_TMP',
                  };
                  this.goodService.updateByBody(formData).subscribe({
                    next: response => {
                      console.log('update good', response);
                      this.modalRef.content.callback(true);
                      this.close();
                    },
                    error: error => {},
                  });
                },
                error: error => {},
              });
          },
          error: error => {
            console.log('error al crear el recibo', error);
          },
        });
      });
    } else {
      this.onLoadToast(
        'info',
        'Acción Invalida',
        'Se debe seleccionar un bien con status Abierto'
      );
    }
  }

  close() {
    this.modalRef.hide();
  }

  createReceipt() {
    if (this.receipts[0].statusReceipt != 'ABIERTO') {
      const form: Object = {
        minutesId: '1',
        idPrograming: this.programming.id,
      };

      this.proceedingService.createProceedings(form).subscribe({
        next: response => {
          const receiptForm: Object = {
            id: 8,
            actId: response.id,
            programmingId: this.programming.id,
            statusReceipt: 'ABIERTO',
          };
          this.receptionGoodService.createReceipt(receiptForm).subscribe({
            next: response => {
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
    } else {
      this.onLoadToast(
        'info',
        'Acción Invalida',
        'El acta tiene recibos que aun no se encuentran cerrados, cierre todos los recibos asociados al acta antes de cerrar el acta.'
      );
    }
  }
}
