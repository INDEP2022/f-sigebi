import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SERVICEORDERSFORMATHISTORIC_COLUMNS } from './service-orders-format-historic-columns';

@Component({
  selector: 'app-service-orders-format-historic',
  templateUrl: './service-orders-format-historic.component.html',
  styles: [],
})
export class ServiceOrdersFormatHistoricComponent
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
      columns: SERVICEORDERSFORMATHISTORIC_COLUMNS,
    };
  }

  ngOnInit(): void {}
  close() {
    this.modalRef.hide();
  }
}
