import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { BasePage } from 'src/app/core/shared/base-page';
import { PURGING_RECORDS_COLUMNS } from './purging-records-columns';
@Component({
  selector: 'app-purging-records-table',
  templateUrl: './purging-records-table.component.html',
  styles: [],
})
export class PurgingRecordsTableComponent extends BasePage implements OnInit {
  @Input() data: IGood[] = [];
  @Input() params: BehaviorSubject<ListParams>;
  @Input() totalItems = 0;

  constructor() {
    super();
    this.settings.columns = PURGING_RECORDS_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {}
}
