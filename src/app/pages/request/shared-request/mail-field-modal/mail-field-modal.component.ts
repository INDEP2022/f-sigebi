import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-mail-field-modal',
  templateUrl: './mail-field-modal.component.html',
  styles: [],
})
export class MailFieldModalComponent implements OnInit {
  title: string = 'Ingrese el email del usuario';
  event: EventEmitter<any> = new EventEmitter<any>();
  emailForm: FormGroup = new FormGroup({});

  bsModalRef = inject(BsModalRef);
  fb = inject(FormBuilder);

  constructor() {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
    });
  }

  confirm() {
    this.event.emit(this.emailForm.value);
    this.close();
  }

  close() {
    this.bsModalRef.hide();
  }
}
