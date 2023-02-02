import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-effective-numerary-devolution',
  templateUrl: './effective-numerary-devolution.component.html',
  styles: [],
})
export class EffectiveNumeraryDevolutionComponent implements OnInit {
  form: FormGroup;
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

      fileFrom: [null, Validators.required],
      fileTo: [null, Validators.required],
      goodFrom: [null, Validators.required],
      goodTo: [null, Validators.required],
      devolutionFrom: [null, Validators.required],
      devolutionTo: [null, Validators.required],
    });
  }
}
