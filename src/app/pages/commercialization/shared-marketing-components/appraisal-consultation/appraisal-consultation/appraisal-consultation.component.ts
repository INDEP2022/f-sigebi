import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import {
  ApppraisalConsultationSumForm,
  AppraisalConsultationForm,
} from '../utils/appraisal-consultation-form';

@Component({
  selector: 'app-appraisal-consultation',
  templateUrl: './appraisal-consultation.component.html',
  styles: [],
})
export class AppraisalConsultationComponent extends BasePage implements OnInit {
  form = this.fb.group(new AppraisalConsultationForm());
  direction: 'M' | 'I' = 'M';
  $search = new Subject<void>();
  sumForm = this.fb.group(new ApppraisalConsultationSumForm());

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute) {
    super();
    const screen = this.activatedRoute.snapshot.data['screen'];
    this.direction = screen == 'FCOMERCONSAVALUO' ? 'M' : 'I';
  }

  ngOnInit(): void {}
}
