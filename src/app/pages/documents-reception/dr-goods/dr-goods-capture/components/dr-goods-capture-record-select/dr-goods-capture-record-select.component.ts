import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-dr-goods-capture-record-select',
  templateUrl: './dr-goods-capture-record-select.component.html',
  styles: [],
})
export class DrGoodsCaptureRecordSelectComponent implements OnInit {
  form = this.fb.group({
    noExpediente: [null, [Validators.required]],
    esEmpresa: [false, [Validators.required]],
    noBien: [null, [Validators.required]],
  });
  select = new DefaultSelect();

  get isCompany() {
    return this.form.controls.esEmpresa.value;
  }

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {}

  confirm() {
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
