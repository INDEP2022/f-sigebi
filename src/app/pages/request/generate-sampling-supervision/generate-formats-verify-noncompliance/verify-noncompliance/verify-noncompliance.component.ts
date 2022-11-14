import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ModelForm } from '../../../../../core/interfaces/model-form';

@Component({
  selector: 'app-verify-noncompliance',
  templateUrl: './verify-noncompliance.component.html',
  styleUrls: ['./verify-noncompliance.component.scss'],
})
export class VerifyNoncomplianceComponent implements OnInit {
  title: string = 'Verificación Incumplimiento 539';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  filterForm: ModelForm<any>;

  isEnableAnex: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFilterForm();
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      noManagement: [null],
      noInventory: [null],
      descriptionAsset: [null],
    });
  }

  turnSampling() {
    this.isEnableAnex = true;
  }
}
