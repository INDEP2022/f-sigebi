import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-regular-billing-tab',
  templateUrl: './regular-billing-tab.component.html',
  styles: [],
})
export class RegularBillingTabComponent implements OnInit {
  event: number;
  invoices: any[] = [];
  count: number = 0;
  filter: any = null;
  form: FormGroup;
  values: any = {
    sum1: 0,
    sum2: 0,
    sum3: 0,
    sum4: 0,
    sum5: 0,
    sum6: 0,
  };
  tabSet: number;
  @ViewChild('myTabset', { static: true }) tabset: TabsetComponent;
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

  async cambiarTab(view: { numberTab: number; event: any }) {
    if (view) {
      this.event = view.event;
      this.tabset.tabs[view.numberTab].active = true;
    }
  }
}
