import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

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
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subdelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      currency: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      bank: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],

      depositFrom: [null, Validators.required],
      depositTo: [null, Validators.required],

      fileFrom: [null, Validators.required],
      fileTo: [null, Validators.required],
    });
  }
}
