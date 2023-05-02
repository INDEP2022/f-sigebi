import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  CAPTURE_LINES,
  CAPTURE_LINES_CLIENTS,
} from './report-batches-pending-colums';

@Component({
  selector: 'app-report-batches-pending',
  templateUrl: './report-batches-pending.component.html',
  styles: [],
})
export class reportBatchesPendingComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  show: boolean = false;

  settings2;
  constructor(private fb: FormBuilder) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...CAPTURE_LINES },
    };

    this.settings2 = {
      ...this.settings,
      actions: false,
      columns: { ...CAPTURE_LINES_CLIENTS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      event: [null, [Validators.required]],
    });
  }

  data: any;
}
