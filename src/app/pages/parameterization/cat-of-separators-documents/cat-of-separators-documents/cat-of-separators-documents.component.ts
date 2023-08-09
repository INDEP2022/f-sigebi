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
    this.settings.columns = SEPARATORS_DOCUMENTS_COLUMNS;
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        delete: false,
        add: false,
      },
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
            switch (filter.field) {
              case 'key':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          console.info(this.params);
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
        this.data.load(response.data);
        this.totalItems = response.count || 0;
        this.data.refresh();
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
