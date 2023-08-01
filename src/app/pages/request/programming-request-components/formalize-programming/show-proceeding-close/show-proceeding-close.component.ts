import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared';
import { PROCEEDINGS_COLUMNS_CLOSE } from 'src/app/pages/final-destination-process/return-acts/return-acts/proceedings-columns';

@Component({
  selector: 'app-show-proceeding-close',
  templateUrl: './show-proceeding-close.component.html',
  styles: [],
})
export class ShowProceedingCloseComponent extends BasePage implements OnInit {
  settingsProceedingClose = {
    ...this.settings,
    actions: {
      columnTitle: 'Visualizar',
      position: 'right',
      delete: false,
    },
    columns: PROCEEDINGS_COLUMNS_CLOSE,
    edit: {
      editButtonContent: '<i class="fa fa-eye text-primary mx-2"></i>',
    },
  };

  proceedingClose: LocalDataSource = new LocalDataSource();
  paramsProceeding = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsProceeding: number = 0;
  programming: Iprogramming;
  proceeding: IProceedings;

  constructor(
    private modalRef: BsModalRef,
    private sanitizer: DomSanitizer,
    private wcontentService: WContentService,
    private modalService: BsModalService,
    private proceedingService: ProceedingsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getProceedingClose();
  }

  getProceedingClose() {
    this.paramsProceeding.getValue()['filter.idPrograming'] =
      this.programming.id;
    this.paramsProceeding.getValue()['filter.statusProceeedings'] = 'CERRADO';
    this.proceedingService
      .getProceedings(this.paramsProceeding.getValue())
      .subscribe({
        next: response => {
          this.proceedingClose.load(response.data);
        },
        error: error => {},
      });
  }

  showProceeding(receipt: IProceedings) {
    this.wcontentService.obtainFile(receipt.id_content).subscribe({
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
