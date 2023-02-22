import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ILawyer } from 'src/app/core/models/catalogs/lawyer.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { LawyerService } from '../../../../core/services/catalogs/lawyer.service';
import { LawyerDetailComponent } from '../lawyer-detail/lawyer-detail.component';
import { LAWYER_COLUMNS } from './lawyer-columns';

@Component({
  selector: 'app-lawyer-list',
  templateUrl: './lawyer-list.component.html',
  styles: [],
})
export class LawyerListComponent extends BasePage implements OnInit {
  lawyers: ILawyer[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private lawyerService: LawyerService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = LAWYER_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getLawyers());
  }

  getLawyers() {
    this.loading = true;
    this.lawyerService.getAll(this.params.getValue()).subscribe(
      response => {
        this.lawyers = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  add() {
    this.openModal();
  }

  openModal(context?: Partial<LawyerDetailComponent>) {
    const modalRef = this.modalService.show(LawyerDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getLawyers();
    });
  }

  edit(lawyer: ILawyer) {
    this.openModal({ edit: true, lawyer });
  }

  delete(lawyer: ILawyer) {
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
