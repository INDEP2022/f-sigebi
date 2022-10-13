import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-c-bm-f-edf-c-invoice-status-modal',
  templateUrl: './c-bm-f-edf-c-invoice-status-modal.component.html',
  styles: [
  ]
})
export class CBmFEdfCInvoiceStatusModalComponent implements OnInit {

  form : FormGroup = new FormGroup({});
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm()
  }

  private prepareForm(){
    this.form = this.fb.group({
      idStatus: ['', [Validators.required]],
      description: ['', [Validators.required]],
    })
  }

  close() {
    this.modalRef.hide();
  }

}
