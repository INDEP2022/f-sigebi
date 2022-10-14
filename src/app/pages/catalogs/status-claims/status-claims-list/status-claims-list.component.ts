import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IStatusClaims } from 'src/app/core/models/catalogs/status-claims.model';
import { StatusClaimsService } from 'src/app/core/services/catalogs/claim-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StatusClaimsFormComponent } from '../status-claims-form/status-claims-form.component';
import { STATUSCLAIMS_COLUMS } from './status-claims-columns';

@Component({
  selector: 'app-status-claims-list',
  templateUrl: './status-claims-list.component.html',
  styles: [],
})
export class StatusClaimsListComponent extends BasePage implements OnInit {
  paragraphs: IStatusClaims[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private statusClaimsService: StatusClaimsService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATUSCLAIMS_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.statusClaimsService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(statusClaims?: IStatusClaims) {
    let config: ModalOptions = {
      initialState: {
        statusClaims,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(StatusClaimsFormComponent, config);
  }

  delete(statusClaims: IStatusClaims) {
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
