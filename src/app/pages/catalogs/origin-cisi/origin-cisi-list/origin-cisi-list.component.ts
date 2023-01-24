import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IOriginCisi } from 'src/app/core/models/catalogs/origin-cisi.model';
import { OiriginCisiService } from 'src/app/core/services/catalogs/origin-cisi.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { OrignCisiFormComponent } from '../orign-cisi-form/orign-cisi-form.component';
import { ORIGIN_CISI_COLUMNS } from './origin-cisi-columns';

@Component({
  selector: 'app-origin-cisi-list',
  templateUrl: './origin-cisi-list.component.html',
  styles: [],
})
export class OriginCisiListComponent extends BasePage implements OnInit {
  originCisis: IOriginCisi[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private originCisiService: OiriginCisiService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = ORIGIN_CISI_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.originCisiService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.originCisis = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(originCisi?: IOriginCisi) {
    let config: ModalOptions = {
      initialState: {
        originCisi,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(OrignCisiFormComponent, config);
  }

  delete(originCisi?: IOriginCisi) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //this.originCisiService.remove(originCisi.id);
      }
    });
  }
}
