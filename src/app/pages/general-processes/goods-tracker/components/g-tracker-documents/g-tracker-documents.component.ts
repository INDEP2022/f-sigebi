import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared';
import { GTTRACKER_DOCUMENTS_COLUMNS } from './g-tracker-docs-dcolumns';

@Component({
  selector: 'app-g-tracker-documents',
  templateUrl: './g-tracker-documents.component.html',
  styles: [],
})
export class GTrackerDocumentsComponent extends BasePage implements OnInit {
  documents: any[] = [];
  selectedRow: any = null;
  $params = new BehaviorSubject(new FilterParams());
  totalItems = 0;
  trackedGood: ITrackedGood = null;
  byExpedient = false;
  constructor(
    private documentsService: DocumentsService,
    private modalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: GTTRACKER_DOCUMENTS_COLUMNS,
      actions: false,
    };
  }

  ngOnInit(): void {
    this.$params.subscribe(params => {
      if (this.byExpedient) {
        this.getDocumentsByExpedient(params);
      } else {
        this.getDocuments(params);
      }
    });
  }

  viewDocuments(data: any) {
    console.log(data);

    const config = {
      ...MODAL_CONFIG,
      ignoreBackdropClick: false,
      initialState: {
        folio: data?.folio_universal,
      },
    };
    this.modalService.show(DocumentsViewerByFolioComponent, config);
  }

  getDocuments(params?: FilterParams) {
    this.loading = true;
    this.documentsService
      .getFolio(
        {
          expedientNumber: this.trackedGood.fileNumber,
          goodNumber: this.trackedGood.goodNumber,
        },
        params.getParams()
      )
      .subscribe({
        next: res => {
          this.loading = false;
          this.documents = res.data;
          this.totalItems = res.count;
        },
        error: err => {
          this.loading = false;
          this.documents = [];
          this.totalItems = 0;
        },
      });
  }

  getDocumentsByExpedient(params?: FilterParams) {
    this.loading = true;
    params.addFilter('numberProceedings', this.trackedGood.fileNumber);
    this.documentsService.getAll(params.getParams()).subscribe({
      next: response => {
        this.loading = false;
        this.documents = response.data.map(document => {
          return {
            folio_universal: document.id,
            hojas: document.sheets,
            descripcion_documento: document.descriptionDocument,
          };
        });
        this.totalItems = response.count;
      },
      error: error => {
        this.loading = false;
        this.documents = [];
        this.totalItems = 0;
      },
    });
  }

  // confirm() {}

  close() {
    this.modalRef.hide();
  }
}
