import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { LOAN_MONITOR_COLUMNS } from './loan-monitor-columns';

@Component({
  selector: 'app-loan-monitor',
  templateUrl: './loan-monitor.component.html',
  styles: [],
})
export class LoanMonitorComponent extends BasePage implements OnInit {
  form: FormGroup;
  data1: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: LOAN_MONITOR_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      file: [null, Validators.required],
      borrowedTo: [null, Validators.required],

      document: [null, Validators.required],
      adscritTo: [null, Validators.required],
    });
  }
}
