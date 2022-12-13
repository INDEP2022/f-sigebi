import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CLOSING_RECORDS_COLUMNS } from './closing-records-columns';

@Component({
  selector: 'app-closing-records',
  templateUrl: './closing-records.component.html',
  styles: [],
})
export class ClosingRecordsComponent extends BasePage implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: CLOSING_RECORDS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      tipoActa: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      cerrarActa: [null, [Validators.required]],
      observaciones: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}
