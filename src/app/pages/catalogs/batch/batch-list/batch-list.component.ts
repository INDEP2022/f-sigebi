import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from '../../../../common/repository/interfaces/list-params';

import { IBatch } from '../../../../core/models/catalogs/batch.model';
import { BatchFormComponent } from '../batch-form/batch-form.component';
import { BatchService } from './../../../../core/services/catalogs/batch.service';
import { BATCH_COLUMNS } from './batch-columns';

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styles: [],
})
export class BatchListComponent extends BasePage implements OnInit {
  columns: IBatch[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private batchService: BatchService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = BATCH_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.batchService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<BatchFormComponent>) {
    const modalRef = this.modalService.show(BatchFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(batch?: IBatch) {
    this.openModal({ batch });
  }

  delete(batch: IBatch) {
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
