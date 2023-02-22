import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

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
      account: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      square: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      branch: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      currency: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      accountType: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      accountTransferred: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      square_I: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      branch_I: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      currency_I: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      accountType_I: [null, [Validators.required]],
    });
  }
}
