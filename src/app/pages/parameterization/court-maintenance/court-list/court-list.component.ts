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
import { ICourt } from 'src/app/core/models/catalogs/court.model';
import { CourtByCityService } from 'src/app/core/services/catalogs/court-by-city.service';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNSLIST } from '../court-maintenance/columns';

@Component({
  selector: 'app-court-list',
  templateUrl: './court-list.component.html',
  styles: [],
})
export class CourtListComponent extends BasePage implements OnInit {
  columns: ICourt[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  dataCourt: IListResponse<ICourt> = {} as IListResponse<ICourt>;

  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());

  constructor(
    private modalRef: BsModalRef,
    private courtService: CourtService,
    private courtCityServ: CourtByCityService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNSLIST },
    };
    this.totalItems = 0;
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
            filter.field == 'city'
              ? (field = `filter.${filter.field}.nameCity`)
              : (field = `filter.${filter.field}`);
            filter.field == 'id' || filter.field == 'zipCode'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getCourts();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCourts());
  }

  getCourts() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.courtService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;

        this.data.load(this.columns);
        this.data.refresh();
        this.loading = false;
      },
      error: error =>
        //this.onLoadToast('error', error.error.message, ''),
        (this.loading = false),
    });
  }

  formDataCourt(data: ICourt) {
    this.modalRef.content.callback(true, data);
    this.modalRef.hide();
  }
  deleteCourt(id: number) {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().addFilter('court', id, SearchFilter.EQ);
    this.getCourtByCity(id);
  }

  getCourtByCity(id: number) {
    this.courtCityServ
      .getAllWithFilters(this.filterParams.getValue().getParams())
      .subscribe({
        next: response => {
          if (response.data.length > 0) {
            this.alert(
              'info',
              'Juzgado con Ciudades',
              'Debe eliminar primero las ciudades asignadas de dicho juzgado'
            );
          } else {
            this.alertQuestion(
              'warning',
              'Eliminar',
              '¿Desea eliminar este registro?'
            ).then(question => {
              if (question.isConfirmed) {
                this.courtService.remove(id).subscribe({
                  next: () => {
                    this.alert(
                      'success',
                      'Registro de Juzgado',
                      'Borrado Correctamente'
                    );
                    this.getCourts();
                  },
                  error: err => {
                    this.alert(
                      'warning',
                      'Juzgado con Ciudades',
                      'No se puede eliminar el objeto debido a una relación con otra tabla.'
                    );
                  },
                });
              }
            });
          }
        },
        error: error => this.onLoadToast('error', error.error.message, ''),
      });
  }

  handleSuccess() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
