import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProficient } from 'src/app/core/models/catalogs/proficient.model';
import { ProeficientService } from 'src/app/core/services/catalogs/proficient.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ExpertFormComponent } from '../experts-form/expert-form.component';
import { EXPERT_COLUMNS } from './expert-columns';

@Component({
  selector: 'app-expert-list',
  templateUrl: './expert-list.component.html',
  styles: [],
})
export class ExpertListComponent extends BasePage implements OnInit {
  proficients: IProficient[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private procientService: ProeficientService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = EXPERT_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.procientService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.proficients = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(proficient?: IProficient) {
    let config: ModalOptions = {
      initialState: {
        proficient,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ExpertFormComponent, config);
  }

  delete(proficient?: IProficient) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //this.procientService.remove(proficient.id);
      }
    });
  }
}
