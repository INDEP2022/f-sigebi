import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { BsModalService } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISiabClasification } from 'src/app/core/models/catalogs/siab-clasification.model';
import { SIABClasificationService } from 'src/app/core/services/catalogs/siab-clasification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SiabClasificationDetailComponent } from '../siab-clasification-detail/siab-clasification-detail.component';
import { SIAB_COLUMNS } from './siab-columns';

@Component({
  selector: 'app-siab-clasification-list',
  templateUrl: './siab-clasification-list.component.html',
  styles: [],
})
export class SiabClasificationListComponent extends BasePage implements OnInit {
  clasifications: ISiabClasification[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private siabService: SIABClasificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SIAB_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSiabClasifications());
  }

  getSiabClasifications() {
    this.loading = true;
    this.siabService.getAll(this.params.getValue()).subscribe(
      response => {
        this.clasifications = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  add() {
    this.openModal();
  }

  openModal(context?: Partial<SiabClasificationDetailComponent>) {
    const modalRef = this.modalService.show(SiabClasificationDetailComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getSiabClasifications();
    });
  }

  edit(clasification: ISiabClasification) {
    this.openModal({ edit: true, clasification });
  }

  delete(clasification: ISiabClasification) {
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
