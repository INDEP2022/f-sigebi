import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import {
  DOCUMENTS_REQUIREMENTS_VERIFICATION_COLUMNS,
  DOCUMENTS_REQUIREMENTS_VERIFICATION_EXAMPLE_DATA,
} from './documents-requirements-verification-columnts';

@Component({
  selector: 'app-dr-documents-requirements-verification',
  templateUrl: './dr-documents-requirements-verification.component.html',
  styles: [],
})
export class DrDocumentsRequirementsVerificationComponent
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
      causaPenal: [null],
      tipoDicta: [null],
      oficio: [null],
      volante: [null],
      averPrevia: [null],
      indiciado: [null],
      bien: [null],
      descripcion: [null],
      statusBien: [null],
      estatusDicta: [null],
      fechAseg: [null],
      observaciones: [null],
    });
  }
}
