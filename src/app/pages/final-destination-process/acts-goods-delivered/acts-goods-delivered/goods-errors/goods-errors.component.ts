import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOODS_ERRORS } from '../columns';

@Component({
  selector: 'app-goods-errors',
  templateUrl: './goods-errors.component.html',
  styles: [],
})
export class GoodsErrorsComponent extends BasePage implements OnInit {
  totalItems2: number = 0;
  selectedRow: any | null = null;
  data: LocalDataSource = new LocalDataSource();
  dataErrors: any[] = [];
  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...GOODS_ERRORS,
      },
    };
  }
  ngOnInit(): void {
    this.data.load(this.dataErrors);
    this.data.refresh();
    this.loading = false;
  }

  return() {
    this.loading = false;
    this.modalRef.hide();
  }
}
