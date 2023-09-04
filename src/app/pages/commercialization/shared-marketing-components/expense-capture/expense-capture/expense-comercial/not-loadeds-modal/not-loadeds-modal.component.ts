import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';

@Component({
  selector: 'app-not-loadeds-modal',
  templateUrl: './not-loadeds-modal.component.html',
  styleUrls: ['./not-loadeds-modal.component.css'],
})
export class NotLoadedsModalComponent
  extends BasePageTableNotServerPagination
  implements OnInit
{
  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: null,
      columns: {
        goodNumber: {
          title: 'Número de Bien',
          type: 'string',
          sort: false,
        },
      },
    };
  }

  close() {
    this.modalRef.hide();
  }
}
