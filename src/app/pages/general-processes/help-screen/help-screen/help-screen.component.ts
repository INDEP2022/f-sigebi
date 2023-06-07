import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { takeUntil } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ScreenHelpService } from 'src/app/core/services/ms-business-rule/screen-help.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { HELP_SCREEN_COLUMNS } from './help-screen-columns';

@Component({
  selector: 'app-help-screen',
  templateUrl: './help-screen.component.html',
  styles: [],
})
export class HelpScreenComponent extends BasePage implements OnInit {
  //Filtro en las tablas
  business: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private screenHelpService: ScreenHelpService) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        delete: false,
        add: false,
        position: 'right',
      },
      columns: { ...HELP_SCREEN_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.business
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getBusiness();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getBusiness());
  }

  getBusiness() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.screenHelpService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.totalItems = resp.count || 0;
        this.business.load(resp.data);
        this.business.refresh();
        this.loading = false;
        //resp.data;
      },
      error: error => {
        this.loading = false;
      },
    });
  }
}
