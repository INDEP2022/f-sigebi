import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModelForm } from 'src/app/core/interfaces/model-form';

@Component({
  selector: 'app-real-estate-analytical-report',
  templateUrl: './real-estate-analytical-report.component.html',
  styles: [],
})
export class RealEstateAnalyticalReportComponent implements OnInit {
  businessCardForm: ModelForm<any>;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.businessCardForm = this.fb.group({
      noGoods: [null, Validators.required],
    });
  }
}
