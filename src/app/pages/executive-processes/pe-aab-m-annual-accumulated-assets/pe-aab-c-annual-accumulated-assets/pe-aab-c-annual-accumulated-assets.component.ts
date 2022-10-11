import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NUMBERS_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-pe-aab-c-annual-accumulated-assets',
  templateUrl: './pe-aab-c-annual-accumulated-assets.component.html',
  styles: [
  ]
})
export class PeAabCAnnualAccumulatedAssetsComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      subDelegation: ['', [Validators.required]],
      fromDate: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern(NUMBERS_PATTERN), Validators.min(1950), Validators.max(2022)]],
      toDate: ['', [Validators.required, Validators.maxLength(4), Validators.minLength(4), Validators.pattern(NUMBERS_PATTERN), Validators.min(1950), Validators.max(2022)]],
    });
  }

}
