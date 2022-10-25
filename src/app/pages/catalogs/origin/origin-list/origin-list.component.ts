import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { OriginService } from 'src/app/core/services/catalogs/origin.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IOrigin } from '../../../../core/models/catalogs/origin.model';

import { BehaviorSubject, takeUntil } from 'rxjs';
import { OriginFormComponent } from '../origin-form/origin-form.component';
import { ORIGIN_COLUMNS } from './origin-columns';

@Component({
  selector: 'app-origin-list',
  templateUrl: './origin-list.component.html',
  styles: [],
})
export class OriginListComponent extends BasePage implements OnInit {
  origins: IOrigin[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private originService: OriginService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = ORIGIN_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.originService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.origins = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(origin?: IOrigin) {
    let config: ModalOptions = {
      initialState: {
        origin,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(OriginFormComponent, config);
  }

  delete(origin?: IOrigin) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //this.originService.remove(origin.id);
      }
    });
  }
}
