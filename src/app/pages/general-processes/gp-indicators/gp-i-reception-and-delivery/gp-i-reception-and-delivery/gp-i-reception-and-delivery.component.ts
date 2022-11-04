import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  GENERAL_PROCESSES_RECEPTION_AND_DELIVERY_COLUNNS,
  GENERAL_PROCESSES_RECEPTION_AND_DELIVERY_DATA,
} from './reception-and-delivery-columns';

@Component({
  selector: 'app-gp-i-reception-and-delivery',
  templateUrl: './gp-i-reception-and-delivery.component.html',
  styles: [],
})
export class GpIReceptionAndDeliveryComponent
  extends BasePage
  implements OnInit
{
  data = GENERAL_PROCESSES_RECEPTION_AND_DELIVERY_DATA;
  constructor() {
    super();
    this.settings.actions = false;
    this.settings.columns = GENERAL_PROCESSES_RECEPTION_AND_DELIVERY_COLUNNS;
  }

  ngOnInit(): void {}
}
