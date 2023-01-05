import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-record-account-statements-modal',
  templateUrl: './record-account-statements-modal.component.html',
  styles: [],
})
export class RecordAccountStatementsModalComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Traspasar los movimientos a la siguiente cuenta';
  form: FormGroup;

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      bank: [null, Validators.required],
      account: [null, Validators.required],
      date: [null, Validators.nullValidator],
      amount: [null, Validators.nullValidator],
      motion: [null, Validators.nullValidator],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
