import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

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
      surname: [null, [Validators.required]],
      names: [null, [Validators.required]],
      address: [null, [Validators.required]],
      noOutside: [null, [Validators.required]],
      noInside: [null, [Validators.required]],
      colonia: [null, [Validators.required]],
      zipCode: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      observation: [null, [Validators.required]],
      rfc: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      federative: [null, [Validators.required]],
      curriculum: [null, [Validators.required]],
      personMoral: [null, [Validators.required]],
      personPhysics: [null, [Validators.required]],
      curp: [null, [Validators.required]],
      moneyOrder: [null, [Validators.required]],
      profile: [null, [Validators.required]],
      representative: [null, [Validators.required]],
      deed: [null, [Validators.required]],
    });
  }

  saved() {
    console.log(this.form.value);
  }
}
