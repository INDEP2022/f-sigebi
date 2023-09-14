import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IReceipt } from 'src/app/core/models/receipt/receipt.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared';
import { RECEIPT_COLUMNS } from '../execute-reception-form/columns/minute-columns';

@Component({
  selector: 'app-show-receipt-close',
  templateUrl: './show-receipt-close.component.html',
  styles: [],
})
export class ShowReceiptCloseComponent extends BasePage implements OnInit {
  constructor(
    private modalRef: BsModalRef,
    private wcontentService: WContentService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private receptionGoodService: ReceptionGoodService,
    private goodService: GoodService,
    private programmingGoodService: ProgrammingGoodService,
    private proceedingService: ProceedingsService
  ) {
    super();
  }

  settingsReceiptClose = {
    ...this.settings,
    actions: {
      columnTitle: 'Visualizar',
      position: 'right',
      delete: false,
    },
    columns: RECEIPT_COLUMNS,
    edit: {
      editButtonContent: '<i class="fa fa-eye text-primary mx-2"></i>',
    },
  };

  paramsReceipts = new BehaviorSubject<ListParams>(new ListParams());
  receiptsClose: LocalDataSource = new LocalDataSource();
  totalItemsReceipt: number = 0;
  formLoadingReceipt: boolean = false;
  programming: Iprogramming;
  receiptData: IReceipt;
  infoReceiptOpen: IReceipt;
  ngOnInit(): void {
    this.getReceipts();
  }

  getReceipts() {
    this.formLoadingReceipt = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programming.id;
    this.receptionGoodService.getReceipt(params.getValue()).subscribe({
      next: response => {
        const receiptOpen = response.data.filter((receipt: IReceipt) => {
          return receipt.statusReceipt == 'CERRADO';
        });

        this.receiptData = receiptOpen[0];
        this.receiptsClose.load(receiptOpen);
        this.totalItemsReceipt = this.receiptsClose.count();
        this.formLoadingReceipt = false;
      },
      error: error => {
        this.formLoadingReceipt = false;
        this.totalItemsReceipt = 0;
        this.receiptsClose = new LocalDataSource();
      },
    });
  }

  confirm() {}

  showReceipt(receipt: IReceipt) {
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

  close() {
    this.modalRef.hide();
  }

  receiptSelect(receipt: IReceipt) {
    this.infoReceiptOpen = receipt;
  }

  openReceipt() {
    if (this.infoReceiptOpen) {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.programmingId'] =
        this.infoReceiptOpen.programmingId;
      params.getValue()['filter.statusReceipt'] = 'ABIERTO';
      this.receptionGoodService.getReceipt(params.getValue()).subscribe({
        next: response => {
          this.alert(
            'warning',
            'Acción Invalida',
            'Se requiere tener todos los recibos cerrados para abrir un recibo'
          );
        },
        error: error => {
          const paramsProceeding = new BehaviorSubject<ListParams>(
            new ListParams()
          );
          paramsProceeding.getValue()['filter.id'] = this.infoReceiptOpen.actId;
          paramsProceeding.getValue()['filter.idPrograming'] =
            this.infoReceiptOpen.programmingId;
          this.proceedingService
            .getProceedings(paramsProceeding.getValue())
            .subscribe({
              next: response => {
                const statusProceeding = response.data[0].statusProceeedings;

                if (statusProceeding == 'ABIERTO') {
                  const params = new BehaviorSubject<ListParams>(
                    new ListParams()
                  );
                  params.getValue()['filter.receiptId'] =
                    this.infoReceiptOpen.id;
                  params.getValue()['filter.programmationId'] =
                    this.infoReceiptOpen.programmingId;

                  params.getValue()['filter.actId'] =
                    this.infoReceiptOpen.actId;
                  this.receptionGoodService
                    .getReceiptGood(params.getValue())
                    .subscribe({
                      next: async response => {
                        const updateProgGood = await this.updateProgGood(
                          response.data
                        );
                        if (updateProgGood) {
                          const updateReceipt = await this.updateReceipt();
                          if (updateReceipt) {
                            this.getReceipts();
                            this.receiptsClose = new LocalDataSource();
                            this.totalItemsReceipt = 0;
                            this.alert(
                              'success',
                              'Acción Correcta',
                              'Recibo abierto correctamente'
                            );
                            this.modalRef.hide();
                            this.modalRef.content.callback(true);
                          }
                        }
                      },
                    });
                } else {
                  this.alert(
                    'warning',
                    'Acción Invalida',
                    'El acta relacionada a el recibo ya se encuentra cerrada'
                  );
                }
              },
              error: error => {},
            });
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

  updateProgGood(goods: any[]) {
    return new Promise((resolve, reject) => {
      goods.map(good => {
        const formData: Object = {
          id: good.goodId,
          goodId: good.goodId,
          goodStatus: 'EN_RECEPCION_TMP',
          programmationStatus: 'EN_RECEPCION_TMP',
          executionStatus: 'EN_RECEPCION_TMP',
        };

        this.goodService.updateByBody(formData).subscribe({
          next: response => {
            const formData: Object = {
              programmingId: this.programming.id,
              goodId: good.goodId,
              status: 'EN_RECEPCION_TMP',
              actaId: this.infoReceiptOpen.actId,
            };
            this.programmingGoodService
              .updateGoodProgramming(formData)
              .subscribe({
                next: response => {
                  resolve(true);
                },
                error: error => {},
              });
          },
          error: error => {},
        });
      });
    });
  }

  updateReceipt() {
    return new Promise((resolve, reject) => {
      const formData: any = {
        id: this.infoReceiptOpen.id,
        actId: this.infoReceiptOpen.actId,
        programmingId: this.programming.id,
        statusReceipt: 'ABIERTO',
      };

      this.receptionGoodService.updateReceipt(formData).subscribe({
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
