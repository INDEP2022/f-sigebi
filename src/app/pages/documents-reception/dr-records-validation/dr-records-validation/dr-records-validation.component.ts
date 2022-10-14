import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { RECORDS_VALDIATION_COLUMNS } from './records-validation-columns';

@Component({
  selector: 'app-dr-records-validation',
  templateUrl: './dr-records-validation.component.html',
  styles: [],
})
export class DrRecordsValidationComponent implements OnInit {
  form: FormGroup;
  settings = { ...TABLE_SETTINGS, actions: false };
  constructor(private fb: FormBuilder) {
    this.settings.columns = RECORDS_VALDIATION_COLUMNS;
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
