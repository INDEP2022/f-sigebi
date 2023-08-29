import { Component, OnInit } from '@angular/core';

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
