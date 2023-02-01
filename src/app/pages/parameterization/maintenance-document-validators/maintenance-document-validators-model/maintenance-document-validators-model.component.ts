import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IValidatorsProceedings } from 'src/app/core/models/catalogs/validators-proceedings-model';
import { ValidatorsProceedingsService } from 'src/app/core/services/catalogs/validators-proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-maintenance-document-validators-model',
  templateUrl: './maintenance-document-validators-model.component.html',
  styles: [],
})
export class MaintenanceDocumentValidatorsModalComponent
  extends BasePage
  implements OnInit
{
  validatorsProceedingsForm: ModelForm<IValidatorsProceedings>;
  validatorsProceedings: IValidatorsProceedings;
  title: string = 'Mantenimiento a validadores de actas';
  edit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private validatorsProceedingsService: ValidatorsProceedingsService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.prepareForm();
  }
}
