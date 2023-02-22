import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

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
      typeAct: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      initialCategory: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      finalCategory: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
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
