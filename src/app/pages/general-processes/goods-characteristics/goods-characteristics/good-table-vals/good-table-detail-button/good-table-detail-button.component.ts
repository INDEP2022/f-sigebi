import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_GOOD } from './columns-good';

@Component({
  selector: 'app-good-table-detail-button',
  templateUrl: './good-table-detail-button.component.html',
  styleUrls: ['./good-table-detail-button.component.scss'],
})
export class GoodTableDetailButtonComponent extends BasePage implements OnInit {
  data: any;
  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNS_GOOD },
      hideSubHeader: true,
    };
  }

  ngOnInit() {}

  openForm(event?: any) {}

  showDeleteAlert(event?: any) {}

  confirm() {
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
