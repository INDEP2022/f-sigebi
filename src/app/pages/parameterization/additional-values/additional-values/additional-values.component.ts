import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITablesType } from 'src/app/core/models/catalogs/dinamic-tables.model';
import { ITvalTable5 } from 'src/app/core/models/catalogs/tval-Table5.model';
import { DinamicTablesService } from 'src/app/core/services/catalogs/dinamic-tables.service';
import { TvalTable5Service } from 'src/app/core/services/catalogs/tval-table5.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AdditionalValuesModalComponent } from '../additional-values-modal/additional-values-modal.component';
import {
  ADDITIONALVALUES_COLUMNS,
  TVALTABLA5_COLUMNS,
} from './additional-values-columns';

@Component({
  selector: 'app-additional-values',
  templateUrl: './additional-values.component.html',
  styles: [],
})
export class AdditionalValuesComponent extends BasePage implements OnInit {
  valuesList: ITablesType[] = [];
  tvalTableList: ITvalTable5[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  data1: LocalDataSource = new LocalDataSource();
  columnFilters1: any = [];
  values: ITablesType;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  settings2 = { ...this.settings };
  valorAditional: any;
  rowSelected: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private valuesService: DinamicTablesService,
    private tvalTableService: TvalTable5Service
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: { ...ADDITIONALVALUES_COLUMNS },
    };

    /*this.settings = {
      ...this.settings,
      actions: false,
      columns: ADDITIONALVALUES_COLUMNS,
    };
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
    };*/

    this.settings2 = {
      ...this.settings2,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...TVALTABLA5_COLUMNS },
    };

    /*this.settings2.columns = TVALTABLA5_COLUMNS;
    this.settings2.actions.add = false;
    this.settings2 = {
      ...this.settings2,
      hideSubHeader: false,
    };*/
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
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'cdtabla':
                searchFilter = SearchFilter.ILIKE;
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
          this.getValuesAll();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());
  }
  getValuesAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.valuesService.getById5(5, params).subscribe({
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
    this.rowSelected = true;
    this.valorAditional = event.data;
    this.totalItems2 = 0;
    this.tvalTableList = [];
    this.values = event.data;
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'otKey1':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          console.log('this.params ad:', this.params);

          //this.params = this.pageFilter(this.params);
          this.params2 = this.pageFilter(this.params2);

          this.gettvalTable(this.values);
        }
      });
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.gettvalTable(this.values));
  }
  gettvalTable(values: ITablesType) {
    this.loading = true;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters1,
    };
    this.tvalTableService.getById4(values.nmtabla, params).subscribe({
      next: response => {
        console.log(response);
        this.tvalTableList = response.data;
        this.data1.load(response.data);
        this.data1.refresh();
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  gettvalTable2(values: ITablesType) {
    this.loading = true;
    let params2 = {
      ...this.params2.getValue(),
      ...this.columnFilters,
    };
    this.tvalTableService.getById4(values.nmtabla, params2).subscribe({
      next: response => {
        console.log(response);
        this.tvalTableList = response.data;
        this.data1.load(this.tvalTableList);
        this.data1.refresh();
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  openForm(tvalTable?: ITvalTable5) {
    console.log(tvalTable);
    console.log('valorAditional', this.valorAditional);

    if (this.valorAditional) {
      let value = this.values;

      console.log('value', value);

      let config: ModalOptions = {
        initialState: {
          tvalTable,
          value,
          callback: (next: boolean) => {
            if (next) {
              this.totalItems2 = 0;
              this.tvalTableList = [];
              this.getValuesAll();
              this.gettvalTable2(this.values);
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(AdditionalValuesModalComponent, config);
    } else {
      this.alert(
        'warning',
        'Advertencia',
        'Se debe seleccionar un valor adicional'
      );
    }
  }
}
