import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { PREPARE_EVENT_EVENTS_LIST_COLUMNS } from '../../utils/table-columns/events-list-columns';

@Component({
  selector: 'commer-events-list',
  templateUrl: './commer-events-list.component.html',
  styles: [],
})
export class CommerEventsListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject(new FilterParams());
  totalItems = 0;
  events: any[] = [];
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PREPARE_EVENT_EVENTS_LIST_COLUMNS,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {}
}
