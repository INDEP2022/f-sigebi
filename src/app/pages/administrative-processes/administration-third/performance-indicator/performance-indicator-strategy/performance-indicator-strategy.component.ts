import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { PERFORMANCEINDICATORSTRATEGY_COLUMNS } from './performance-indicator-strategy-columns';

@Component({
  selector: 'app-performance-indicator-strategy',
  templateUrl: './performance-indicator-strategy.component.html',
  styles: [],
})
export class PerformanceIndicatorStrategyComponent
  extends BasePage
  implements OnInit
{
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PERFORMANCEINDICATORSTRATEGY_COLUMNS,
    };
  }

  ngOnInit(): void {}
  close() {
    this.modalRef.hide();
  }
}
