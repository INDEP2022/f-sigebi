import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';

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
  typeGoodsForm: ModelForm<any>;
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
      nameGoodType: ['', Validators.compose([Validators.required])],
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

  create() {
    this.loading = true;
    this.goodTypesService.create(this.typeGoodsForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', 'Tipos de bienes', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
