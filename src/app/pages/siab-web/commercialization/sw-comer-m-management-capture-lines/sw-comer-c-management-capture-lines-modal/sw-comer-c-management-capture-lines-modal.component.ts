import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-sw-comer-c-management-capture-lines-modal',
  templateUrl: './sw-comer-c-management-capture-lines-modal.component.html',
  styles: [],
})
export class SwComerCManagementCaptureLinesModalComponent implements OnInit {
  title: string = 'Línea de captura';
  edit: boolean = true;
  form: FormGroup = new FormGroup({});

  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      allotment: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      status: [null, [Validators.required]],
      type: [null, [Validators.required]],
      reference: [null, [Validators.required]],
      dateValidity: [null, [Validators.required]],
      rfc: [null, [Validators.required]],
      idClient: [null, [Validators.required]],
      client: [null, [Validators.required]],
      penalty: [null, [Validators.required]],
      note: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
