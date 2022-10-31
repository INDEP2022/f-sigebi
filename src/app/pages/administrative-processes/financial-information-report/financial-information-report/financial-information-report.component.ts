import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-financial-information-report',
  templateUrl: './financial-information-report.component.html',
  styles: [],
})
export class FinancialInformationReportComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      date1: [null, Validators.required],
      date2: [null, Validators.required],
      date3: [null, Validators.required],
      noBien: [null, Validators.required],
    });
  }
}
