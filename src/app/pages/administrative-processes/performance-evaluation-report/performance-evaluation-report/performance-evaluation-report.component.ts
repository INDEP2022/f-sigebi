import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-performance-evaluation-report',
  templateUrl: './performance-evaluation-report.component.html',
  styles: [],
})
export class PerformanceEvaluationReportComponent implements OnInit {
  performanceEvaluationReportForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.performanceEvaluationReportForm = this.fb.group({
      business: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ofMonth: [null, Validators.required],
      toMonth: [null, Validators.required],
    });
  }
}
