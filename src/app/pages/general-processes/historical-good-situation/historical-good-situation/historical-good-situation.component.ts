import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  HISTORICAL_GOOD_SITUATION_COLUMNS,
  HISTORICAL_GOOD_SITUATION_EXAMPLE_DATA,
} from './historical-good-situation-columns';

@Component({
  selector: 'app-historical-good-situation',
  templateUrl: './historical-good-situation.component.html',
  styles: [],
})
export class HistoricalGoodSituationComponent
  extends BasePage
  implements OnInit
{
  form = this.fb.group({
    type: [null, [Validators.required]],
  });
  data = HISTORICAL_GOOD_SITUATION_EXAMPLE_DATA;

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = HISTORICAL_GOOD_SITUATION_COLUMNS;
    this.settings.actions = false;
  }

  ngOnInit(): void {}
}
