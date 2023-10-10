import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DinamicTablesService } from 'src/app/core/services/catalogs/dinamic-tables.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { BILLING_FOLIO_COLUMNS } from './use-columns';

@Component({
  selector: 'use-modal',
  templateUrl: './use-modal.component.html',
  styles: [],
})
export class UseModalComponent extends BasePage implements OnInit {
  title: string = 'Catálogos SAT';
  filter = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  data: any[] = [];
  name: string;
  selectedRows: any = null;

  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalRef: BsModalRef,
    private dynamicService: DinamicTablesService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: BILLING_FOLIO_COLUMNS,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.dataFilter
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              clave: () => (searchFilter = SearchFilter.EQ),
              descripcion: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getDinamicTable();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => this.getDinamicTable(),
    });
  }

  getDinamicTable() {
    const params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.loading = true;
    this.dynamicService.getKeyTable(params, this.name).subscribe({
      next: resp => {
        this.loading = false;
        this.dataFilter.load(resp.data);
        this.dataFilter.refresh();
        this.totalItems = resp.count ?? 0;
      },
      error: err => {
        this.loading = false;
        this.dataFilter.load([]);
        this.dataFilter.refresh();
        this.totalItems = 0;
      },
    });
  }

  isSelect(data: any) {
    this.selectedRows = data;
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    if (this.selectedRows) {
      this.modalRef.hide();
      this.modalRef.content.callback(true, this.selectedRows);
    } else {
      this.alert('error', 'Error', 'Seleccione almenos un dato');
    }
  }
}
