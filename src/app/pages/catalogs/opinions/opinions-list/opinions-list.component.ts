import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IOpinion } from 'src/app/core/models/catalogs/opinion.model';
import { OpinionService } from 'src/app/core/services/catalogs/opinion.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { OpinionFormComponent } from '../opinion-form/opinion-form.component';
import { OPINION_COLUMNS } from './opinion-columns';

@Component({
  selector: 'app-opinions-list',
  templateUrl: './opinions-list.component.html',
  styles: [],
})
export class OpinionsListComponent extends BasePage implements OnInit {
  opinions: IOpinion[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private opinionService: OpinionService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = OPINION_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  getDeductives() {
    this.loading = true;
    this.opinionService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.opinions = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(opinion?: IOpinion) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      opinion,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(OpinionFormComponent, modalConfig);
  }

  showDeleteAlert(opinion: IOpinion) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(opinion.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.opinionService.remove(id).subscribe({
      next: () => this.getDeductives(),
    });
  }
}
