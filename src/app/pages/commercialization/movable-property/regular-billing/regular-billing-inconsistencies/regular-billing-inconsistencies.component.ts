import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerFactInconsistenciesService } from 'src/app/core/services/ms-invoice/ms-comer-fact-inconsistencies.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { REGULAR_BILLING_INCONSISTENCIES_COLUMNS } from './regular-billing-inconsistencies-columns';

@Component({
  selector: 'app-regular-billing-inconsistencies',
  templateUrl: './regular-billing-inconsistencies.component.html',
  styles: [],
})
export class RegularBillingInconsistenciesComponent
  extends BasePage
  implements OnInit
{
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private comerFactIncService: ComerFactInconsistenciesService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...REGULAR_BILLING_INCONSISTENCIES_COLUMNS },
      hideSubHeader: false,
    };
    this.paramsList.getValue()['sortBy'] = 'batchPublic:DESC';
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
              batchPublic: () => (searchFilter = SearchFilter.EQ),
              notGood: () => (searchFilter = SearchFilter.EQ),
              descripcion: () => (searchFilter = SearchFilter.ILIKE),
              exhibit: () => (searchFilter = SearchFilter.ILIKE),
              descExhibit: () => (searchFilter = SearchFilter.ILIKE),
              Type: () => (searchFilter = SearchFilter.EQ),
              notSsubtype: () => (searchFilter = SearchFilter.EQ),
              desctipo: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getAllComerFact();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getAllComerFact();
    });
  }

  getAllComerFact() {
    this.loading = true;
    const params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };

    this.comerFactIncService.getAll(params).subscribe({
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
