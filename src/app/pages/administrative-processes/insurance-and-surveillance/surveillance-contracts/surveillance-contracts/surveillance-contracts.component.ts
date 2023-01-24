import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-surveillance-contracts',
  templateUrl: './surveillance-contracts.component.html',
  styles: [],
})
export class SurveillanceContractsComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noContract: [null, Validators.required],
      startDate: [null, Validators.required],
      finishedDate: [null, Validators.required],
      provider: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      amountMin: [null, Validators.required],
      amountMax: [null, Validators.required],
      licitacion: [null, Validators.required],
      observations: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
    });
  }

  save() {
    console.log(this.form.value);
  }
}
