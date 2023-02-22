import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  PHONE_PATTERN,
  RFCCURP_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-appraisal-institutions-modal',
  templateUrl: './appraisal-institutions-modal.component.html',
  styles: [],
})
export class AppraisalInstitutionsModalComponent implements OnInit {
  appraisalInstitutionsForm: FormGroup;
  title: string = 'Instituciones Valuadoras';
  edit: boolean = false;
  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.appraisalInstitutionsForm = this.fb.group({
      noAppraiser: [null, Validators.required],
      nameComplete: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      street: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      noExterior: [null, Validators.required],
      noInside: [null, Validators.required],
      postalCode: [null, Validators.required],
      colony: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      delegationMunicipality: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      federalEntity: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      rfc: [null, Validators.required, Validators.pattern(RFCCURP_PATTERN)],
      curp: [null, Validators.required, Validators.pattern(RFCCURP_PATTERN)],
      phone: [null, Validators.required, Validators.pattern(PHONE_PATTERN)],
      representative: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      observations: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
    });
  }
  close() {
    this.modalRef.hide();
  }
}
