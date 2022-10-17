import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGrantee } from 'src/app/core/models/catalogs/grantees.model';
import { GranteeService } from 'src/app/core/services/catalogs/grantees.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GranteesFormComponent } from '../grantees-form/grantees-form.component';
import { GRANTEES_COLUMNS } from './grantee-columns';

@Component({
  selector: 'app-grantees-list',
  templateUrl: './grantees-list.component.html',
  styles: [],
})
export class GranteesListComponent extends BasePage implements OnInit {
  paragraphs: IGrantee[] = [];
  totalItems = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private granteeService: GranteeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GRANTEES_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample(): void {
    this.loading = true;
    this.granteeService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(grantee?: IGrantee): void {
    let config: ModalOptions = {
      initialState: {
        grantee,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GranteesFormComponent, config);
  }

  delete(grantee: IGrantee): void {
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
