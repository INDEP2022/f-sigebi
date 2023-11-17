import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { IGoodRejected } from '../../../models/good-rejected';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-rejected-goods',
  templateUrl: './rejected-goods.component.html',
  styleUrls: ['./rejected-goods.component.css'],
})
export class RejectedGoodsComponent
  extends BasePageTableNotServerPagination<IGoodRejected>
  implements OnInit
{
  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };
  }

  close() {
    this.modalRef.hide();
  }

  override getData() {
    if (this.data && this.data.length > 0) {
      this.totalItems = this.data.length;
      this.dataTemp = [...this.data];
      this.getPaginated(this.params.value);
      this.loading = false;
    } else {
      this.notGetData();
    }
  }
}
