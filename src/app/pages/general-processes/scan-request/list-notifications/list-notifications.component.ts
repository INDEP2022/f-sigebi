import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-list-notifications',
  templateUrl: './list-notifications.component.html',
  styles: [],
})
export class ListNotificationsComponent extends BasePage implements OnInit {
  //   dataNotification: IListResponse<INotification> =
  //     {} as IListResponse<INotification>;
  //   filterParamsDocuments = new BehaviorSubject<FilterParams>(new FilterParams());

  //   constructor(
  //     private modalRef: BsModalRef,
  //     private notifyService: NotificationService
  //   ) {
  //     super();
  //     this.settings = {
  //       ...this.settings,
  //       actions: {
  //         columnTitle: 'Acciones',
  //         edit: true,
  //         delete: false,
  //         position: 'right',
  //       },
  //       columns: { ...COLUMNS },
  //     };
  //   }

  //   ngOnInit(): void {
  //     this.filterParamsDocuments
  //       .pipe(takeUntil(this.$unSubscribe))
  //       .subscribe(() => {
  //         this.getNotfications();
  //       });
  //   }

  //   formDataNoti(notify: INotification) {
  //     this.modalRef.content.callback(true, notify);
  //     this.modalRef.hide();
  //   }

  //   getNotfications() {
  //     this.loading = true;
  //     this.notifyService
  //       .getAllFilter(this.filterParamsDocuments.getValue().getParams())
  //       .subscribe({
  //         next: resp => {
  //           this.loading = false;
  //           this.dataNotification = resp;
  //         },
  //         error: err => {
  //           this.loading = false;
  //           this.onLoadToast('error', err.error.message, '');
  //         },
  //       });
  //   }

  //   close() {
  //     this.modalRef.hide();
  //   }
  // }

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
    private notifyService: NotificationService
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

    console.log(exist);

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
              expedientNumber: () => (searchFilter = SearchFilter.EQ),
              wheelNumber: () => (searchFilter = SearchFilter.EQ),
              preliminaryInquiry: () => (searchFilter = SearchFilter.ILIKE),
              criminalCase: () => (searchFilter = SearchFilter.ILIKE),
              touchPenaltyKey: () => (searchFilter = SearchFilter.EQ),
              circumstantialRecord: () => (searchFilter = SearchFilter.ILIKE),
              protectionKey: () => (searchFilter = SearchFilter.ILIKE),
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
    this.notifyService.getAllListParamsColumns(params).subscribe({
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
