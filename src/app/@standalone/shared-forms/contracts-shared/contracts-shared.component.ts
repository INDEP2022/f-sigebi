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
import { IContract } from 'src/app/core/models/administrative-processes/contract.model';
import { dataContracts } from './data';

@Component({
  selector: 'app-contracts-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './contracts-shared.component.html',
  styles: [],
})
export class ContractsSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() contractField: string = 'contract';

  @Input() showContracts: boolean = true;

  params = new BehaviorSubject<ListParams>(new ListParams());
  contracts = new DefaultSelect<IContract>();

  constructor() {
    super();
  }

  ngOnInit(): void {}

  getContracts(params: ListParams) {
    //Provisional data
    let data = dataContracts;
    let count = data.length;
    this.contracts = new DefaultSelect(data, count);

    /*this.service.getAll(params).subscribe(
      data => {
        this.Contracts = new DefaultSelect(data.data, data.count);
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

  onContractsChange(type: any) {
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
