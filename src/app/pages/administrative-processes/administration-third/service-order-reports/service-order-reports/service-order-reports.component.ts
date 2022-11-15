import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      strategy: [null, Validators.required],
      report: [null, Validators.required],
    });
  }
}
