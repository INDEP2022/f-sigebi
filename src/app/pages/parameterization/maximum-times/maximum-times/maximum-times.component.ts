import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-maximum-times',
  templateUrl: './maximum-times.component.html',
  styles: [],
})
export class MaximumTimesComponent implements OnInit {
  maximumTimesForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.maximumTimesForm = this.fb.group({
      type: [null, [Validators.required]],
      term: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      activate: [null, [Validators.required]],
      user: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      date: [null, [Validators.required]],
    });
  }
}
