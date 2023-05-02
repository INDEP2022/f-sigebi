import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-request-service-form',
  templateUrl: './request-service-form.component.html',
  styles: [],
})
export class RequestServiceFormComponent implements OnInit {
  @Output() data = new EventEmitter<any>();

  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      requestDate: [null, [Validators.required]],
      service: [null, [Validators.required]],
      amount: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }
}
