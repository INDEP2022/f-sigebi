import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from '../../../../common/repository/interfaces/list-params';

import { RevisionReasonService } from 'src/app/core/services/catalogs/revision-reason.service';
import { IRevisionReason } from '../../../../core/models/catalogs/revision-reason.model';
import { RevisionReasonFormComponent } from '../revision-reason-form/revision-reason-form.component';
import { REVISION_REASON_COLUMNS } from './revision-reason-columns';

@Component({
  selector: 'app-revision-reason-list',
  templateUrl: './revision-reason-list.component.html',
  styles: [],
})
export class RevisionReasonListComponent extends BasePage implements OnInit {
  columns: IRevisionReason[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private revisionReasonService: RevisionReasonService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = REVISION_REASON_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.revisionReasonService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<RevisionReasonFormComponent>) {
    const modalRef = this.modalService.show(RevisionReasonFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(revisionReason?: IRevisionReason) {
    this.openModal({ revisionReason });
  }

  delete(batch: IRevisionReason) {
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
