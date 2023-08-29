import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerInconsistenciesService } from 'src/app/core/services/ms-invoice/ms-comer-inconsistencies.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ERRORS_NULL_DATA_COLUMNS } from './errors-null-data-columns';

@Component({
  selector: 'app-errors-null-data',
  templateUrl: './errors-null-data.component.html',
  styles: [],
})
export class ErrorsNullDataComponent extends BasePage implements OnInit {
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  val: number;

  @Input() set eventID(val: number) {
    if (val) {
      this.paramsList.getValue()['eventId'] = val;
      this.getAllInconsitencies();
    }
  }

  get eventID() {
    return this.val;
  }

  constructor(
    private comerInconsistenciesService: ComerInconsistenciesService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...ERRORS_NULL_DATA_COLUMNS },
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
              eventId: () => (searchFilter = SearchFilter.EQ),
              billId: () => (searchFilter = SearchFilter.EQ),
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              downloadMistake: () => (searchFilter = SearchFilter.ILIKE),
              batchPublic: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getAllInconsitencies();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems > 0) this.getAllInconsitencies();
    });
  }

  getAllInconsitencies() {
    const params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };

    this.loading = true;
    this.comerInconsistenciesService.getAll(params).subscribe({
      next: resp => {
        this.loading = false;
        this.totalItems = resp.count;
        this.dataFilter.load(resp.data);
        this.dataFilter.refresh();
      },
      error: () => {
        this.loading = false;
        this.totalItems = 0;
        this.dataFilter.load([]);
        this.dataFilter.refresh();
      },
    });
  }
}
