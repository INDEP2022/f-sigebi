import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IValidatorsProceedings } from 'src/app/core/models/catalogs/validators-proceedings-model';
import { ValidatorsProceedingsService } from 'src/app/core/services/catalogs/validators-proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

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
  typeItem: any[];
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private validatorsProceedingsService: ValidatorsProceedingsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.typeItem = [
      { label: 'DEV', value: 'DEV' },
      { label: 'DON', value: 'DON' },
      { label: 'DES', value: 'DES' },
      { label: 'ABN', value: 'ABN' },
      { label: 'RESAR', value: 'RESAR' },
      { label: 'REC/DEC', value: 'RECDEC' },
      { label: 'CAN/SUS', value: 'CANSUS' },
      { label: 'ENTREGA', value: 'ENTREGA' },
    ];
  }
  private prepareForm() {
    this.validatorsProceedingsForm = this.fb.group({
      proceedingsType: [null, [Validators.required]],
      secVal: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      descVal: [null, [Validators.required]],
      scriptVal: [null, [Validators.required]],
      numRegister: [null],
    });
    if (this.validatorsProceedings != null) {
      console.log('editar');
      this.edit = true;
      this.validatorsProceedingsForm.patchValue(this.validatorsProceedings);
    }
    this.validatorsProceedingsForm.controls['proceedingsType'].setValue('0');
  }
  close() {
    this.modalRef.hide();
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    this.loading = true;
    this.validatorsProceedingsService
      .create(this.validatorsProceedingsForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  update() {
    this.loading = true;
    this.validatorsProceedingsService
      .update4(this.validatorsProceedingsForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
