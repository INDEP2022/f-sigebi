import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bank-accounts-insured',
  templateUrl: './bank-accounts-insured.component.html',
  styles: [],
})
export class BankAccountsInsuredComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      subdelegation: [null, Validators.required],

      currency: [null, Validators.required],
      bank: [null, Validators.required],

      depositFrom: [null, Validators.required],
      depositTo: [null, Validators.required],
    });
  }
}
