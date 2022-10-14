import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { CLOSING_RECORDS_COLUMNS } from './closing-records-columns';

@Component({
  selector: 'app-dr-closing-records',
  templateUrl: './dr-closing-records.component.html',
  styles: [],
})
export class DrClosingRecordsComponent implements OnInit {
  settings = { ...TABLE_SETTINGS, actions: false };
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.settings.columns = CLOSING_RECORDS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      tipoActa: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      cerrarActa: [null, [Validators.required]],
      observaciones: [null, [Validators.required]],
    });
  }
}
