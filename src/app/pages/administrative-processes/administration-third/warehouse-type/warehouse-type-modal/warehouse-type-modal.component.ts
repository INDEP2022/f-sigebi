import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import {
  WAREHOUSESUBSUBSUBTYPE_COLUMNS,
  WAREHOUSESUBSUBTYPE_COLUMNS,
  WAREHOUSESUBTYPE_COLUMNS,
  WAREHOUSETYPE_COLUMNS,
} from './warehouse-type-columns';

@Component({
  selector: 'app-warehouse-type-modal',
  templateUrl: './warehouse-type-modal.component.html',
  styles: [],
})
export class WarehouseTypeModalComponent extends BasePage implements OnInit {
  settings2 = { ...this.settings, actions: false };
  settings3 = { ...this.settings, actions: false };
  settings4 = { ...this.settings, actions: false };
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...WAREHOUSETYPE_COLUMNS },
    };
    this.settings2.columns = WAREHOUSESUBTYPE_COLUMNS;
    this.settings3.columns = WAREHOUSESUBSUBTYPE_COLUMNS;
    this.settings4.columns = WAREHOUSESUBSUBSUBTYPE_COLUMNS;
  }

  ngOnInit(): void {}
  close() {
    this.modalRef.hide();
  }
}
