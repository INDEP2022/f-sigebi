import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IStatusProcess } from 'src/app/core/models/catalogs/status-process.model';
import { StatusProcessService } from 'src/app/core/services/catalogs/status-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StatusProcessFormComponent } from '../status-process-form/status-process-form.component';
import { STATUSPROCESS_COLUMS } from './status-process-columns';

@Component({
  selector: 'app-status-process-list',
  templateUrl: './status-process-list.component.html',
  styles: [],
})
export class StatusProcessListComponent extends BasePage implements OnInit {
  paragraphs: IStatusProcess[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private statusProcessService: StatusProcessService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATUSPROCESS_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.statusProcessService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(statusProcess?: IStatusProcess) {
    let config: ModalOptions = {
      initialState: {
        statusProcess,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(StatusProcessFormComponent, config);
  }

  delete(statusProcess: IStatusProcess) {
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
