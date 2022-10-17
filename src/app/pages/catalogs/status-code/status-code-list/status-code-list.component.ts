import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IStatusCode } from 'src/app/core/models/catalogs/status-code.model';
import { StatusCodeService } from 'src/app/core/services/catalogs/status-code.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StatusCodeFormComponent } from '../status-code-form/status-code-form.component';
import { STATUSCODE_COLUMS } from './status-code-columns';

@Component({
  selector: 'app-status-code-list',
  templateUrl: './status-code-list.component.html',
  styles: [],
})
export class StatusCodeListComponent extends BasePage implements OnInit {
  paragraphs: IStatusCode[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private statusCodeService: StatusCodeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATUSCODE_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.statusCodeService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(statusCode?: IStatusCode) {
    let config: ModalOptions = {
      initialState: {
        statusCode,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(StatusCodeFormComponent, config);
  }

  delete(statusCode: IStatusCode) {
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
