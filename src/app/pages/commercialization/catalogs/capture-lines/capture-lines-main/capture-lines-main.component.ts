import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ICaptureLinesMain } from 'src/app/core/models/catalogs/capture-lines-main.model';
import { CapturelineService } from 'src/app/core/services/ms-capture-line/captureline.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EVENT_COLUMNS } from './capture-lines-columns';

@Component({
  selector: 'app-capture-lines-main',
  templateUrl: './capture-lines-main.component.html',
  styles: [],
})
export class CaptureLinesMainComponent extends BasePage implements OnInit {
  captureLinesMain: ICaptureLinesMain[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  capture: ICaptureLinesMain;

  constructor(private capturelineService: CapturelineService) {
    super();
    this.settings.columns = EVENT_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions = false;
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
              case 'eventId':
                searchFilter = SearchFilter.EQ;
                break;
              // case 'CLAVE-DE-EVENTOS':
              //   searchFilter = SearchFilter.ILIKE;
              //   break;
              case 'customerBmx':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'userCreated':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'creationDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
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
          this.getDeductives();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  formatDate(dateString: string): string {
    if (dateString === '') {
      return '';
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  rowsSelected(event: any) {
    this.capture = event.data;
  }

  getDeductives() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.capturelineService.getAll(params).subscribe({
      next: response => {
        this.captureLinesMain = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count || 0;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
}
