import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SeparatorsDocuments } from 'src/app/core/models/ms-documents/document-separators';
import { DocumentsSeparatorsService } from 'src/app/core/services/ms-documents-separators/documents-separators.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CatOfSeparatorsDocumentsModalComponent } from '../cat-of-separators-documents-modal/cat-of-separators-documents-modal.component';
import { SEPARATORS_DOCUMENTS_COLUMNS } from './cat-of-separators-documents-columns';

@Component({
  selector: 'app-cat-of-separators-documents',
  templateUrl: './cat-of-separators-documents.component.html',
  styles: [],
})
export class CatOfSeparatorsDocumentsComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  separatorsDocuments: SeparatorsDocuments[] = [];
  constructor(
    private documentsSeparatorsService: DocumentsSeparatorsService,
    private modalService: BsModalService
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
      columns: SEPARATORS_DOCUMENTS_COLUMNS,
    };
  }
  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDateDocumentsSeparators());
  }
  private getDateDocumentsSeparators() {
    this.loading = true;
    this.documentsSeparatorsService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.separatorsDocuments = response.data;
        this.totalItems = response.count != undefined ? response.count : 0;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  deleteDocument(id: string) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        // this.documentsServ.delete(id).subscribe({
        //     next: () => (
        //         this.onLoadToast('success', 'Eliminado correctamente', ''),
        //         this.getPagination()
        //     ),
        //     error: err => this.onLoadToast('error', err.error.message, ''),
        // });
      }
    });
  }
  public openForm(separatorsDocuments?: SeparatorsDocuments) {
    let config: ModalOptions = {
      initialState: {
        separatorsDocuments,
        callback: (next: boolean) => {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getDateDocumentsSeparators());
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(CatOfSeparatorsDocumentsModalComponent, config);
  }
}
