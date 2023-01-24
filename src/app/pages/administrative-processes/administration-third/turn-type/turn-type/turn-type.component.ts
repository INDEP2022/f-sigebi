import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { TURNTYPE_COLUMNS } from './turn-type-columns';

@Component({
  selector: 'app-turn-type',
  templateUrl: './turn-type.component.html',
  styles: [],
})
export class TurnTypeComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: TURNTYPE_COLUMNS,
    };
  }
  ngOnInit(): void {}
}
