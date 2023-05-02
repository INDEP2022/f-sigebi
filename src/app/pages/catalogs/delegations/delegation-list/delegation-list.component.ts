import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DelegationFormComponent } from '../delegation-form/delegation-form.component';
import { DELEGATION_COLUMS } from './delegation-columns';

@Component({
  selector: 'app-delegation-list',
  templateUrl: './delegation-list.component.html',
  styles: [],
})
export class DelegationListComponent extends BasePage implements OnInit {
  paragraphs: IDelegation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private delegationService: DelegationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DELEGATION_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.delegationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(delegation?: IDelegation) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      delegation,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.modalService.show(DelegationFormComponent, modalConfig);
  }

  delete(delegation: IDelegation) {
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
