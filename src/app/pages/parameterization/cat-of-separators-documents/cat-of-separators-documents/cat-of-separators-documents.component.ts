import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
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
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
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
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
  }
  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            // filter.field == 'id'
            //   ? (searchFilter = SearchFilter.EQ)
            //   : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getDateDocumentsSeparators();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDateDocumentsSeparators());
  }
  private getDateDocumentsSeparators() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.documentsSeparatorsService.getAll(params).subscribe({
      next: response => {
        this.separatorsDocuments = response.data;
        this.data.load(this.separatorsDocuments);
        this.data.refresh();
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
