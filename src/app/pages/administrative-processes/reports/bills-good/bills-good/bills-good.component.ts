import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-bills-good',
  templateUrl: './bills-good.component.html',
  styles: [],
})
export class BillsGoodComponent implements OnInit {
  billGoodForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.billGoodForm = this.fb.group({
      dateExpensesof: [null, Validators.required],
      dateExpensesto: [null, Validators.required],
      ofGood: [null, Validators.required],
      toGood: [null, Validators.required],
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subDelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      service: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      legalSituation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cost: [null, Validators.required],
    });
  }
}
