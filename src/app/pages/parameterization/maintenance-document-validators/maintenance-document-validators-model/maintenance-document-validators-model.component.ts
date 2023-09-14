import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IValidatorsProceedings } from 'src/app/core/models/catalogs/validators-proceedings-model';
import { ValidatorsProceedingsService } from 'src/app/core/services/catalogs/validators-proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

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
  id: any;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private validatorsProceedingsService: ValidatorsProceedingsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.validatorsProceedingsForm = this.fb.group({
      proceedingsType: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      secVal: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(2),
        ],
      ],
      descVal: [
        null,
        [
          Validators.required,
          Validators.maxLength(150),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      scriptVal: [null, [Validators.required, Validators.maxLength(2000)]],
      numRegister: [null],
    });
    if (this.validatorsProceedings != null) {
      console.log('editar');
      this.edit = true;
      this.id = this.validatorsProceedings.proceedingsType;
      console.log('validatorsProceedings:', this.validatorsProceedings);
      this.validatorsProceedingsForm.patchValue(this.validatorsProceedings);
      this.validatorsProceedingsForm.controls['proceedingsType'].disable();
      this.validatorsProceedingsForm.controls['secVal'].disable();
    } else {
      this.validatorsProceedingsForm.controls['proceedingsType'].setValue('');
    }
  }
  close() {
    this.modalRef.hide();
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    if (
      this.validatorsProceedingsForm.controls[
        'proceedingsType'
      ].value.trim() === '' ||
      this.validatorsProceedingsForm.controls['descVal'].value.trim() === '' ||
      this.validatorsProceedingsForm.controls['scriptVal'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', '');
      return;
    }
    this.loading = true;
    this.validatorsProceedingsService
      .create(this.validatorsProceedingsForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.alert('error', 'El Tipo de Acta ya fue registrado', '');
          this.loading = false;
        },
      });
  }
  update() {
    this.loading = true;
    this.validatorsProceedingsForm.controls['proceedingsType'].enable();
    this.validatorsProceedingsForm.controls['secVal'].enable();

    this.validatorsProceedingsService
      .update4(this.validatorsProceedingsForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.loading = false;
          this.validatorsProceedingsForm.controls['proceedingsType'].disable();
        },
      });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', 'Validador de Acta', `${message} Correctamente`);
    // this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
