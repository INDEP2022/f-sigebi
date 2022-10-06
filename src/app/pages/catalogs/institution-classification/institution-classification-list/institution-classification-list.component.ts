import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { IInstitutionClassification } from '../../../../core/models/catalogs/institution-classification.model';
import { InstitutionClasificationService } from '../../../../core/services/catalogs/institution-classification.service';
import { INSTITUTION_CLASIFICATION_COLUMNS } from './institution-columns';
import { InstitutionClassificationDetailComponent } from '../institution-classification-detail/institution-classification-detail.component';

@Component({
  selector: 'app-institution-classification-list',
  templateUrl: './institution-classification-list.component.html',
  styles: [],
})
export class InstitutionClassificationListComponent
  extends BasePage
  implements OnInit
{
  settings = TABLE_SETTINGS;
  institutions: IInstitutionClassification[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private institutionService: InstitutionClasificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = INSTITUTION_CLASIFICATION_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInstitutions());
  }

  getInstitutions() {
    this.loading = true;
    this.institutionService.getAll(this.params.getValue()).subscribe(
      response => {
        this.institutions = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  add() {
    this.openModal();
  }

  openModal(context?: Partial<InstitutionClassificationDetailComponent>) {
    const modalRef = this.modalService.show(
      InstitutionClassificationDetailComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getInstitutions();
    });
  }

  edit(institution: IInstitutionClassification) {
    this.openModal({ edit: true, institution });
  }

  delete(institution: IInstitutionClassification) {
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
