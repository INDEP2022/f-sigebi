import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-c-bm-f-cdr-c-rebilling-causes-modal',
  templateUrl: './c-bm-f-cdr-c-rebilling-causes-modal.component.html',
  styles: [
  ]
})
export class CBmFCdrCRebillingCausesModalComponent implements OnInit {

  form : FormGroup = new FormGroup({});
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(){
    this.form = this.fb.group({
      idCauses: ['', [Validators.required]],
      description: ['', [Validators.required]],
      rebill: ['', [Validators.required]],
      apply: ['', [Validators.required]],
      comments: ['', [Validators.required]],
    })
  }

  close() {
    this.modalRef.hide();
  }

}
