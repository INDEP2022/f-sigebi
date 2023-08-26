import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-consultation-of-records',
  templateUrl: './consultation-of-records.component.html',
  styles: [],
})
export class ConsultationOfRecordsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      expedient: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(15),
        ],
      ],
    });
  }

  generateDocuments() {}
}
