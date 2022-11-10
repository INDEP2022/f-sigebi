import { Component, Input, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { PURGING_RECORDS_COLUMNS } from './purging-records-columns';

@Component({
  selector: 'app-gp-purging-records-table',
  templateUrl: './gp-purging-records-table.component.html',
  styles: [],
})
export class GpPurgingRecordsTableComponent extends BasePage implements OnInit {
  @Input() data: any[] = [];

  constructor() {
    super();
    this.settings.columns = PURGING_RECORDS_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {}
}
