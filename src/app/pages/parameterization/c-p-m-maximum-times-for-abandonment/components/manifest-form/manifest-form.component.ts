import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-manifest-form',
  templateUrl: './manifest-form.component.html',
  styles: [],
})
export class ManifestFormComponent extends BasePage implements OnInit {
  goodTypeForm: ModelForm<IGoodType>;
  goodType: IGoodType;

  constructor(
    private modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private goodTypeServ: GoodTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    console.log(this.goodTypeForm);
    console.log(this.goodType);
  }

  createForm() {
    this.goodTypeForm = this.formBuilder.group({
      nameGoodType: [null],
      creationUser: [null],
      editionUser: [null],
      maxAsseguranceTime: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(4)],
      ],
      maxExtensionTime: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(4)],
      ],
      maxFractionTime: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(4)],
      ],
      maxLimitTime1: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(4)],
      ],
      maxLimitTime2: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(4)],
      ],
      maxLimitTime3: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(4)],
      ],
      maxStatementTime: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(4)],
      ],
      modificationDate: [null],
      noRegister: [null],
      version: [null],
      id: [null],
      creationDate: [null],
    });

    this.goodTypeForm.patchValue({
      ...this.goodType,
    });
  }

  updateManifest() {
    const id = this.goodTypeForm.get('id').value;

    this.goodTypeServ.update(id, this.goodTypeForm.value).subscribe({
      next: () => {
        this.handleSuccess();
      },
    });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.onLoadToast(
      'success',
      'No Recogidos ',
      `Ha sido actualizado correctamente`
    );
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
