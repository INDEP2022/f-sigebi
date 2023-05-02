import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
import { BehaviorSubject } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
/**import SERVICE**/
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IPolicy } from 'src/app/core/models/administrative-processes/policy.model';
import { dataPolicies } from './data';

@Component({
  selector: 'app-policies-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './policies-shared.component.html',
  styles: [],
})
export class PoliciesSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() policyField: string = 'policy';

  @Input() showPolicies: boolean = true;

  params = new BehaviorSubject<ListParams>(new ListParams());
  policies = new DefaultSelect<IPolicy>();

  constructor() {
    super();
  }

  ngOnInit(): void {}

  getPolicies(params: ListParams) {
    //Provisional data
    let data = dataPolicies;
    let count = data.length;
    this.policies = new DefaultSelect(data, count);

    /*this.service.getAll(params).subscribe(
      data => {
        this.Policies = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );*/
  }

  onPoliciesChange(type: any) {
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
