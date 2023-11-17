import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-copy-parameters-modal',
  templateUrl: './copy-parameters-modal.component.html',
  styleUrls: ['./copy-parameters-modal.component.scss'],
})
export class CopyParametersConceptsModalComponent extends BasePage {
  form: FormGroup;
  conceptId: string;
  address: string;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
    this.form = this.fb.group({
      id: [null, [Validators.required]],
    });
  }

  changeValue(event: any) {
    console.log(event, this.form.value);
  }

  get path() {
    return (
      'comerconcepts/api/v1/concepts/getIdConcept?filter.direccion=$in:' +
      this.address +
      ',C'
    );
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    console.log(this.form.value);
    // if (!this.edit) {
    //   this.form.get('creationDate').setValue(secondFormatDate(new Date()));
    //   this.form.get('creationUser').setValue(secondFormatDate(new Date()));
    // }
    this.modalRef.content.callback(this.form.value);
    this.modalRef.hide();
  }
}
