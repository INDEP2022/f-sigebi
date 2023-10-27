import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import {
  IReceipt,
  IRecepitGuard,
} from 'src/app/core/models/receipt/receipt.model';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared';
import { RECEIPT_GUARD_COLUMNS } from '../execute-reception-form/columns/minute-columns';

@Component({
  selector: 'app-show-receipt-guard-close',
  templateUrl: './show-receipt-guard-close.component.html',
  styles: [],
})
export class ShowReceiptGuardCloseComponent extends BasePage implements OnInit {
  receiptWarehouseGood: LocalDataSource = new LocalDataSource();
  paramsReceipts = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsReceipt: number = 0;

  programming: Iprogramming;
  receiptGuard: IReceipt;
  typeReceipt: string = '';
  settingsReceiptClose = {
    ...this.settings,
    actions: {
      columnTitle: 'Visualizar',
      position: 'right',
      delete: false,
    },
    columns: RECEIPT_GUARD_COLUMNS,
    edit: {
      editButtonContent: '<i class="fa fa-eye text-primary mx-2"></i>',
    },
  };
  constructor(
    private modalRef: BsModalRef,
    private receptionGoodService: ReceptionGoodService,
    private wcontentService: WContentService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private proceedingService: ProceedingsService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.typeReceipt == 'warehouse') {
      this.paramsReceipts
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getReceiptsGuard());
    } else if (this.typeReceipt == 'guard') {
      this.paramsReceipts
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getReceiptsGuardGoods());
    }
  }

  getReceiptsGuard() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    this.paramsReceipts.getValue()['filter.programmingId'] =
      this.programming.id;
    this.paramsReceipts.getValue()['filter.statusReceiptGuard'] = 'CERRADO';
    this.receptionGoodService
      .getReceptions(this.paramsReceipts.getValue())
      .subscribe({
        next: response => {
          const filterWarehouse = response.data.map((item: any) => {
            if (item.typeReceipt == 'ALMACEN') return item;
          });

          const infoWarehouse = filterWarehouse.filter(
            (item: IRecepitGuard) => {
              return item;
            }
          );

          //this.receiptWarehouseGood = infoWarehouse[0];

          if (infoWarehouse.length > 0) {
            infoWarehouse[0].receiptDate = moment(
              infoWarehouse[0]?.receiptDate
            ).format('DD/MM/YYYY');
            this.receiptWarehouseGood.load(infoWarehouse);
            this.totalItemsReceipt = this.receiptWarehouseGood.count();
          }

          /*const filterGuard = response.data.map((item: any) => {
          if (item.typeReceipt == 'RESGUARDO') return item;
        });
        if (filterGuard) {
          const infoGuard = filterGuard.filter((item: IRecepitGuard) => {
            return item;
          });
          this.receiptGuardGood = infoGuard[0];

          if (infoGuard.length > 0) {
            infoGuard[0].receiptDate = moment(infoGuard[0]?.receiptDate).format(
              'DD/MM/YYYY'
            );
            this.receiptGuards.load(infoGuard);
          }
        } */
        },
        error: error => {},
      });
  }

  getReceiptsGuardGoods() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    this.paramsReceipts.getValue()['filter.programmingId'] =
      this.programming.id;
    this.paramsReceipts.getValue()['filter.statusReceiptGuard'] = 'CERRADO';
    this.receptionGoodService
      .getReceptions(this.paramsReceipts.getValue())
      .subscribe({
        next: response => {
          const filterWarehouse = response.data.map((item: any) => {
            if (item.typeReceipt == 'RESGUARDO') return item;
          });

          const infoWarehouse = filterWarehouse.filter(
            (item: IRecepitGuard) => {
              return item;
            }
          );

          //this.receiptWarehouseGood = infoWarehouse[0];

          if (infoWarehouse.length > 0) {
            infoWarehouse[0].receiptDate = moment(
              infoWarehouse[0]?.receiptDate
            ).format('DD/MM/YYYY');
            this.receiptWarehouseGood.load(infoWarehouse);
            this.totalItemsReceipt = this.receiptWarehouseGood.count();
          }

          /*const filterGuard = response.data.map((item: any) => {
          if (item.typeReceipt == 'RESGUARDO') return item;
        });
        if (filterGuard) {
          const infoGuard = filterGuard.filter((item: IRecepitGuard) => {
            return item;
          });
          this.receiptGuardGood = infoGuard[0];

          if (infoGuard.length > 0) {
            infoGuard[0].receiptDate = moment(infoGuard[0]?.receiptDate).format(
              'DD/MM/YYYY'
            );
            this.receiptGuards.load(infoGuard);
          }
        } */
        },
        error: error => {},
      });
  }

  confirm() {}

  close() {
    this.modalRef.hide();
  }

  showReceipt(receipt: IRecepitGuard) {
    this.wcontentService.obtainFile(receipt.contentId).subscribe({
      next: response => {
        let blob = this.dataURItoBlob(response);
        let file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.openPrevPdf(fileURL);
      },
      error: error => {},
    });
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  openPrevPdf(pdfUrl: string) {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  receiptSelect(receipt: IReceipt) {
    console.log('receipt', receipt);
    this.receiptGuard = receipt;
  }
  openReceipt() {
    if (this.receiptGuard) {
      const paramsProceeding = new BehaviorSubject<ListParams>(
        new ListParams()
      );
      paramsProceeding.getValue()['filter.id'] = this.receiptGuard.actId;
      paramsProceeding.getValue()['filter.idPrograming'] =
        this.receiptGuard.programmingId;
      this.proceedingService
        .getProceedings(paramsProceeding.getValue())
        .subscribe({
          next: response => {
            const statusProceeding = response.data[0].statusProceeedings;

            if (statusProceeding == 'ABIERTO') {
              this.alertQuestion(
                'question',
                'Confirmación',
                '¿Desea abrir el recibo?'
              ).then(question => {
                if (question.isConfirmed) {
                  const params = new BehaviorSubject<ListParams>(
                    new ListParams()
                  );
                  params.getValue()['filter.receiptId'] = this.receiptGuard.id;
                  params.getValue()['filter.programmationId'] =
                    this.receiptGuard.programmingId;
                  params.getValue()['filter.actId'] = this.receiptGuard.actId;
                  this.receptionGoodService
                    .getReceptionGoods(params.getValue())
                    .subscribe({
                      next: async response => {
                        const updateReceipt = await this.updateReceipt();
                        if (updateReceipt) {
                          if (this.typeReceipt == 'warehouse') {
                            this.paramsReceipts
                              .pipe(takeUntil(this.$unSubscribe))
                              .subscribe(() => this.getReceiptsGuardGoods());

                            this.receiptWarehouseGood = new LocalDataSource();
                            this.totalItemsReceipt = 0;
                            this.alert(
                              'success',
                              'Acción Correcta',
                              'Recibo abierto correctamente'
                            );
                            this.modalRef.content.callback(true);
                            this.modalRef.hide();
                          } else if (this.typeReceipt == 'guard') {
                            this.paramsReceipts
                              .pipe(takeUntil(this.$unSubscribe))
                              .subscribe(() => this.getReceiptsGuardGoods());

                            this.receiptWarehouseGood = new LocalDataSource();
                            this.totalItemsReceipt = 0;
                            this.alert(
                              'success',
                              'Acción Correcta',
                              'Recibo abierto correctamente'
                            );
                            this.modalRef.content.callback(true);
                            this.modalRef.hide();
                          }
                          //this.getReceipts();
                        }
                      },
                    });
                }
              });
            } else {
              this.alert(
                'warning',
                'Acción Invalida',
                'El acta relacionada a el recibo ya se encuentra cerrada'
              );
            }
          },
        });
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere seleccionar un recibo'
      );
    }
  }

  updateReceipt() {
    return new Promise((resolve, reject) => {
      const formData: any = {
        id: this.receiptGuard.id,
        actId: this.receiptGuard.actId,
        programmingId: this.programming.id,
        statusReceiptGuard: 'ABIERTO',
      };

      this.receptionGoodService
        .updateReceiptGuard(this.receiptGuard.id, formData)
        .subscribe({
          next: () => {
            resolve(true);
          },
          error: error => {
            resolve(true);
          },
        });
    });
  }
}
