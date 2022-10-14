import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-pe-ibs-d-a-c-report-registration-module',
  templateUrl: './pe-ibs-d-a-c-report-registration-module.component.html',
  styles: [],
})
export class PeIbsDACReportRegistrationModuleComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  select = new DefaultSelect();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      delegation: ['', [Validators.required]],
      subdelegation: ['', [Validators.required]],
      // fromDate: ['', [Validators.required]],
      // toDate: ['', [Validators.required]],
      rangeDate: ['', [Validators.required]],
    });
  }

  send() {
    console.log(this.form.value);
  }
}
