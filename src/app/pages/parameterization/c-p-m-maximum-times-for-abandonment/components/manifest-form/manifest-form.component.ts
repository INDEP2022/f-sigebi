import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';

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
      nameGoodType: [''],
      creationUser: [''],
      editionUser: [''],
      maxAsseguranceTime: [],
      maxExtensionTime: [],
      maxFractionTime: [],
      maxLimitTime1: [],
      maxLimitTime2: [],
      maxLimitTime3: [],
      maxStatementTime: [],
      modificationDate: [],
      noRegister: [],
      version: [],
      id: [],
      creationDate: [],
    });

    this.goodTypeForm.patchValue({
      ...this.goodType,
    });

    console.log(this.goodTypeForm.value);
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
