import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { BREAKDOWN_COLUMNS } from './breakdown-columns';

@Component({
  selector: 'app-breakdown',
  templateUrl: './breakdown.component.html',
  styles: [],
})
export class BreakdownComponent extends BasePage implements OnInit {
  desglose: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor() {
    super();
    this.settings.columns = BREAKDOWN_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {}
}
