import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-loss-of-goods-policy',
  templateUrl: './loss-of-goods-policy.component.html',
  styles: [],
})
export class LossOfGoodsPolicyComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, Validators.required],
      description: [null, Validators.required],
      amount: [null, Validators.required],
      cvePolicy: [null, Validators.required],
      dateOfAdmission: [null, Validators.required],
      premiumAmount: [null, Validators.required],
      dailyFactor: [null, Validators.required],
      dateOfTermination: [null, Validators.required],
    });
  }

  save() {
    console.log(this.form.value);
  }
}
