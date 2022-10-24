import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICourt } from '../../../../core/models/catalogs/court.model';
import { CourtFormComponent } from '../court-form/court-form.component';
import { CourtService } from './../../../../core/services/catalogs/court.service';
import { COURT_COLUMNS } from './court-columns';

@Component({
  selector: 'app-court-list',
  templateUrl: './court-list.component.html',
  styles: [],
})
export class CourtListComponent extends BasePage implements OnInit {
  columns: ICourt[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private courtService: CourtService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = COURT_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.courtService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<CourtFormComponent>) {
    const modalRef = this.modalService.show(CourtFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(court?: ICourt) {
    this.openModal({ court });
  }

  delete(batch: ICourt) {
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
