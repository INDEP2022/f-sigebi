import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DEREGISTRATION_COLUMNS } from './deregistration-columns';

@Component({
  selector: 'app-deregistration-of-goods',
  templateUrl: './deregistration-of-goods.component.html',
  styles: [],
})
export class DeregistrationOfGoodsComponent extends BasePage implements OnInit {
  form: FormGroup;
  bienes: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: DEREGISTRATION_COLUMNS,
    };
  }

  ngOnInit(): void {}
}
