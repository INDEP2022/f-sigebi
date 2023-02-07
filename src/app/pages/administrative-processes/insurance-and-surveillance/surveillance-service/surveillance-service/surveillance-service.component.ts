import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SURVEILLANCE_SERVICE_COLUMNS } from './surveillance-service-columns';

@Component({
  selector: 'app-surveillance-service',
  templateUrl: './surveillance-service.component.html',
  styles: [],
})
export class SurveillanceServiceComponent extends BasePage implements OnInit {
  form: FormGroup;

  goods: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  delegations = new DefaultSelect();

  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = SURVEILLANCE_SERVICE_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      process: [null, Validators.required],
      period: [null, Validators.required],
      from: [null, Validators.required],
      to: [null, Validators.required],
      total: [null, Validators.required, Validators.pattern(STRING_PATTERN)],
      processTwo: [null, Validators.required],
      fromTwo: [null, Validators.required],
      toTwo: [null, Validators.required],
    });
  }

  save() {
    console.log(this.form.value);
  }

  getDelegations(evt: any) {}
}
