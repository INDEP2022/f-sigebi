import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IStatusHistory } from 'src/app/core/models/ms-thirdparty-admon/third-party-admon.model';
import { StatusHistoryService } from 'src/app/core/services/ms-thirdparty-admon/thirdparty-admon.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_STATUS_HISTORY } from '../../delivery-schedule/schedule-of-events/generate-estrategy/columns_status-history';

@Component({
  selector: 'app-detail-delegations',
  templateUrl: './detail-delegations.component.html',
  styles: [],
})
export class DetailDelegationsComponent extends BasePage implements OnInit {
  statusHistory: IStatusHistory[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  title?: string = '';
  formatNumber: number = 0;

  constructor(
    public bsModalRef: BsModalRef,
    private statusHistoryService: StatusHistoryService
  ) {
    super();
    this.settings.columns = COLUMNS_STATUS_HISTORY;
    this.settings.actions.delete = false;
    this.settings.actions.edit = false;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    const caseType = 'status-history';
    const caseType2 = 'delegations';

    if (caseType === 'status-history') {
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
              filter.field == 'changeDate' ||
              filter.field == 'justification' ||
              filter.field == 'status' ||
              filter.field == 'usrRegister'
                ? (searchFilter = SearchFilter.EQ)
                : (searchFilter = SearchFilter.ILIKE);
              if (filter.search !== '') {
                this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              } else {
                delete this.columnFilters[field];
              }
            });
            this.setData(caseType);
          }
        });
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.setData(caseType));
    } else if (caseType2 === 'delegations') {
      // console.log('caseType2');
    }
  }

  search(event: any) {
    this.formatNumber = Number(event);
    this.setData('status-history');
  }

  setData(caseType: string) {
    switch (caseType) {
      case 'delegations':
        // this.settings.columns = DELEGATIONS_COLUMNS;
        // this.data = EXAMPLE_DATA1;
        break;

      case 'status-history':
        this.loading = true;
        this.statusHistoryService.getAllSearch(this.formatNumber).subscribe({
          next: response => {
            this.statusHistory = response.data.map(
              (item: { usrRegister: { id: any } }) => ({
                ...item,
                usrRegister: item.usrRegister?.id || '',
              })
            );
            this.data.load(this.statusHistory);
            this.data.refresh();
            this.totalItems = response.count;
            this.loading = false;
          },
          error: error => (this.loading = false),
        });
        COLUMNS_STATUS_HISTORY['usrRegister'] = {
          title: 'Usuario',
          type: 'string',
          sort: false,
        };
        break;

      default:
        break;
    }
  }

  selected(e: any) {
    // console.log(e);
  }
}

const EXAMPLE_DATA1 = [
  {
    id: '5',
    description: 'RPA',
  },
  {
    id: '5',
    description: 'RPA',
  },
  {
    id: '5',
    description: 'RPA',
  },
  {
    id: '5',
    description: 'RPA',
  },
];

const EXAMPLE_DATA2 = [
  {
    changeDate: '20/10/2022',
    justification: 'abc...',
    status: '....',
    user: 'TLPGOR...',
  },
];

/*


import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

import { COLUMNS_STATUS_HISTORY } from '../../delivery-schedule/schedule-of-events/generate-estrategy/columns_status-history';
import { DELEGATIONS_COLUMNS } from '../../third-party-possession-acts/delegations-columns';
@Component({
  selector: 'app-detail-delegations',
  templateUrl: './detail-delegations.component.html',
  styles: [],
})
export class DetailDelegationsComponent extends BasePage implements OnInit {
  title?: string = '';
  data: any[] = [];
  optionColumn?: string = '';

  constructor(public bsModalRef: BsModalRef) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.setData(this.optionColumn);
  }

  ngOnInit(): void {
    this.setData(this.optionColumn);
  }

  selected(e: any) {
    console.log(e);
  }

  setData(option: string) {
    console.log(option);
    switch (option) {
      case 'delegations':
        this.settings.columns = DELEGATIONS_COLUMNS;
        this.data = EXAMPLE_DATA1;
        break;
      case 'status-history':
        this.settings.columns = COLUMNS_STATUS_HISTORY;
        this.data = EXAMPLE_DATA2;
        break;
    }
  }
}

const EXAMPLE_DATA1 = [
  {
    id: '5',
    description: 'RPA',
  },
  {
    id: '5',
    description: 'RPA',
  },
  {
    id: '5',
    description: 'RPA',
  },
  {
    id: '5',
    description: 'RPA',
  },
];

const EXAMPLE_DATA2 = [
  {
    changeDate: '20/10/2022',
    justification: 'abc...',
    status: '....',
    user: 'TLPGOR...',
  },
];


 */
