import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-reasons-model',
  templateUrl: './reasons-model.component.html',
  styles: [],
})
export class ReasonsModelComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      reasons1: [null, Validators.required],
      reasons2: [null, Validators.required],
      reasons3: [null, Validators.required],
      reasons4: [null, Validators.required],
      reasons5: [null, Validators.required],
      reasons6: [null, Validators.required],
      reasons7: [null, Validators.required],
      reasons8: [null, Validators.required],
      reasons9: [null, Validators.required],
      reasons10: [null, Validators.required],
      reasons11: [null, Validators.required],
      reasons12: [null, Validators.required],
      reasons13: [null, Validators.required],
      reasons14: [null, Validators.required],
      reasons15: [null, Validators.required],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
