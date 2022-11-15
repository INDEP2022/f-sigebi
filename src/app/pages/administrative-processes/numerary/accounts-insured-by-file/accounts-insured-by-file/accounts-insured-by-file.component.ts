import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-accounts-insured-by-file',
  templateUrl: './accounts-insured-by-file.component.html',
  styles: [],
})
export class AccountsInsuredByFileComponent implements OnInit {
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

      fileFrom: [null, Validators.required],
      fileTo: [null, Validators.required],
    });
  }
}
