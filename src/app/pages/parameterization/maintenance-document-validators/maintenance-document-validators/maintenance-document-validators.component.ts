import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IValidatorsProceedings } from 'src/app/core/models/catalogs/validators-proceedings-model';
import { ValidatorsProceedingsService } from 'src/app/core/services/catalogs/validators-proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MaintenanceDocumentValidatorsModalComponent } from '../maintenance-document-validators-model/maintenance-document-validators-model.component';
import { MAINTANANCE_DOCUMENT_VALIDATORS_COLUMNS } from './maintenance-document-validators-columns';

@Component({
  selector: 'app-maintenance-document-validators',
  templateUrl: './maintenance-document-validators.component.html',
  styles: [],
})
export class MaintenanceDocumentValidatorsComponent
  extends BasePage
  implements OnInit
{
  maintenanceDocumentForm: FormGroup;
  validatorsProceedings: IValidatorsProceedings[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(
    private fb: FormBuilder,
    private validatorsProceedingsService: ValidatorsProceedingsService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: MAINTANANCE_DOCUMENT_VALIDATORS_COLUMNS,
    };
  }
  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMaximumTimeAll());
  }
  getMaximumTimeAll() {
    this.loading = true;
    this.validatorsProceedingsService.getAll(this.params.getValue()).subscribe({
      next: response => {
        console.log(response.data);
        this.validatorsProceedings = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  openForm(validatorsProceedings?: IValidatorsProceedings) {
    let config: ModalOptions = {
      initialState: {
        validatorsProceedings,
        callback: (next: boolean) => {
          if (next) this.getMaximumTimeAll();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(MaintenanceDocumentValidatorsModalComponent, config);
  }
}
