import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  GENERAL_PROCESSES_RECEPTION_AND_DELIVERY_COLUNNS,
  GENERAL_PROCESSES_RECEPTION_AND_DELIVERY_DATA,
} from './reception-and-delivery-columns';

@Component({
  selector: 'app-reception-and-delivery',
  templateUrl: './reception-and-delivery.component.html',
  styles: [],
})
export class ReceptionAndDeliveryComponent extends BasePage implements OnInit {
  data = GENERAL_PROCESSES_RECEPTION_AND_DELIVERY_DATA;
  constructor() {
    super();
    this.settings.actions = false;
    this.settings.columns = GENERAL_PROCESSES_RECEPTION_AND_DELIVERY_COLUNNS;
  }

  ngOnInit(): void {}
}
