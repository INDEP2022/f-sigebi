import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISatClassification } from 'src/app/core/models/catalogs/sat-classification.model';
import { SatClasificationService } from 'src/app/core/services/catalogs/sat-classification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SatClasificationFormComponent } from '../sat-clasification-form/sat-clasification-form.component';
import { SAT_CLASIFICATION_COLUMNS } from './sat-clasification-columns';

@Component({
  selector: 'app-sat-clasification-list',
  templateUrl: './sat-clasification-list.component.html',
  styles: [
  ]
})
export class SatClasificationListComponent extends BasePage implements OnInit {
  settings = TABLE_SETTINGS;
  paragraphs: ISatClassification[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private satClasificationService: SatClasificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SAT_CLASIFICATION_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.satClasificationService.getAll(this.params.getValue()).subscribe({
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
        ...satclasification,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SatClasificationFormComponent, config);
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
