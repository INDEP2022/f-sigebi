import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
//import { MeasurementUnitsService } from 'src/app/core/services/catalogs/measurement-units.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IRecord } from 'src/app/core/models/administrative-processes/record.model';
import { recordsData } from './data';

@Component({
  selector: 'app-records-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './records-shared.component.html',
  styles: [],
})
export class RecordsSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() recordField: string = 'record';

  @Input() showRecords: boolean = true;

  records = new DefaultSelect<IRecord>();

  constructor(/*private service: WarehouseService*/) {
    super();
  }

  ngOnInit(): void {}

  getRecords(params: ListParams) {
    //Provisional data
    let data = recordsData;
    let count = data.length;
    this.records = new DefaultSelect(data, count);
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

  onRecordsChange(type: any) {
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
