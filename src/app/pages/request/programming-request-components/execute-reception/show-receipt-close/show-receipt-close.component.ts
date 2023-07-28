import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IReceipt } from 'src/app/core/models/receipt/receipt.model';
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
    private receptionGoodService: ReceptionGoodService
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
}
