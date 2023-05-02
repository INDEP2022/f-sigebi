import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IStatusTransfer } from 'src/app/core/models/catalogs/status-transfer.model';
import { StatusTransferService } from 'src/app/core/services/catalogs/status-transfer.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StatusTransferFormComponent } from '../status-transfer-form/status-transfer-form.component';
import { STATUSTRANSFER_COLUMS } from './status-transfer-columns';

@Component({
  selector: 'app-status-transfer-list',
  templateUrl: './status-transfer-list.component.html',
  styles: [],
})
export class StatusTransferListComponent extends BasePage implements OnInit {
  paragraphs: IStatusTransfer[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private statusTransferService: StatusTransferService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATUSTRANSFER_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.statusTransferService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(statusTransfer?: IStatusTransfer) {
    let config: ModalOptions = {
      initialState: {
        statusTransfer,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(StatusTransferFormComponent, config);
  }

  delete(statusTransfer: IStatusTransfer) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
