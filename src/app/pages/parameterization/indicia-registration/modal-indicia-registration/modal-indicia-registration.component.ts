import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RFCCURP_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-modal-indicia-registration',
  templateUrl: './modal-indicia-registration.component.html',
  styles: [],
})
export class ModalIndiciaRegistrationComponent implements OnInit {
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
      numberIndiciado: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      curp: [null, [Validators.required, Validators.pattern(RFCCURP_PATTERN)]],
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
