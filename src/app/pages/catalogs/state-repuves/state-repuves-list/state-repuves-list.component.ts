import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IStateRepuve } from 'src/app/core/models/catalogs/state-repuve.model';
import { StateRepuveService } from 'src/app/core/services/catalogs/state-repuve.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StateRepuvesFormComponent } from '../state-repuves-form/state-repuves-form.component';
import { STATEREPUVES_COLUMS } from './state-repuves-columns';

@Component({
  selector: 'app-state-repuves-list',
  templateUrl: './state-repuves-list.component.html',
  styles: [],
})
export class StateRepuvesListComponent extends BasePage implements OnInit {
  paragraphs: IStateRepuve[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private stateRepuveService: StateRepuveService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATEREPUVES_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.stateRepuveService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(stateRepuve?: IStateRepuve) {
    let config: ModalOptions = {
      initialState: {
        stateRepuve,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(StateRepuvesFormComponent, config);
  }

  delete(stateRepuve: IStateRepuve) {
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
