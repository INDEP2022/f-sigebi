import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-insurance-policy',
  templateUrl: './insurance-policy.component.html',
  styles: [],
})
export class InsurancePolicyComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      policy: [null, Validators.required],
      description: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      insurance: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      startDate: [null, Validators.required],
      finishedDate: [null, Validators.required],
      amount: [null, Validators.required],
      amountPro: [null, Validators.required],
      expenses: [null, Validators.required],
      iva: [null, Validators.required],
      changeType: [null, Validators.required],
      service: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      other: [null],
      prorroga: [null],
      sustitution: [null],
      lastPolicy: [null],
    });
  }
}
