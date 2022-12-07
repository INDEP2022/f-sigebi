import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

interface IReportRanges {
  code: 'daily' | 'monthly' | 'yearly';
  name: string;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styles: [],
})
export class ReportComponent implements OnInit {
  reportForm: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig> = {
    minMode: 'month',
    adaptivePosition: true,
    dateInputFormat: 'MMMM YYYY',
  };
  ranges: IReportRanges[] = [
    { code: 'daily', name: 'Diario' },
    { code: 'monthly', name: 'Mensual' },
    { code: 'yearly', name: 'Anual' },
  ];

  get range() {
    return this.reportForm.get('range');
  }

  get from() {
    return this.reportForm.get('from');
  }

  get to() {
    return this.reportForm.get('to');
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.reportForm = this.fb.group({
      delegation: [null, [Validators.required]],
      subdelegation: [null, [Validators.required]],
      from: [null, [Validators.required]],
      to: [null, [Validators.required]],
      range: ['daily', [Validators.required]],
    });
  }

  save() {}

  rangeChange() {
    this.changeCalendarFormat();
    this.from.setValue(null);
    this.to.setValue(null);
  }

  changeCalendarFormat() {
    if (this.range.value === 'yearly') {
      this.datePickerConfig.minMode = 'year';
      this.datePickerConfig.dateInputFormat = 'YYYY';
    } else {
      this.datePickerConfig.minMode = 'month';
      this.datePickerConfig.dateInputFormat = 'MMMM YYYY';
    }
  }
}
