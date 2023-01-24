import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-insured-numerary-account',
  templateUrl: './insured-numerary-account.component.html',
  styles: [],
})
export class InsuredNumeraryAccountComponent implements OnInit {
  insuredNumeraryAccountForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.insuredNumeraryAccountForm = this.fb.group({
      process: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
    });
  }
}
