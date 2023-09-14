import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { BasePage } from 'src/app/core/shared';
import { ACTAS_COLUMNS } from './acta-columns';

@Component({
  selector: 'app-acta-histo',
  templateUrl: './acta-histo.component.html',
  styles: [],
})
export class ActaHistoComponent extends BasePage implements OnInit {
  histo: any[];

  constructor(
    public modalRef: BsModalRef,
    private proceedingService: ProceedingsDeliveryReceptionService,
    private documentService: DocumentsService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = ACTAS_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {}

  async showDocs(data: any) {
    this.loading = true;
    const folio: any = await this.getFolio(data.cve_acta);

    if (!folio) {
      this.alert('error', 'Error', 'No tiene documentos digitalizados');
      this.loading = false;
      return;
    }

    if (!folio.universalFolio) {
      this.alert('error', 'Error', 'No tiene documentos digitalizados');
      this.loading = false;
      return;
    }

    const folioFinal = await this.getFolioFinally(folio.universalFolio);
    if (!folioFinal) {
      this.alert('error', 'Error', 'No tiene documentos digitalizados');
      this.loading = false;
      return;
    }
    this.loading = false;

    if (!folioFinal?.file?.universalFolio) {
      this.alert('error', 'Error', 'No tiene documentos digitalizados');
      return;
    }
    const config = {
      ...MODAL_CONFIG,
      ignoreBackdropClick: false,
      initialState: {
        folio: folioFinal?.file?.universalFolio,
      },
    };
    this.modalService.show(DocumentsViewerByFolioComponent, config);
  }

  async getFolio(cve: string) {
    return new Promise<any>((resolve, reject) => {
      const filter = new FilterParams();
      filter.addFilter('keysProceedings', cve, SearchFilter.EQ);
      this.proceedingService.getAll(filter.getParams()).subscribe({
        next: resp => resolve(resp.data[0]),
        error: () => resolve(null),
      });
    });
  }

  async getFolioFinally(folio: string) {
    return new Promise<any>((resolve, reject) => {
      const filter = new FilterParams();
      filter.addFilter('id', folio, SearchFilter.EQ);
      this.documentService.getAll(filter.getParams()).subscribe({
        next: resp => resolve(resp.data[0]),
        error: () => resolve(null),
      });
    });
  }
}
