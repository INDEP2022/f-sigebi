import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-list-data',
  templateUrl: './list-data.component.html',
  styles: [],
})
export class ListDataAppointmentComponent extends BasePage implements OnInit {
  @Input() plain = false;
  dataDocs: IListResponse<any /*Modelado de datos*/> =
    {} as IListResponse<any /*Modelado de datos*/>;

  //Declaraciones para ocupar filtrado
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  constructor(
    private modalRef: BsModalRef,
    private docService: DocumentsService
  ) {
    super();
    this.settings.hideSubHeader = false;
    this.settings.columns = COLUMNS;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
    this.dataDocs.count = 0;
  }

  ngOnInit(): void {
    //Convertir los filterParams en ListParams
    const exist = this.filterParams.getValue().getFilterParams();

    if (exist) {
      const filters = exist.split('&');
      filters.map(fil => {
        const partsFilter = fil.split('=');
        this.columnFilters[partsFilter[0]] = partsFilter[1];
      });
    }

    //Filtrado por columnas
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              id: () => (searchFilter = SearchFilter.EQ),
              keyTypeDocument: () => (searchFilter = SearchFilter.ILIKE),
              significantDate: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getNotfications();
        }
      });

    //observador para el paginado
    this.paramsList
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getNotfications());
  }

  formData(doc: any /*Modelado de datos */) {
    this.modalRef.content.callback(true, doc);
    this.modalRef.hide();
  }

  getNotfications() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };

    //Usar extends HttpService en los servicios para usar ListParams | string por si el service usa FiltersParams
    this.docService.getAll(params).subscribe({
      next: resp => {
        this.totalItems = resp.count;
        this.dataDocs = resp;
        this.data.load(resp.data);
        this.data.refresh();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.totalItems = 0;
        this.data.load([]);
        this.data.refresh();
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
