import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
@Component({
  selector: 'app-register-attributes-types-modal',
  templateUrl: './register-attributes-types-modal.component.html',
  styles: [],
})
export class RegisterAttributesTypesModalComponent implements OnInit {
  title: string = 'Alta de atributos por tipo de bien';
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
      cve: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      description: [null, [Validators.required]],
      attributes: [null, [Validators.required]],
      typeDate: [null, [Validators.required]],
      longMax: [
        null,
        [
          Validators.required,
          Validators.maxLength(8),
          Validators.minLength(1),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      update: [null, [Validators.required]],
      unique: [null, [Validators.required]],
      requerid: [null, [Validators.required]],
      tableSupport: [null, [Validators.required]],
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
