import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-surveillance-calculate',
  templateUrl: './surveillance-calculate.component.html',
  styles: [],
})
export class SurveillanceCalculateComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      contract: [null, Validators.required],
      year: [null, Validators.required],
      month: [null, Validators.required],
    });
  }
}
