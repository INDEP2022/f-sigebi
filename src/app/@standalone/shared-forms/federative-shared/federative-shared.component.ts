import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFederative } from 'src/app/core/models/administrative-processes/siab-sami-interaction/federative.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { federativeData } from './data';

@Component({
  selector: 'app-federative-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './federative-shared.component.html',
  styles: [],
})
export class FederativeSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() federativeField: string = 'federative';

  @Input() showFederative: boolean = true;

  federative = new DefaultSelect<IFederative>();

  constructor(/*private service: WarehouseService*/) {
    super();
  }

  ngOnInit(): void {}

  getFederative(params: ListParams) {
    //Provisional data
    let data = federativeData;
    let count = data.length;
    this.federative = new DefaultSelect(data, count);
    /*this.service.getAll(params).subscribe(data => {
        this.status = new DefaultSelect(data.data,data.count);
      },err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);

      }, () => {}
    );*/
  }
  onFederativeChange(type: any) {
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
