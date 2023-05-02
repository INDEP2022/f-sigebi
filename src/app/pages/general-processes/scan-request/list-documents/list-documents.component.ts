import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-list-documents',
  templateUrl: './list-documents.component.html',
  styles: [],
})
export class ListDocumentsComponent extends BasePage implements OnInit {
  dataDocs: IListResponse<IDocuments> = {} as IListResponse<IDocuments>;
  filterParamsDocuments = new BehaviorSubject<FilterParams>(new FilterParams());

  constructor(
    private modalRef: BsModalRef,
    private docService: DocumentsService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.filterParamsDocuments
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => {
        this.getNotfications();
      });
  }

  formDataDoc(doc: IDocuments) {
    this.modalRef.content.callback(true, doc);
    this.modalRef.hide();
  }

  getNotfications() {
    this.loading = true;
    this.docService
      .getAllFilter(this.filterParamsDocuments.getValue().getParams())
      .subscribe({
        next: resp => {
          this.loading = false;
          this.dataDocs = resp;
        },
        error: err => {
          this.loading = false;
          this.onLoadToast('error', err.error.message, '');
        },
      });
  }

  close() {
    this.modalRef.hide();
  }
}
