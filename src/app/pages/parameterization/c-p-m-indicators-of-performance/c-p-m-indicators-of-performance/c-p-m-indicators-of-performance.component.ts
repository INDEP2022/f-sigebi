import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  INDICATORSOFPERFORMANCE_COLUMNS,
  INDICATORSPERFORMANCE_COLUMNS,
} from './c-p-m-indicators-of-performance-columns';

@Component({
  selector: 'app-c-p-m-indicators-of-performance',
  templateUrl: './c-p-m-indicators-of-performance.component.html',
  styles: [],
})
export class CPMIndicatorsOfPerformanceComponent
  extends BasePage
  implements OnInit
{
  indicatorsOfPerformanceForm: FormGroup;
  settings2 = { ...this.settings, actions: false };

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: INDICATORSOFPERFORMANCE_COLUMNS,
    };
    this.settings2.columns = INDICATORSPERFORMANCE_COLUMNS;
  }
  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.indicatorsOfPerformanceForm = this.fb.group({
      beginning: [null, Validators.required],
      limitDays: [null, Validators.required],
      timeLimit: [null, Validators.required],
      contractZone: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });
  }
}
