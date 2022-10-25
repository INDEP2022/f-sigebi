import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { PERCENTAGE_COLUMNS } from './percentage-columns';

@Component({
  selector: 'app-percentages-surveillance',
  templateUrl: './percentages-surveillance.component.html',
  styles: [],
})
export class PercentagesSurveillanceComponent
  extends BasePage
  implements OnInit
{
  percentages: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor() {
    super();
    this.settings.columns = PERCENTAGE_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {}
}
