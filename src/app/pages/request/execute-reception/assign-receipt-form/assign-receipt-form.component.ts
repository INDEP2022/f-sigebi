import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { RECEIPT_COLUMNS } from '../execute-reception-form/columns/minute-columns';

@Component({
  selector: 'app-assign-receipt-form',
  templateUrl: './assign-receipt-form.component.html',
  styles: [],
})
export class AssignReceiptFormComponent extends BasePage implements OnInit {
  settingsReceipt = { ...TABLE_SETTINGS, actions: false };
  receipts: any[] = [];
  constructor(private modalRef: BsModalRef) {
    super();
    this.settingsReceipt.columns = RECEIPT_COLUMNS;
  }

  ngOnInit(): void {}

  confirm() {}

  close() {
    this.modalRef.hide();
  }

  createReceipt() {}
}
