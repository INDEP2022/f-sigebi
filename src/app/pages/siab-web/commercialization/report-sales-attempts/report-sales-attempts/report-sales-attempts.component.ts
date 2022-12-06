import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-report-sales-attempts',
  templateUrl: './report-sales-attempts.component.html',
  styles: [],
})
export class ReportSalesAttemptsComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  get filterGoods() {
    return this.form.get('filterGoods');
  }

  get filterText() {
    return this.form.get('filterText');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm2();
  }

  private prepareForm2() {
    this.form = this.fb.group({
      typeGood: [],
      filterGoods: [],
      filterText: [],
    });
  }

  chargeFile(event: any) {}
}
