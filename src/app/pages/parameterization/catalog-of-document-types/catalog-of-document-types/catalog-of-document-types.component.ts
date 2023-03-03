import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
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
  params = new BehaviorSubject<FilterParams>(new FilterParams());
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
    this.searchFilter = { field: 'description', operator: SearchFilter.ILIKE };
  }

  ngOnInit(): void {
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
    this.documentsServ
      .getAllWidthFilters(this.params.getValue().getParams())
      .subscribe({
        next: resp => {
          this.contentDocuments = resp;
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
