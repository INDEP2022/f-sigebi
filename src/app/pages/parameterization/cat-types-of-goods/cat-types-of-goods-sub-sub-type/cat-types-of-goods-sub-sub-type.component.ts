import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-cat-types-of-goods-sub-sub-type',
  templateUrl: './cat-types-of-goods-sub-sub-type.component.html',
  styles: [],
})
export class CatTypesOfGoodsSubSubTypeComponent
  extends BasePage
  implements OnInit
{
  edit: boolean = false;
  typeGoodsForm: ModelForm<any>;
  data: any;
  idTypeGood: string;
  idSsTypeGood: string;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodSsubtypeService: GoodSsubtypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.typeGoodsForm = this.fb.group({
      id: [null],
      noSubType: [null],
      noType: [null],
      description: [
        '',
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(70),
        ],
      ],
      noRegister: [null],
    });
    if (this.data != null) {
      this.edit = true;
      console.log(this.data);
      this.typeGoodsForm.patchValue(this.data);
      this.typeGoodsForm.controls['noSubType'].setValue(this.data.noSubType.id);
      this.typeGoodsForm.controls['noType'].setValue(this.data.noType.id);
    } else {
      this.typeGoodsForm.controls['noType'].setValue(this.idTypeGood);
      this.typeGoodsForm.controls['noSubType'].setValue(this.idSsTypeGood);
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
    if (this.typeGoodsForm.controls['description'].value.trim() == '') {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      const ids = {
        id: this.typeGoodsForm.controls['id'].value,
        noSubType: this.typeGoodsForm.controls['noSubType'].value,
        noType: this.typeGoodsForm.controls['noType'].value,
      };
      this.goodSsubtypeService
        .updateByIds(ids, this.typeGoodsForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }
  create() {
    this.loading = true;
    if (this.typeGoodsForm.controls['description'].value.trim() == '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.goodSsubtypeService
        .create(this.typeGoodsForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast(
      'success',
      'Sub Sub Tipo de Bien',
      `${message} Correctamente`
    );
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
