import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IRecepitGuard } from 'src/app/core/models/receipt/receipt.model';
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
    private sanitizer: DomSanitizer
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
}
