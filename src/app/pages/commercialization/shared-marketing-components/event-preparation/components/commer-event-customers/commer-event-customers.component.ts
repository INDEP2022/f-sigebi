import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { PREPARE_EVENT_CUSTOMER_LIST_COLUMNS } from '../../utils/table-columns/event-customer-list-columns';

@Component({
  selector: 'commer-event-customers',
  templateUrl: './commer-event-customers.component.html',
  styles: [],
})
export class CommerEventCustomersComponent extends BasePage implements OnInit {
  params = new BehaviorSubject(new FilterParams());
  totalItems = 0;
  events: any[] = [];
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PREPARE_EVENT_CUSTOMER_LIST_COLUMNS,
    };
  }
  ngOnInit() {}
}
