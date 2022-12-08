import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { ERRORS_NULL_DATA_COLUMNS } from './errors-null-data-columns';

@Component({
  selector: 'app-errors-null-data',
  templateUrl: './errors-null-data.component.html',
  styles: [],
})
export class ErrorsNullDataComponent extends BasePage implements OnInit {
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...ERRORS_NULL_DATA_COLUMNS },
    };
  }

  ngOnInit(): void {}

  data = [
    {
      event: 13244,
      good: 7984,
      allotment: 124,
      errorDescription: 'Error 01',
      invoice: 'FACT01',
    },
    {
      event: 456,
      good: 3214,
      allotment: 124,
      errorDescription: 'Error 02',
      invoice: 'FACT02',
    },
    {
      event: 78452,
      good: 546,
      allotment: 94,
      errorDescription: 'Error 03',
      invoice: 'FACT02',
    },
  ];
}
