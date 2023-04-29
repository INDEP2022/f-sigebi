import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { RECEIPT_COLUMNS } from '../../programming-request-components/execute-reception/execute-reception-form/columns/minute-columns';
import { GenerateReceiptFormComponent } from '../generate-receipt-form/generate-receipt-form.component';

@Component({
  selector: 'app-assign-receipt-form',
  templateUrl: './assign-receipt-form.component.html',
  styles: [],
})
export class AssignReceiptFormComponent extends BasePage implements OnInit {
  settingsReceipt = { ...TABLE_SETTINGS, actions: false };
  receipts: any[] = [];
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService
  ) {
    super();
    this.settingsReceipt.columns = RECEIPT_COLUMNS;
  }

  ngOnInit(): void {}

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea guardar los recibos?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Recibos guardados correctamente', '');

        this.close();
      }
    });
  }

  close() {
    this.modalRef.hide();
  }

  createReceipt() {
    const generateReceipt = this.modalService.show(
      GenerateReceiptFormComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }
}
