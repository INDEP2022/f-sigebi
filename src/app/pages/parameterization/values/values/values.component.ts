import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITablesType } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { ITvaltable1 } from 'src/app/core/models/catalogs/tvaltable-model';
import { DinamicTablesService } from 'src/app/core/services/catalogs/dinamic-tables.service';
import { TvalTable1Service } from 'src/app/core/services/catalogs/tval-table1.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ValuesModalComponent } from '../values-modal/values-modal.component';
import { TTABLAS_COLUMNS, TVALTABLA1_COLUMNS } from './values-columns';

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styles: [],
})
export class ValuesComponent extends BasePage implements OnInit {
  valuesList: ITablesType[] = [];
  tvalTableList: ITvaltable1[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  data1: LocalDataSource = new LocalDataSource();
  columnFilters1: any = [];
  values: ITablesType;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  loading2: boolean = false;
  settings2 = { ...this.settings };
  constructor(
    private modalService: BsModalService,
    private valuesService: DinamicTablesService,
    private tvalTableService: TvalTable1Service
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: TTABLAS_COLUMNS,
    };
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };
    this.settings2.columns = TVALTABLA1_COLUMNS;
    this.settings2.actions.add = false;
    this.settings2.actions.delet = false;
    this.settings2 = {
      ...this.settings2,
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
              case 'cdtabla':
                searchFilter = SearchFilter.EQ;
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
          //this.resetTable2();
          this.getValuesAll();
        }
      });
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      //this.resetTable2();
      this.getValuesAll();
    });
  }

  resetTable2() {
    this.params2 = new BehaviorSubject<ListParams>(new ListParams());

    this.tvalTableList = [];
    this.data1.load(this.tvalTableList);
    this.data1.refresh();
  }

  getValuesAll() {
    this.loading = true;
    console.log('params:');
    console.log('params111:', this.params);
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.valuesService.getById5(1, params).subscribe({
      next: response => {
        console.log(response);
        this.valuesList = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  rowsSelected(event: any) {
    this.totalItems2 = 0;
    this.tvalTableList = [];
    this.values = event.data;
    this.resetTable2();

    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'otKey':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'value':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                console.log(field);
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
              console.log(this.columnFilters1[field]);
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params2 = this.pageFilter(this.params2);
          this.gettvalTable(this.values);
        }
      });
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.gettvalTable(this.values));
  }

  gettvalTable(values: ITablesType) {
    this.loading2 = true;
    // this.params2 = new BehaviorSubject<ListParams>(new ListParams());
    let params2 = {
      ...this.params2.getValue(),
      ...this.columnFilters1,
    };
    console.log('params:', params2);
    console.log('params2:', this.params2);

    this.tvalTableService.getById4(values.cdtabla, params2).subscribe({
      next: response => {
        console.log(response);
        this.tvalTableList = response.data;
        this.data1.load(response.data);
        this.data1.refresh();
        this.totalItems2 = response.count;
        this.loading2 = false;
      },
      error: error => (this.loading2 = false),
    });
  }

  openForm(tvalTable?: ITvaltable1) {
    if (this.values) {
      console.log(tvalTable);
      let value = this.values;
      let config: ModalOptions = {
        initialState: {
          tvalTable,
          value,
          callback: (next: boolean) => {
            if (next) {
              this.totalItems2 = 0;
              this.tvalTableList = [];
              this.getValuesAll();
              this.gettvalTable(this.values);
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ValuesModalComponent, config);
    } else {
      this.onLoadToast('warning', 'Se debe seleccionar una Tabla logica', '');
    }
  }
}
