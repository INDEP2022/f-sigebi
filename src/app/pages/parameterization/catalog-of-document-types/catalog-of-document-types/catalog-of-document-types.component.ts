import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { TypesDocuments } from 'src/app/core/models/ms-documents/documents-type';
import { DocumentsTypeService } from 'src/app/core/services/ms-documents-type/documents-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalCatalogOfDocumentTypesComponent } from '../modal-catalog-of-document-types/modal-catalog-of-document-types.component';

@Component({
  selector: 'app-catalog-of-document-types',
  templateUrl: './catalog-of-document-types.component.html',
  styles: [],
})
export class CatalogOfDocumentTypesComponent
  extends BasePage
  implements OnInit
{
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  searchFilter: SearchBarFilter;
  contentDocuments: IListResponse<TypesDocuments> =
    {} as IListResponse<TypesDocuments>;

  constructor(
    private modalService: BsModalService,
    private documentsServ: DocumentsTypeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: {
        id: {
          title: 'Tipo Documento',
          sort: false,
        },
        description: {
          title: 'Descripción',
          sort: false,
        },
      },
    };
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
    this.searchFilter = { field: 'description', operator: SearchFilter.ILIKE };
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
          this.getPagination();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPagination());
  }

  openForm(allotment?: TypesDocuments) {
    let config: ModalOptions = {
      initialState: {
        allotment,
        callback: (next: boolean) => {
          if (next) this.getPagination();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalCatalogOfDocumentTypesComponent, config);
  }

  getPagination() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.documentsServ.getAllWidthFilters(params).subscribe({
      next: resp => {
        console.log(resp);
        this.contentDocuments = resp.data;
        this.totalItems = resp.count;
        this.data.load(resp.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (
        this.onLoadToast('error', error.error.message, ''),
        (this.loading = false)
      ),
    });
  }

  deleteDocument(id: string) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.documentsServ.remove(id).subscribe({
          next: () => (
            this.onLoadToast('success', 'Eliminado correctamente', ''),
            this.getPagination()
          ),
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
      }
    });
  }
}
