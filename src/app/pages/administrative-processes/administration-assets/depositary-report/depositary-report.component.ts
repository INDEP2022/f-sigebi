import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-depositary-report',
  templateUrl: './depositary-report.component.html',
  styles: [],
})
export class DepositaryReportComponent implements OnInit {
  depositaryDataForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.depositaryDataForm = this.fb.group({
      reportDate: [null],
      report: [null],
    });
  }
}
