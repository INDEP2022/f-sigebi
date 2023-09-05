import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared';
import {
  EXPENSES_COLUMNS_MONITORING,
  INCONSINTENCIES_COLUMNS_MONITORING,
  INCONSINTENCIES_SIRSAE_COLUMNS_MONITORING,
} from '../monitoring-cps-sps-columns.ts/columns';

@Component({
  selector: 'app-monitoring-cps-sps-tabs',
  templateUrl: './monitoring-cps-sps-tabs.component.html',
  styles: [],
})
export class MonitoringCpsSpsTabsComponent extends BasePage implements OnInit {
  //

  //Array Data Table
  data: any;
  dataOne: any;
  dataTwo: any;

  //Columns
  settingsOne: any;
  settingsTwo: any;

  //

  constructor() {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...INCONSINTENCIES_COLUMNS_MONITORING },
    };

    this.settingsOne = {
      ...this.settings,
      actions: false,
      columns: { ...INCONSINTENCIES_SIRSAE_COLUMNS_MONITORING },
    };

    this.settingsTwo = {
      ...this.settings,
      actions: false,
      columns: { ...EXPENSES_COLUMNS_MONITORING },
    };
  }

  ngOnInit(): void {}

  //

  //
}
