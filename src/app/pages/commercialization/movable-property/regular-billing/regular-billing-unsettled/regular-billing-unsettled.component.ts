import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { REGULAR_BILLING_UNSETTLED_COLUMNS } from './regular-billing-unsettled-columns';

@Component({
  selector: 'app-regular-billing-unsettled',
  templateUrl: './regular-billing-unsettled.component.html',
  styles: [],
})
export class RegularBillingUnsettledComponent
  extends BasePage
  implements OnInit
{
  dataFilter: LocalDataSource = new LocalDataSource();
  @Input() form: FormGroup;
  totalItems = 0;
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any[] = [];

  constructor(private prepareEventService: ComerEventService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...REGULAR_BILLING_UNSETTLED_COLUMNS },
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
              lote_publico: () => (searchFilter = SearchFilter.EQ),
              leyenda: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getAll();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems > 0) {
        this.getAll();
      }
    });
  }

  search() {
    this.loading = true;
    this.paramsList.getValue().page = 1;
    this.dataFilter.load([]);
    this.dataFilter.refresh();
    this.totalItems = 0;
    if (!this.form)
      return (
        (this.loading = false),
        this.alert('warning', 'Debe especificar un evento', '')
      );
    const { event, idAllotment } = this.form.value;
    if (!event && !idAllotment)
      return (
        (this.loading = false),
        this.alert('warning', 'Debe especificar un evento', '')
      );
    this.getAll();
  }
  getAll() {
    this.loading = true;
    const { event, idAllotment } = this.form.value;
    if (!event && !idAllotment) {
      this.paramsList.getValue().page = 1;
      this.dataFilter.load([]);
      this.dataFilter.refresh();
      this.totalItems = 0;
      return (
        (this.loading = false),
        this.alert('warning', 'Debe especificar un evento', '')
      );
    }

    let params = {
      ...this.paramsList.getValue(),
    };
    this.prepareEventService
      .getNotification_(event, idAllotment, params)
      .subscribe({
        next: resp => {
          this.loading = false;
          this.dataFilter.load(resp.data);
          this.dataFilter.refresh();
          this.totalItems = resp.count;
        },
        error: error => {
          this.loading = false;
          this.dataFilter.load([]);
          this.dataFilter.refresh();
          this.totalItems = 0;
          this.alert('warning', error.error.message, '');
        },
      });
  }
}
