import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
//models
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
//services
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';

@Component({
  selector: 'app-register-attributes-types-modal',
  templateUrl: './register-attributes-types-modal.component.html',
  styles: [],
})
export class RegisterAttributesTypesModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Alta de atributos por tipo de bien';
  edit: boolean = false;

  attribClassifGoodForm: ModelForm<IAttribClassifGoods>;
  attribClassifGood: IAttribClassifGoods;

  noClass: IAttribClassifGoods;
  _id: any;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodsQueryService: GoodsQueryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.attribClassifGoodForm = this.fb.group({
      classifGoodNumber: [null, []],
      columnNumber: [null, []],
      attribute: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      required: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dataType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      length: [
        null,
        [
          Validators.required,
          Validators.maxLength(2),
          Validators.max(80),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      update: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      accessKey: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      tableCd: [null, [Validators.pattern(STRING_PATTERN)]],
      //typeAct: [null, []],
    });
    if (this.attribClassifGood != null) {
      this.edit = true;
      this.attribClassifGoodForm.patchValue(this.attribClassifGood);
    } else {
      this.edit = false;
      this.attribClassifGoodForm.controls['classifGoodNumber'].setValue(
        this._id
      );
      console.log('Valor de modal: ', this._id);
    }
  }

  message: any = false;

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.goodsQueryService.create(this.attribClassifGoodForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.goodsQueryService.update(this.attribClassifGoodForm.value).subscribe({
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
