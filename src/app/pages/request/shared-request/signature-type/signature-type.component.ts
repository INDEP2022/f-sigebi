import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-signature-type',
  templateUrl: './signature-type.component.html',
  styles: [],
})
export class SignatureTypeComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  edit: boolean = false;

  @Output() refresh = new EventEmitter<true>();
  @Output() signatureType = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      signatureType: ['electronic', [Validators.required]],
    });

    /*if (this.edit) {
      //console.log(this.brand)
      //this.status = 'Actualizar';
      //this.form.patchValue(this.brand);
      //this.data.load(this.brand.subbrands);
      //this.data.refresh();
    }*/
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.loading = false;
    this.signatureType.emit(false);
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.handleSuccess();
  }

  handleSuccess() {
    let signT = this.form.controls['signatureType'].value;

    this.loading = false;
    //this.refresh.emit(true);
    this.signatureType.emit(signT);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
    /*this.bankService.update(this.bank.bankCode, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );*/
  }
}
