import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IParametersIndicators } from 'src/app/core/models/catalogs/parameters-indicators.model';
import { ParameterIndicatorsService } from 'src/app/core/services/catalogs/parameters-indicators.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { INDICATOR_DEADLINES_PARAMETERS_COLUMNS } from './inidicator-deadlines-parameters-columns';

@Component({
  selector: 'app-indicator-deadlines-parameters',
  templateUrl: './indicator-deadlines-parameters.component.html',
  styles: [],
})
export class IndicatorDeadlinesParametersComponent
  extends BasePage
  implements OnInit
{
  indicatorDeadlinesParameters: IParametersIndicators[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  rowSelected: boolean = false;
  selectedRow: any = null;
  data: LocalDataSource = new LocalDataSource();
  @Output() refresh = new EventEmitter<true>();
  columnFilters: any = [];
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private parameterIndicatorsService: ParameterIndicatorsService
  ) {
    super();
    this.settings.columns = INDICATOR_DEADLINES_PARAMETERS_COLUMNS;
    this.settings = {
      ...this.settings,
      actions: false,
      selectedRowIndex: -1,
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
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
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
          this.getAllIndicators();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getAllIndicators());
  }
  getAllIndicators() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.parameterIndicatorsService.getAll(params).subscribe({
      next: response => {
        this.indicatorDeadlinesParameters = response.data;
        this.data.load(response.data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  close() {
    this.modalRef.hide();
  }
  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }
  confirm() {
    if (!this.rowSelected) return;
    this.refresh.emit(this.selectedRow);
    this.modalRef.hide();
  }
}
