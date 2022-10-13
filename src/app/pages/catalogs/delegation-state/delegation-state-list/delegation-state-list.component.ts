import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDelegationState } from 'src/app/core/models/catalogs/delegation-state.model';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DelegationStateFormComponent } from '../delegation-state-form/delegation-state-form.component';
import { DELEGATION_STATE_COLUMNS } from './delegation-state-columns';

@Component({
  selector: 'app-delegation-state-list',
  templateUrl: './delegation-state-list.component.html',
  styles: [],
})
export class DelegationStateListComponent extends BasePage implements OnInit {
  
  delegationsState: IDelegationState[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private delegationStateService: DelegationStateService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DELEGATION_STATE_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDelegationState());
  }

  getDelegationState() {
    this.loading = true;
    this.delegationStateService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.delegationsState = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(delegationSate?: IDelegationState) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      delegationSate,
      callback: (next: boolean) => {
        if (next) this.getDelegationState();
      },
    };
    this.modalService.show(DelegationStateFormComponent, modalConfig);
  }

  showDeleteAlert(delegationSate: IDelegationState) {
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
