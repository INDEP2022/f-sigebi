import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IClarification } from '../../../../core/models/catalogs/clarification.model';
import { ClarificationService } from '../../../../core/services/catalogs/clarification.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { CLARIFICATION_COLUMNS } from './clarification-columns';
import { ClarificationsDetailComponent } from '../clarifications-detail/clarifications-detail.component';

@Component({
  selector: 'app-clarifications-list',
  templateUrl: './clarifications-list.component.html',
  styles: [],
})
export class ClarificationsListComponent extends BasePage implements OnInit {
  clarifications: IClarification[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private clarificationService: ClarificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = CLARIFICATION_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getClarifications());
  }

  getClarifications() {
    this.loading = true;
    this.clarificationService.getAll(this.params.getValue()).subscribe(
      response => {
        this.clarifications = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  add() {
    this.openModal();
  }

  openModal(context?: Partial<ClarificationsDetailComponent>) {
    const modalRef = this.modalService.show(ClarificationsDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getClarifications();
    });
  }

  edit(clarification: IClarification) {
    this.openModal({ edit: true, clarification });
  }

  delete(clarification: IClarification) {
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
