import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-aprobate-service-order-form',
  templateUrl: './aprobate-service-order-form.component.html',
  styles: [],
})
export class AprobateServiceOrderFormComponent
  extends BasePage
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
