import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-registration-of-goods-policy',
  templateUrl: './registration-of-goods-policy.component.html',
  styles: [],
})
export class RegistrationOfGoodsPolicyComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, Validators.required],
      description: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      amount: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      cvePolicy: [
        null,
        Validators.required,
        Validators.pattern(KEYGENERATION_PATTERN),
      ],
      dateOfAdmission: [null, Validators.required],
      premiumAmount: [null, Validators.required],
    });
  }

  save() {
    console.log(this.form.value);
  }
}
