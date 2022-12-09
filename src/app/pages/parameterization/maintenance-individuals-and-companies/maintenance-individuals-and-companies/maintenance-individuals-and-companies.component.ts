import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  PHONE_PATTERN,
  RFCCURP_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-maintenance-individuals-and-companies',
  templateUrl: './maintenance-individuals-and-companies.component.html',
  styles: [],
})
export class MaintenanceIndividualsAndCompaniesComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      numberPerson: [null, [Validators.required]],
      surname: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      names: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      noOutside: [null, [Validators.required]],
      noInside: [null, [Validators.required]],
      colonia: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      zipCode: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      observation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      rfc: [null, [Validators.required, Validators.pattern(RFCCURP_PATTERN)]],
      delegation: [null, [Validators.required]],
      federative: [null, [Validators.required]],
      curriculum: [null, [Validators.required]],
      personMoral: [null, [Validators.required]],
      personPhysics: [null, [Validators.required]],
      curp: [null, [Validators.required, Validators.pattern(RFCCURP_PATTERN)]],
      moneyOrder: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      profile: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      representative: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      deed: [null, [Validators.required]],
    });
  }

  saved() {
    console.log(this.form.value);
  }
}
