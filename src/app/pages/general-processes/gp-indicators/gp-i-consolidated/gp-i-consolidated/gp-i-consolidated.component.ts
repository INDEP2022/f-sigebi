import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { CONSOLIDATED_COLUMNS } from './consolidated-columns';

@Component({
  selector: 'app-gp-i-consolidated',
  templateUrl: './gp-i-consolidated.component.html',
  styles: [],
})
export class GpIConsolidatedComponent extends BasePage implements OnInit {
  data: any[] = [];
  constructor() {
    super();
    this.settings.actions = false;
    this.settings.columns = CONSOLIDATED_COLUMNS;
  }

  ngOnInit(): void {}
}
