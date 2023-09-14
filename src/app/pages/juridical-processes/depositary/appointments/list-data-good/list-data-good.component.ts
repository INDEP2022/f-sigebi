import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AppointmentsService } from '../services/appointments.service';
import { COLUMNS_DATA } from './columns';

@Component({
  selector: 'app-list-data-appintment-good',
  templateUrl: './list-data-good.component.html',
  styles: [],
})
export class ListDataAppointmentGoodsComponent
  extends BasePage
  implements OnInit
{
  @Input() plain = false;

  //Declaraciones para ocupar filtrado
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  @Input() noBien: number = null;
  @Input() expedient: number = null;
  docSelect: IGood = null;

  // Goods
  dataTableGood: LocalDataSource = new LocalDataSource();
  dataTableParamsGood = new BehaviorSubject<ListParams>(new ListParams());
  loadingGood: boolean = false;
  totalGood: number = 0;
  testDataGood: any[] = [];
  columnFiltersGood: any = [];
  //
  constructor(
    private modalRef: BsModalRef,
    private docService: DocumentsService,
    private appointmentsService: AppointmentsService
  ) {
    super();
    this.settings.hideSubHeader = true;
    this.settings.columns = COLUMNS_DATA;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
    this.settings.actions.edit = false;
    this.settings.hideSubHeader = false;
    // this.dataDocs.count = 0;
  }

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.paramsList);
      if (this.paramsList) {
        //observador para el paginado
        // this.paramsList
        //   .pipe(takeUntil(this.$unSubscribe))
        //   .subscribe(() => this.getAppointments());
        this.loadingDataTableGood();
      }
    }, 300);
  }

  formData(event: any) {
    console.log(event);
    if (event.isSelected) {
      let doc: IGood = event.data;
      // this.modalRef.content.callback(true, doc);
      // this.modalRef.hide();
      this.docSelect = doc;
    } else {
      this.docSelect = null;
    }
  }

  getAppointments() {
    this.loading = true;
    const params = new ListParams();
    // params['filter.numberGood'] = '$eq:' + this.noBien;
    // params['filter.numberGood'] = this.noBien;
    params.limit = this.paramsList.value.limit;
    params.page = this.paramsList.value.page;
    console.log(params);

    params['filter.goodId'] = '$not:' + this.noBien;
    params['filter.fileNumber'] = '$eq:' + this.expedient;
    params['sortBy'] = 'goodId:ASC';
    this.appointmentsService.getGoodByParams(params).subscribe({
      next: resp => {
        console.log(resp);

        this.totalItems = resp.count;
        this.data.load(resp.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        console.log(error);
        this.loading = false;
        this.totalItems = 0;
        this.data.load([]);
        this.data.refresh();
      },
    });
  }

  close() {
    this.modalRef.content.callback(false, null);
    this.modalRef.hide();
  }
  confirm() {
    if (this.docSelect == null) {
      this.alert(
        'warning',
        'Selecciona un registro primero para continuar',
        ''
      );
      return;
    }
    this.modalRef.content.callback(true, this.docSelect);
    this.modalRef.hide();
  }
  loadingDataTableGood() {
    //Filtrado por columnas
    this.dataTableGood
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
              description: () => (searchFilter = SearchFilter.LIKE),
              status: () => (searchFilter = SearchFilter.EQ),
              goodClassNumber: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFiltersGood[
                field
              ] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFiltersGood[field];
            }
          });
          this.dataTableParamsGood = this.pageFilter(this.dataTableParamsGood);
          //Su respectivo metodo de busqueda de datos
          this.getGoodData();
        }
      });
    //observador para el paginado
    this.dataTableParamsGood
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodData());
  }

  getGoodData() {
    this.loadingGood = true;
    this.columnFiltersGood['filter.goodId'] = '$not:' + this.noBien;
    this.columnFiltersGood['filter.fileNumber'] = '$eq:' + this.expedient;
    this.columnFiltersGood['sortBy'] = 'goodId:ASC';
    let params = {
      ...this.dataTableParamsGood.getValue(),
      ...this.columnFiltersGood,
    };
    this.appointmentsService.getGoodByParams(params).subscribe({
      next: (res: any) => {
        console.log('DATA Good', res);
        this.testDataGood = res.data;
        this.dataTableGood.load(this.testDataGood);
        this.totalGood = res.count;
        this.loadingGood = false;
      },
      error: error => {
        console.log(error);
        this.testDataGood = [];
        this.dataTableGood.load([]);
        this.totalGood = 0;
        this.loadingGood = false;
      },
    });
  }
}
