import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from '../../../../core/models/catalogs/generic.model';
import { GenericsFormComponent } from '../generics-form/generics-form.component';
import { GenericService } from './../../../../core/services/catalogs/generic.service';
import { GENERICS_COLUMNS } from './generics-columns';

@Component({
  selector: 'app-generics-list',
  templateUrl: './generics-list.component.html',
  styles: [],
})
export class GenericsListComponent extends BasePage implements OnInit {
  columns: IGeneric[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private genericsService: GenericService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GENERICS_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.genericsService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<GenericsFormComponent>) {
    const modalRef = this.modalService.show(GenericsFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(generics?: IGeneric) {
    this.openModal({ generics });
  }

  delete(batch: IGeneric) {
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
