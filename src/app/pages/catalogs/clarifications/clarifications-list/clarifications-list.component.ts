import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { IClarification } from '../../../../core/models/catalogs/clarification.model';
import { ClarificationService } from '../../../../core/services/catalogs/clarification.service';
import { ClarificationsDetailComponent } from '../clarifications-detail/clarifications-detail.component';
import { CLARIFICATION_COLUMNS } from './clarification-columns';

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

  openForm(clarification?: IClarification) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      clarification,
      callback: (next: boolean) => {
        if (next) this.getClarifications();
      },
    };
    this.modalService.show(ClarificationsDetailComponent, modalConfig);
  }

  showDeleteAlert(clarification: IClarification) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(clarification.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.clarificationService.remove(id).subscribe({
      next: () => this.getClarifications(),
    });
  }
}
