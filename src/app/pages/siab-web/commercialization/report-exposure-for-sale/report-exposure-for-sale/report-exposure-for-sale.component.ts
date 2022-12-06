import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-exposure-for-sale',
  templateUrl: './report-exposure-for-sale.component.html',
  styles: [],
})
export class ReportExposureForSaleComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm2();
  }

  private prepareForm2() {
    this.form = this.fb.group({
      radio: [null, [Validators.required]],
      typeGood: [null, [Validators.required]],
    });
  }

  chargeFile(event: any) {}
}
