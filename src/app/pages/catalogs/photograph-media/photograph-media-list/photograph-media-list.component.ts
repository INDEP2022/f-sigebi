import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from '../../../../common/repository/interfaces/list-params';

import { IPhotographMedia } from '../../../../core/models/catalogs/photograph-media.model';
import { PhotographMediaService } from '../../../../core/services/catalogs/photograph-media.service';
import { PhotographMediaFormComponent } from '../photograph-media-form/photograph-media-form.component';
import { PHOTOGRAPH_MEDIA_COLUMNS } from './photograph-media-columns';

@Component({
  selector: 'app-photograph-media-list',
  templateUrl: './photograph-media-list.component.html',
  styles: [],
})
export class PhotographMediaListComponent extends BasePage implements OnInit {
  columns: IPhotographMedia[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private photographMediaService: PhotographMediaService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = PHOTOGRAPH_MEDIA_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.photographMediaService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<PhotographMediaFormComponent>) {
    const modalRef = this.modalService.show(PhotographMediaFormComponent, {
      initialState: { ...context },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(photographMedia?: IPhotographMedia) {
    this.openModal({ photographMedia });
  }

  delete(batch: IPhotographMedia) {
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
