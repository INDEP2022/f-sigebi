import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-data-dictum-form',
  templateUrl: './data-dictum-form.component.html',
  styles: [],
})
export class DataDictumFormComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      dictamenNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      dictamenDate: [null],
      judged: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      nullityTrial: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      noResolutionAdmin: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      contributor: [null, [Validators.pattern(STRING_PATTERN)]],
      address1: [null, [Validators.pattern(STRING_PATTERN)]],
      address2: [null, [Validators.pattern(STRING_PATTERN)]],
      legalRepresent: [null, [Validators.pattern(STRING_PATTERN)]],
      copySatRequired: [null],
    });
  }
}
