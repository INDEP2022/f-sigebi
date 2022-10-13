import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pe-rddg-tddr-c-report-doc-received',
  templateUrl: './pe-rddg-tddr-c-report-doc-received.component.html',
  styles: [
  ]
})
export class PeRddgTddrCReportDocReceivedComponent implements OnInit {

  today: Date;
  maxDate: Date;
  minDate: Date;

  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) {
      this.today = new Date();
      this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
      // this.maxDate = new Date(this.today.getFullYear(), this.today.getMonth(), 25);
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      rangeDate: ['', [Validators.required]],
      // fromDate: ['', [Validators.required]],
      // toDate: ['', [Validators.required]],
      report: ['', [Validators.required]],
    });
  }

}
