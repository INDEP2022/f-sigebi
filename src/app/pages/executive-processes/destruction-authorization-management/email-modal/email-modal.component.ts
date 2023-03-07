import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styles: [],
})
export class EmailModalComponent implements OnInit {
  title: string = 'Lista de distribución de correos';

  emailForm: FormGroup = new FormGroup({});

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.emailForm = this.fb.group({
      emails_send: [null, [Validators.required]],
      user: [null, [Validators.required]],
      name: [null, [Validators.required]],
      ccUser: [null, [Validators.required]],
      ccName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      body: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.send();
  }

  send() {}
}
