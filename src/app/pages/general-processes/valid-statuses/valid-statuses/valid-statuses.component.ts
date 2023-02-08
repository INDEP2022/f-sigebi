import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { VALID_STATUSES_COLUMNS } from './valid-statuses-columns';

@Component({
  selector: 'app-valid-statuses',
  templateUrl: './valid-statuses.component.html',
  styles: [],
})
export class ValidStatusesComponent extends BasePage implements OnInit {
  constructor() {
    super();
    this.settings.actions = false;
    this.settings.columns = VALID_STATUSES_COLUMNS;
  }

  ngOnInit(): void {}
}
