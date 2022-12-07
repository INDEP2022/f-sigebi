import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { RECORDS_VALDIATION_COLUMNS } from './records-validation-columns';

@Component({
  selector: 'app-records-validation',
  templateUrl: './records-validation.component.html',
  styles: [],
})
export class RecordsValidationComponent extends BasePage implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: RECORDS_VALDIATION_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noActa: [null, [Validators.required]],
      clave: [null, [Validators.required]],
    });
  }
}
