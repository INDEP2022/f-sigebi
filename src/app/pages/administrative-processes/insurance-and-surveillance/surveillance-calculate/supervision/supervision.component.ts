import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-supervision',
  templateUrl: './supervision.component.html',
  styles: [],
})
export class SupervisionComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      state: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      supervisors: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      zone: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      inmueble: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      cost: [null],
      total: [null],
    });
  }

  save() {
    console.log(this.form.value);
  }
}
