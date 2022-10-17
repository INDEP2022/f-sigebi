import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISubdelegation } from 'src/app/core/models/catalogs/subdelegation.model';
import { SubdelegationService } from 'src/app/core/services/catalogs/subdelegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SubDelegationFormComponent } from '../sub-delegation-form/sub-delegation-form.component';
import { SUB_DELEGATION_COLUMS } from './sub-delegation-columns';

@Component({
  selector: 'app-sub-delegation-list',
  templateUrl: './sub-delegation-list.component.html',
  styles: [],
})
export class SubDelegationListComponent extends BasePage implements OnInit {
  paragraphs: ISubdelegation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private subdelegationService: SubdelegationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SUB_DELEGATION_COLUMS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.subdelegationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(subdelegation?: ISubdelegation) {
    let config: ModalOptions = {
      initialState: {
        subdelegation,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SubDelegationFormComponent, config);
  }

  delete(subdelegation: ISubdelegation) {
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
