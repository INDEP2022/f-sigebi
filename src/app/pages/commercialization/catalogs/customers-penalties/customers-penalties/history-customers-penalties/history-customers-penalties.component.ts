import { Component, OnInit } from '@angular/core';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import { COLUMNS2 } from '../columns';

@Component({
  selector: 'app-history-customers-penalties',
  templateUrl: './history-customers-penalties.component.html',
  styles: [],
})
export class HistoryCustomersPenaltiesComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        add: false,
        edit: true,
        delete: false,
      },
      columns: { ...COLUMNS2 },
    };
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
}
