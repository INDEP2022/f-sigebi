import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-cat-types-of-goods-sub-type',
  templateUrl: './cat-types-of-goods-sub-type.component.html',
  styles: [],
})
export class CatTypesOfGoodsSubTypeComponent
  extends BasePage
  implements OnInit
{
  edit: boolean = false;
  typeGoodsForm: ModelForm<any>;
  data: any;
  idTypeGood: string;
  constructor(
    private goodSubTypesService: GoodSubtypeService,
    private fb: FormBuilder,
    private modalRef: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.typeGoodsForm = this.fb.group({
      id: [null],
      nameSubtypeGood: ['', Validators.compose([Validators.required])],
      idTypeGood: [null],
      noPhotography: [null],
      descriptionPhotography: ['', Validators.compose([Validators.required])],
      noRegister: [null],
      version: null,
      creationUser: [null],
      creationDate: [null],
      editionUser: [null],
      modificationDate: [null],
    });
    if (this.data != null) {
      this.edit = true;
      console.log(this.data);
      this.typeGoodsForm.patchValue(this.data);
      this.typeGoodsForm.controls['idTypeGood'].setValue(
        this.data.idTypeGood.id
      );
    } else {
      this.typeGoodsForm.controls['idTypeGood'].setValue(this.idTypeGood);
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
    const ids = {
      id: this.typeGoodsForm.controls['id'].value,
      idTypeGood: this.typeGoodsForm.controls['idTypeGood'].value,
    };
    this.goodSubTypesService
      .updateByIds(ids, this.typeGoodsForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  create() {
    this.loading = true;
    this.goodSubTypesService
      .create(this.typeGoodsForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast(
      'success',
      'Sub Tipo de bienes',
      `${message} Correctamente`
    );
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
