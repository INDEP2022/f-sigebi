import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  numberTask: number = 0;
  constructor(private activatedRoute: ActivatedRoute) {
    super();
    this.numberTask = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    console.log('numero de tarea', this.numberTask);
  }
}
