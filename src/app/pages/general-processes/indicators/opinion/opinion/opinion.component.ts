import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  GENERAL_PROCESSES_OPINION_COLUNNS,
  GENERAL_PROCESSES_OPINION_DATA,
} from './opinion-columns';

@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styles: [],
})
export class OpinionComponent extends BasePage implements OnInit {
  data = GENERAL_PROCESSES_OPINION_DATA;
  constructor() {
    super();
    this.settings.columns = GENERAL_PROCESSES_OPINION_COLUNNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {}
}
