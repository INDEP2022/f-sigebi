import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-numerary-parameterization',
  templateUrl: './modal-numerary-parameterization.component.html',
  styles: [],
})
export class ModalNumeraryParameterizationComponent implements OnInit {
  title: string = 'TASA';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      typeAct: [null, [Validators.required]],
      initialCategory: [null, [Validators.required]],
      finalCategory: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }
  saved() {
    this.modalRef.hide();
  }
  close() {
    this.modalRef.hide();
  }
}
