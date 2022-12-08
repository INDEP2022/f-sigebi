import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-service-order-reports',
  templateUrl: './service-order-reports.component.html',
  styles: [],
})
export class ServiceOrderReportsComponent implements OnInit {
  serviceOrderReportsForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.serviceOrderReportsForm = this.fb.group({
      strategy: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      report: [null, Validators.required],
    });
  }
}
