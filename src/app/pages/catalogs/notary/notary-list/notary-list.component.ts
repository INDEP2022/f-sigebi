import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import { NotaryFormComponent } from '../notary-form/notary-form.component';
import { INotary } from './../../../../core/models/catalogs/notary.model';
import { NotaryService } from './../../../../core/services/catalogs/notary.service';
import { NOTARY_COLUMNS } from './notary-columns';

@Component({
  selector: 'app-notary-list',
  templateUrl: './notary-list.component.html',
  styles: [],
})
export class NotaryListComponent extends BasePage implements OnInit {
  columns: INotary[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private notaryService: NotaryService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = NOTARY_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.notaryService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<NotaryFormComponent>) {
    const modalRef = this.modalService.show(NotaryFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(notary?: INotary) {
    this.openModal({ notary });
  }

  delete(batch: INotary) {
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
