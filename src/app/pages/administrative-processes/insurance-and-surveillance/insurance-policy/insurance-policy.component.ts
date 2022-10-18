import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-insurance-policy',
  templateUrl: './insurance-policy.component.html',
  styles: [],
})
export class InsurancePolicyComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      policy: [null, Validators.required],
      description: [null, Validators.required],
      insurance: [null, Validators.required],
      startDate: [null, Validators.required],
      finishedDate: [null, Validators.required],
      amount: [null, Validators.required],
      amountPro: [null, Validators.required],
      expenses: [null, Validators.required],
      iva: [null, Validators.required],
      changeType: [null, Validators.required],
      service: [null, Validators.required],
      other: [null],
      prorroga: [null],
      sustitution: [null],
      lastPolicy: [null],
    });
  }
}
