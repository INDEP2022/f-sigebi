import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { POLICY_COLUMNS } from './polici-maintenance-column';

@Component({
  selector: 'app-policy-maintenance',
  templateUrl: './policy-maintenance.component.html',
  styles: [],
})
export class PolicyMaintenanceComponent extends BasePage implements OnInit {
  goods: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = POLICY_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      policy: [null, Validators.required],
      description: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      insurance: [
        null,
        Validators.required,
        Validators.pattern(STRING_PATTERN),
      ],
      startDate: [null, Validators.required],
      finishedDate: [null, Validators.required],
      amount: [null, Validators.required],
      amountPro: [null, Validators.required],
      iva: [null, Validators.required],
      changeType: [null, Validators.required],
      service: [null, Validators.required],
      origin: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
    });
  }
}
