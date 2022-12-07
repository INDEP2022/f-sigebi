import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { INDICATORS_HISTORY_COLUMNS } from './indicators-history-columns';

@Component({
  selector: 'app-gp-i-indicators-history',
  templateUrl: './gp-i-indicators-history.component.html',
  styles: [],
})
export class GpIIndicatorsHistoryComponent extends BasePage implements OnInit {
  data = [{}];

  constructor() {
    super();
    this.settings.actions = false;
    this.settings.columns = INDICATORS_HISTORY_COLUMNS;
  }

  ngOnInit(): void {}
}
