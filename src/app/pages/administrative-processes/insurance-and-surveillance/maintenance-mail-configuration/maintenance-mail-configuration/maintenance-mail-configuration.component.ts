import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_CONFIG_COLUMNS } from './mail-configuration-columns';

@Component({
  selector: 'app-maintenance-mail-configuration',
  templateUrl: './maintenance-mail-configuration.component.html',
  styles: [],
})
export class MaintenanceMailConfigurationComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;

  emailConfig: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(private fb: FormBuilder) {
    super();
    this.settings.columns = EMAIL_CONFIG_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      identifier: [null, Validators.required],
      asunto: [null, Validators.required],
      body: [null, Validators.required],
      status: [null, Validators.required],
    });
  }

  save() {
    console.log(this.form.value);
  }
}
