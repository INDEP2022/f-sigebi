import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ITPenalty } from 'src/app/core/models/ms-parametercomer/penalty-type.model';
import { TPenaltyService } from '../../../../../core/services/ms-parametercomer/tpenalty.service';
import { PenaltyTypesFormComponent } from '../penalty-types-form/penalty-types-form.component';
import { PENALTY_TYPE_COLUMNS } from './penalty-types-columns';

@Component({
  selector: 'app-penalty-types-list',
  templateUrl: './penalty-types-list.component.html',
  styles: [],
})
export class PenaltyTypesListComponent extends BasePage implements OnInit {
  columns: ITPenalty[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private modalService: BsModalService,
    private tpenaltyService: TPenaltyService
  ) {
    super();
    this.settings.columns = PENALTY_TYPE_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData(): void {
    this.loading = true;
    this.tpenaltyService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  openModal(context?: Partial<PenaltyTypesFormComponent>): void {
    const modalRef = this.modalService.show(PenaltyTypesFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  openForm(penaltyType?: any): void {
    this.openModal({ penaltyType });
  }

  delete(penaltyType: ITPenalty): void {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.removePenalty(penaltyType.id);
      }
    });
  }

  removePenalty(id: number): void {
    this.tpenaltyService.remove(id).subscribe({
      next: data => {
        this.onLoadToast(
          'success',
          'Tipo Penalización',
          `Registro Eliminado Correctamente`
        );
        this.loading = false;
        this.getData();
      },
      error: error => {
        this.onLoadToast(
          'error',
          'Tipo Penalización',
          `Error al conectar con el servidor`
        );
        this.loading = false;
        console.log(error);
      },
    });
  }
}
