import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-prorrateo-goods-surveillance',
  templateUrl: './prorrateo-goods-surveillance.component.html',
  styles: [],
})
export class ProrrateoGoodsSurveillanceComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      cveContract: [
        null,
        Validators.required,
        Validators.pattern(KEYGENERATION_PATTERN),
      ],
      movementType: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      reportNumber: [null, Validators.required],
      startDate: [null, Validators.required],
      finishedDate: [null, Validators.required],
      applicationDate: [null, Validators.required],
      requestArea: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      entregaPerson: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      entregaArea: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      receptionDate: [null, Validators.required],
      requestPerson: [null, Validators.required],
      requestSign: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      userSign: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      entregaMotivo: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      observations: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      prorrateo: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      zone: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
    });
  }
}
