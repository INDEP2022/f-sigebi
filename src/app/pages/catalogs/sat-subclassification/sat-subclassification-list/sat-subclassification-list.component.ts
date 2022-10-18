import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISatSubclassification } from 'src/app/core/models/catalogs/sat-subclassification.model';
import { SATSubclassificationService } from 'src/app/core/services/catalogs/sat-subclassification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SatSubclassificationFormComponent } from '../sat-subclassification-form/sat-subclassification-form.component';
import { SAT_SUBCLASSIFICATION_COLUMNS } from './sat-subclassification-columns';

@Component({
  selector: 'app-sat-subclassification-list',
  templateUrl: './sat-subclassification-list.component.html',
  styles: [],
})
export class SatSubclassificationListComponent
  extends BasePage
  implements OnInit
{
  paragraphs: ISatSubclassification[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private satSubclassificationService: SATSubclassificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SAT_SUBCLASSIFICATION_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.satSubclassificationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(satSubclassification?: ISatSubclassification) {
    let config: ModalOptions = {
      initialState: {
        satSubclassification,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SatSubclassificationFormComponent, config);
  }

  delete(satSubclassification?: ISatSubclassification) {
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
