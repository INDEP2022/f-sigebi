import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { MunicipalityFormComponent } from '../municipality-form/municipality-form.component';
import { IMunicipality } from './../../../../core/models/catalogs/municipality.model';
import { MunicipalityService } from './../../../../core/services/catalogs/municipality.service';
import { MUNICIPALITIES_COLUMNS } from './municipality-columns';

@Component({
  selector: 'app-municipality-list',
  templateUrl: './municipality-list.component.html',
  styles: [],
})
export class MunicipalityListComponent extends BasePage implements OnInit {
  columns: IMunicipality[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private municipalityService: MunicipalityService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = MUNICIPALITIES_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.municipalityService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<MunicipalityFormComponent>) {
    const modalRef = this.modalService.show(MunicipalityFormComponent, {
      initialState: { ...context },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(municipality?: IMunicipality) {
    this.openModal({ municipality });
  }

  delete(batch: IMunicipality) {
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
