import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-change-legal-status',
  templateUrl: './change-legal-status.component.html',
  styles: [],
})
export class ChangeLegalStatusComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      corporate: [null, [Validators.required]],
      executive: [null, [Validators.required]],
      receiver: [null, [Validators.required]],
      position: [null, [Validators.required]],
      affair: [null, [Validators.required]],
      protection: [null, [Validators.required]],
      justify: [null, [Validators.required]],
      dateProvide: [null, [Validators.required]],
      orderProvide: [null, [Validators.required]],
      status: [null, [Validators.required]],
      signed: [null],
    });
    if (this.allotment != null) {
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
