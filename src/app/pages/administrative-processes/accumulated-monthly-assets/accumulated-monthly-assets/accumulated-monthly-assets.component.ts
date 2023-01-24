import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-accumulated-monthly-assets',
  templateUrl: './accumulated-monthly-assets.component.html',
  styles: [],
})
export class AccumulatedMonthlyAssetsComponent implements OnInit {
  accumulatedMonthlyAssetsForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.accumulatedMonthlyAssetsForm = this.fb.group({
      delegation: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      subDelegation: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      year: [null, Validators.required],
      ofMonth: [null, Validators.required],
      toMonth: [null, Validators.required],
    });
  }
}
