import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from '../../../../../core/interfaces/model-form';

@Component({
  selector: 'app-sampling-detail-review-results',
  templateUrl: './sampling-detail-review-results.component.html',
  styles: [],
})
export class SamplingDetailReviewResultsComponent implements OnInit {
  @Input() data: any = [];
  detailForm: ModelForm<any>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.detailForm = this.fb.group({
      noSampling: ['10025'],
      noContract: ['124'],
      geographicalArea: [null],
      periodSampling: [null],
      regionalDelegation: [null],
    });
  }
}
