import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IIssuingInstitution } from '../../../../core/models/catalogs/issuing-institution.model';
import { IssuingInstitutionService } from './../../../../core/services/catalogs/issuing-institution.service';
import { ISSUING_INSTITUTION_COLUMNS } from './issuing-institution-columns';
import { IssuingInstitutionFormComponent } from '../issuing-institution-form/issuing-institution-form.component';

@Component({
  selector: 'app-issuing-institution-list',
  templateUrl: './issuing-institution-list.component.html',
  styles: [],
})
export class IssuingInstitutionListComponent
  extends BasePage
  implements OnInit
{
  settings = TABLE_SETTINGS;
  columns: IIssuingInstitution[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private issuingInstitutionService: IssuingInstitutionService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = ISSUING_INSTITUTION_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    this.issuingInstitutionService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<IssuingInstitutionFormComponent>) {
    const modalRef = this.modalService.show(IssuingInstitutionFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(issuingInstitution?: IIssuingInstitution) {
    this.openModal({ issuingInstitution });
  }

  delete(batch: IIssuingInstitution) {
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
