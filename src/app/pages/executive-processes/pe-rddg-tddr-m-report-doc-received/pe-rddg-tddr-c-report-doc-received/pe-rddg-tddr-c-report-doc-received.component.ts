import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pe-rddg-tddr-c-report-doc-received',
  templateUrl: './pe-rddg-tddr-c-report-doc-received.component.html',
  styles: [
  ]
})
export class PeRddgTddrCReportDocReceivedComponent implements OnInit {

  form: FormGroup = new FormGroup({}); 

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      report: ['', [Validators.required]],
    });
  }

}
