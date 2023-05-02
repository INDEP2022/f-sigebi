import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IManagement } from 'src/app/core/models/catalogs/management.model';
import { ManagementService } from 'src/app/core/services/catalogs/management.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ManagementFormComponent } from '../management-form/management-form.component';
import { MANAGEMENT_COLUMNS } from './management-columns';

@Component({
  selector: 'app-managements-list',
  templateUrl: './managements-list.component.html',
  styles: [],
})
export class ManagementsListComponent extends BasePage implements OnInit {
  paragraphs: IManagement[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private managementService: ManagementService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = MANAGEMENT_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getManagements());
  }

  getManagements() {
    this.loading = true;
    this.managementService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(management?: IManagement) {
    let config: ModalOptions = {
      initialState: {
        management,
        callback: (next: boolean) => {
          if (next) this.getManagements();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ManagementFormComponent, config);
  }

  delete(management: IManagement) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.managementService.remove(management.id).subscribe({
          next: data => this.getManagements(),
          error: error => (this.loading = false),
        });
      }
    });
  }
}
