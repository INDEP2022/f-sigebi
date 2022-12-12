import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DocumentsListComponent } from 'src/app/@standalone/documents-list/documents-list.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { ViewPhotosComponent } from '../view-photos/view-photos.component';
import { GP_GOODS_COLUMNS } from './goods-columns';

@Component({
  selector: 'goods-table',
  templateUrl: './goods-table.component.html',
  styles: [],
})
export class GoodsTableComponent extends BasePage implements OnInit {
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  constructor(
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) {
    super();
    this.settings.actions = false;
    this.settings.columns = GP_GOODS_COLUMNS;
  }

  ngOnInit(): void {}

  viewImages() {
    const modalConfig = MODAL_CONFIG;
    this.modalService.show(DocumentsListComponent, modalConfig);
  }

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  viewPhotos() {
    const modalConfig = MODAL_CONFIG;
    this.modalService.show(ViewPhotosComponent, modalConfig);
  }
}
