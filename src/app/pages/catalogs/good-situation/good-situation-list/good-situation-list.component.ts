import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodSituation } from 'src/app/core/models/catalogs/good-situation.model';
import { GoodSituationService } from 'src/app/core/services/catalogs/good-situation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GoodSituationFormComponent } from '../good-situation-form/good-situation-form.component';
import { GOOD_SITUATION_COLUMS } from './good-situation-columns';

@Component({
  selector: 'app-good-situation-list',
  templateUrl: './good-situation-list.component.html',
  styles: [],
})
export class GoodSituationListComponent extends BasePage implements OnInit {
  paragraphs: IGoodSituation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private goodSituationService: GoodSituationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GOOD_SITUATION_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.goodSituationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(goodSituation?: IGoodSituation) {
    let config: ModalOptions = {
      initialState: {
        goodSituation,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodSituationFormComponent, config);
  }

  delete(goodSituation: IGoodSituation) {
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
