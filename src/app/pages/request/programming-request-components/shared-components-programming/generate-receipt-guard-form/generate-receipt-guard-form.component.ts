import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-generate-receipt-guard-form',
  templateUrl: './generate-receipt-guard-form.component.html',
  styles: [],
})
export class GenerateReceiptGuardFormComponent
  extends BasePage
  implements OnInit
{
  receiptId: number;
  form: FormGroup = new FormGroup({});
  identifications = new DefaultSelect();
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      witness1: [null],
      identification: [null],
      numIdentification: [null],
      issuedBy: [null],
      witness2: [null],
      identification2: [null],
      numIdentification2: [null],
      issuedBy2: [null],
      validity: [null],
    });
  }

  confirm() {}

  close() {
    this.modalRef.hide();
  }
}
