import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-cat-types-of-goods-types-form',
  templateUrl: './cat-types-of-goods-types-form.component.html',
  styles: [],
})
export class CatTypesOfGoodsTypesFormComponent
  extends BasePage
  implements OnInit
{
  edit: boolean = false;
  typeGoodsForm: ModelForm<IGoodType>;
  data: any;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodTypesService: GoodTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.typeGoodsForm = this.fb.group({
      id: [null],
      nameGoodType: [
        '',
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(70),
        ],
      ],
      maxAsseguranceTime: [null],
      maxFractionTime: [null],
      maxExtensionTime: [null],
      maxStatementTime: [null],
      maxLimitTime1: [null],
      maxLimitTime2: [null],
      maxLimitTime3: [null],
      noRegister: [null],
      version: [null],
      creationUser: [null],
      creationDate: [null],
      editionUser: [null],
      modificationDate: [null],
    });
    if (this.data != null) {
      this.edit = true;
      this.typeGoodsForm.patchValue(this.data);
    }
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }
  update() {
    this.loading = true;
    if (this.typeGoodsForm.controls['nameGoodType'].value.trim() == '') {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.goodTypesService
        .update(
          this.typeGoodsForm.controls['id'].value,
          this.typeGoodsForm.getRawValue()
        )
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  create() {
    this.loading = true;
    if (this.typeGoodsForm.controls['nameGoodType'].value.trim() == '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.goodTypesService.create(this.typeGoodsForm.getRawValue()).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', 'Tipo de Bien', `${message} Correctamente`);
    //this.onLoadToast('success', 'Tipos de bienes', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
