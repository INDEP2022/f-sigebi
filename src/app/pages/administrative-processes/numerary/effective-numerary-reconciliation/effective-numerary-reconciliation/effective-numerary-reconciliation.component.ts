import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-effective-numerary-reconciliation',
  templateUrl: './effective-numerary-reconciliation.component.html',
  styles: [],
})
export class EffectiveNumeraryReconciliationComponent implements OnInit {
  form: FormGroup;
  total = '22,568.22';
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      subdelegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      currency: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      bank: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],

      fileFrom: [null, Validators.required],
      fileTo: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      total: [null, Validators.required],
    });
  }
}
