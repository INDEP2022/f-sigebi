import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-getpick-form',
  templateUrl: './getpick-form.component.html',
  styles: [],
})
export class GetpickFormComponent extends BasePage implements OnInit {
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
  }

  createForm() {
    this.goodTypeForm = this.formBuilder.group({
      nameGoodType: [null],
      creationUser: [null],
      editionUser: [null],
      maxAsseguranceTime: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.max(9999)],
      ],
      maxExtensionTime: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.max(9999)],
      ],
      maxFractionTime: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.max(9999)],
      ],
      maxLimitTime1: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.max(9999)],
      ],
      maxLimitTime2: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.max(9999)],
      ],
      maxLimitTime3: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.max(9999)],
      ],
      maxStatementTime: [
        0,
        [Validators.pattern(NUMBERS_PATTERN), Validators.max(9999)],
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
      'No Manifestados',
      `Ha sido actualizado correctamente`
    );
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
