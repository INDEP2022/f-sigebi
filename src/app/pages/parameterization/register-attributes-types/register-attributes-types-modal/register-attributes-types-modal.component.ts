import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IAttribClassifGoods } from 'src/app/core/models/ms-goods-query/attributes-classification-good';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
@Component({
  selector: 'app-register-attributes-types-modal',
  templateUrl: './register-attributes-types-modal.component.html',
  styles: [],
})
export class RegisterAttributesTypesModalComponent implements OnInit {
  title: string = 'Alta de atributos por tipo de bien';
  edit: boolean = false;

  attribClassifGoodForm: ModelForm<IAttribClassifGoods>;
  attribClassifGood: IAttribClassifGoods;

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.attribClassifGoodForm = this.fb.group({
      classifGoodNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      columnNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
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
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      update: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      accessKey: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      tableCd: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      registrationNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      typeAct: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
    });
    if (this.attribClassifGood != null) {
      this.edit = true;
      this.attribClassifGoodForm.patchValue(this.attribClassifGood);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
