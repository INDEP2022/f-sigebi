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
