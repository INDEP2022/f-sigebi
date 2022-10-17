import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISatClassification } from 'src/app/core/models/catalogs/sat-classification.model';
import { SatClassificationService } from 'src/app/core/services/catalogs/sat-classification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SatClassificationFormComponent } from '../sat-classification-form/sat-classification-form.component';
import { SAT_CLASSIFICATION_COLUMNS } from './sat-classification-columns';

@Component({
  selector: 'app-sat-classification-list',
  templateUrl: './sat-classification-list.component.html',
  styles: [],
})
export class SatClassificationListComponent extends BasePage implements OnInit {
  paragraphs: ISatClassification[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private satClassificationService: SatClassificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SAT_CLASSIFICATION_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.satClassificationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(satclasification?: ISatClassification) {
    let config: ModalOptions = {
      initialState: {
        satclasification,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SatClassificationFormComponent, config);
  }

  delete(satclasification?: ISatClassification) {
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
