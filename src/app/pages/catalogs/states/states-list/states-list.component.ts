import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { IStateOfRepublic } from '../../../../core/models/catalogs/state-of-republic.model';
import { StateFormComponent } from '../state-form/state-form.component';
import { STATES_COLUMNS } from './states-columns';

@Component({
  selector: 'app-states-list',
  templateUrl: './states-list.component.html',
  styles: [],
})
export class StatesListComponent extends BasePage implements OnInit {
  states: IStateOfRepublic[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private stateService: StateOfRepublicService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATES_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  getDeductives() {
    this.loading = true;
    this.stateService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.states = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(state?: IStateOfRepublic) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      state,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(StateFormComponent, modalConfig);
  }

  showDeleteAlert(state: IStateOfRepublic) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(state.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: string) {
    this.stateService.remove(id).subscribe({
      next: () => this.getDeductives(),
    });
  }
}
