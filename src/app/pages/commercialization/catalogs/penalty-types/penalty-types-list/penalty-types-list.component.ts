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
  // tipo any hasta que existan modelos o interfaces de la respuesta del backend

  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  testData = [
    {
      id: 1,
      description: 'NO PAGO EL CLIENTE',
      days: 720,
      process: 'M',
    },
    {
      id: 2,
      description: 'DOLO',
      days: 1800,
      process: 'M',
    },
    {
      id: 3,
      description: 'NO RETIRO CLIENTE',
      days: 720,
      process: 'M',
    },
    {
      id: 4,
      description: 'INCUMPLIMIENTO POR PRIMERA VEZ GARANTIA DE CUMPLIMIENTO',
      days: 30,
      process: 'A',
    },
    {
      id: 5,
      description: 'INCUMPLIMIENTO POR PRIMERA VEZ EN EL ANTICIPO DE 25%',
      days: 30,
      process: 'A',
    },
  ];

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

  getData() {
    // this.loading = true;
    // this.columns = this.testData;
    // this.totalItems = this.testData.length;
    // this.loading = false;
    console.log(this.params.getValue());
    this.loading = true;
    this.tpenaltyService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
        console.log(response.data, this.columns);
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  openModal(context?: Partial<PenaltyTypesFormComponent>) {
    const modalRef = this.modalService.show(PenaltyTypesFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getData();
    });
  }

  openForm(penaltyType?: any) {
    this.openModal({ penaltyType });
  }

  delete(penaltyType: ITPenalty) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.tpenaltyService.remove(penaltyType.id).subscribe({
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
    });
  }
}
