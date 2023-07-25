import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-cat-types-of-goods-sub-sub-sub-type',
  templateUrl: './cat-types-of-goods-sub-sub-sub-type.component.html',
  styles: [],
})
export class CatTypesOfGoodsSubSubSubTypeComponent
  extends BasePage
  implements OnInit
{
  edit: boolean = false;
  typeGoodsForm: ModelForm<any>;
  data: any;
  idTypeGood: string;
  idSsTypeGood: string;
  idSssTypeGood: string;
  numGood: string;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodSssubtypeService: GoodSssubtypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.typeGoodsForm = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(4),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(70),
        ],
      ],
      //numClasifGoods: [null],
      numSsubType: [null],
      numSubType: [null],
      numType: [null],
      numRegister: [null],
      numClasifAlterna: [null],
    });
    if (this.data != null) {
      this.edit = true;
      console.log(this.data.numClasifGoods);
      this.typeGoodsForm.patchValue(this.data);
      //this.typeGoodsForm.controls['id'].setValue(this.data.numClasifGoods);
      this.typeGoodsForm.controls['id'].disable();
      this.typeGoodsForm.controls['numSsubType'].setValue(
        this.data.numSsubType.id
      );
      this.typeGoodsForm.controls['numSubType'].setValue(
        this.data.numSubType.id
      );
      this.typeGoodsForm.controls['numType'].setValue(this.data.numType.id);
    } else {
      //console.log(this.numGood);
      //this.typeGoodsForm.controls['id'].setValue(this.numGood);
      this.typeGoodsForm.controls['numType'].setValue(this.idTypeGood);
      this.typeGoodsForm.controls['numSubType'].setValue(this.idSsTypeGood);
      this.typeGoodsForm.controls['numSsubType'].setValue(this.idSssTypeGood);
    }

    console.log(this.typeGoodsForm.controls);
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  close() {
    this.modalRef.hide();
  }
  update() {
    this.loading = true;
    if (
      this.typeGoodsForm.controls['id'].value.trim() == '' ||
      this.typeGoodsForm.controls['description'].value.trim() == '' ||
      (this.typeGoodsForm.controls['id'].value.trim() == '' &&
        this.typeGoodsForm.controls['description'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      const ids = {
        numClasifGoods: this.data.numClasifGoods,
        id: this.typeGoodsForm.controls['id'].value,
        numSsubType: this.typeGoodsForm.controls['numSsubType'].value,
        numSubType: this.typeGoodsForm.controls['numSubType'].value,
        numType: this.typeGoodsForm.controls['numType'].value,
      };
      this.goodSssubtypeService
        .updateByIds(ids, this.typeGoodsForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }
  create() {
    this.loading = true;
    if (
      this.typeGoodsForm.controls['id'].value.trim() == '' ||
      this.typeGoodsForm.controls['description'].value.trim() == '' ||
      (this.typeGoodsForm.controls['id'].value.trim() == '' &&
        this.typeGoodsForm.controls['description'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.goodSssubtypeService
        .create(this.typeGoodsForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => {
            this.alert(
              'warning',
              'Ya existe un registro con el mismo identificador',
              ``
            );
            this.loading = false;
          },
        });
    }
    // this.typeGoodsForm.controls['id'].setValue(1614);
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast(
      'success',
      'Sub Sub Sub Tipo de Bien',
      `${message} Correctamente`
    );
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
