import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

import {
  DOCUMENTS_REQUIREMENTS_VERIFICATION_COLUMNS,
  DOCUMENTS_REQUIREMENTS_VERIFICATION_EXAMPLE_DATA,
} from './documents-requirements-verification-columnts';

@Component({
  selector: 'app-documents-requirements-verification',
  templateUrl: './documents-requirements-verification.component.html',
  styles: [],
})
export class DocumentsRequirementsVerificationComponent
  extends BasePage
  implements OnInit
{
  requirementsForm: FormGroup;
  data = DOCUMENTS_REQUIREMENTS_VERIFICATION_EXAMPLE_DATA;

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: { ...DOCUMENTS_REQUIREMENTS_VERIFICATION_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.requirementsForm = this.fb.group({
      expediente: [null, [Validators.required]],
      causaPenal: [null, Validators.pattern(STRING_PATTERN)],
      tipoDicta: [null, Validators.pattern(STRING_PATTERN)],
      oficio: [null, Validators.pattern(STRING_PATTERN)],
      volante: [null, Validators.pattern(STRING_PATTERN)],
      averPrevia: [null, Validators.pattern(STRING_PATTERN)],
      indiciado: [null, Validators.pattern(STRING_PATTERN)],
      bien: [null, Validators.pattern(STRING_PATTERN)],
      descripcion: [null, Validators.pattern(STRING_PATTERN)],
      statusBien: [null, Validators.pattern(STRING_PATTERN)],
      estatusDicta: [null, Validators.pattern(STRING_PATTERN)],
      fechAseg: [null],
      observaciones: [null, Validators.pattern(STRING_PATTERN)],
    });
  }
}
