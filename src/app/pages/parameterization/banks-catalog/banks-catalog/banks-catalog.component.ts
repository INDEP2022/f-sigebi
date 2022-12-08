import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-banks-catalog',
  templateUrl: './banks-catalog.component.html',
  styles: [],
})
export class BanksCatalogComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  sought_bank: boolean = true;
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      bank: [null, [Validators.required]],
      nameBank: [null, [Validators.required]],
      account: [null, [Validators.required]],
      square: [null, [Validators.required]],
      branch: [null, [Validators.required]],
      currency: [null, [Validators.required]],
      accountType: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      accountTransferred: [null, [Validators.required]],
      square_I: [null, [Validators.required]],
      branch_I: [null, [Validators.required]],
      currency_I: [null, [Validators.required]],
      accountType_I: [null, [Validators.required]],
    });
  }
}
