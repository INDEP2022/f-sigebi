import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

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
      reasons1: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      reasons2: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      reasons3: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      reasons4: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      reasons5: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      reasons6: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      reasons7: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      reasons8: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      reasons9: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      reasons10: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      reasons11: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      reasons12: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      reasons13: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      reasons14: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      reasons15: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
