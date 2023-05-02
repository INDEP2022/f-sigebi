import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  GENERAL_RECEPTION_STRATEGIES_COLUNNS,
  GENERAL_RECEPTION_STRETEGIES_DATA,
} from './reception-strategies-columns';

@Component({
  selector: 'app-reception-strategies',
  templateUrl: './reception-strategies.component.html',
  styles: [],
})
export class ReceptionStrategiesComponent extends BasePage implements OnInit {
  data: any[] = GENERAL_RECEPTION_STRETEGIES_DATA;

  constructor() {
    super();
    this.settings.actions = false;
    this.settings.columns = GENERAL_RECEPTION_STRATEGIES_COLUNNS;
  }

  ngOnInit(): void {}
}
