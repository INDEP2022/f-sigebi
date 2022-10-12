import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface IReportRanges {
  code: 'daily' | 'monthly' | 'yearly';
  name: string;
}

@Component({
  selector: 'app-dr-report',
  templateUrl: './dr-report.component.html',
  styles: [],
})
export class DrReportComponent implements OnInit {
  reportForm: FormGroup;
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

  rangeChange(range: 'daily' | 'monthly' | 'yearly') {
    this.from.setValue(null);
    this.to.setValue(null);
  }
}
