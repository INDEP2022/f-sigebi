import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pa-gsp-c-goods-service-payment',
  templateUrl: './pa-gsp-c-goods-service-payment.component.html',
  styles: [],
})
export class PaGspCGoodsServicePaymentComponent implements OnInit {
  @Output() data = new EventEmitter<any>();

  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      applicationDate: [null, [Validators.required]],
      record: [null, [Validators.required]],
      type: [null, [Validators.required]],
      subtype: [null, [Validators.required]],
      ssubtype: [null, [Validators.required]],
      sssubtype: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }
}
