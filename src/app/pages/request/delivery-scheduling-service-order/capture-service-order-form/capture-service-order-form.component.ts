import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-capture-service-order-form',
  templateUrl: './capture-service-order-form.component.html',
  styles: [],
})
export class CaptureServiceOrderFormComponent
  extends BasePage
  implements OnInit
{
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
