import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { WarehouseConfirmComponent } from '../warehouse-confirm/warehouse-confirm.component';

@Component({
  selector: 'app-warehouse-show',
  templateUrl: './warehouse-show.component.html',
  styles: [],
})
export class WarehouseShowComponent extends BasePage implements OnInit {
  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {}

  confirm() {
    const confirmWarehouse = this.modalService.show(WarehouseConfirmComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  close() {
    this.modalService.hide();
  }
}
