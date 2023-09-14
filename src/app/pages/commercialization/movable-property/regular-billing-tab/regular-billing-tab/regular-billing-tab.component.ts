import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-regular-billing-tab',
  templateUrl: './regular-billing-tab.component.html',
  styles: [],
})
export class RegularBillingTabComponent implements OnInit {
  event: number;
  invoices: any[] = [];
  count: number = 0;
  filter: any = {};
  form: FormGroup;
  values: any = {
    sum1: 0,
    sum2: 0,
    sum3: 0,
    sum4: 0,
    sum5: 0,
    sum6: 0,
  };

  constructor() {}

  ngOnInit(): void {}

  getEvent(view: { count: number; val: number; filter: any; data: any[] }) {
    if (view) {
      this.event = view.val;
      this.invoices = view.data;
      this.count = view.count;
      this.filter = view.filter;
    }
  }
}
