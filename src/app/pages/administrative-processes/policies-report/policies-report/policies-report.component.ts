import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-policies-report',
  templateUrl: './policies-report.component.html',
  styles: [],
})
export class PoliciesReportComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      policy: [null, Validators.required],
      startDate: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      policySinister: [null, Validators.required],
      startDateSinister: [null, Validators.required],
    });
  }

  save() {
    console.log(this.form.value);
  }
}
