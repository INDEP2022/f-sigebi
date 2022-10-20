import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AbstractControl, FormGroup } from '@angular/forms';
//Rxjs
import { BehaviorSubject, takeUntil } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
//import { MeasurementUnitsService } from 'src/app/core/services/catalogs/measurement-units.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IMeasurementUnits } from 'src/app/core/models/catalogs/measurement-units.model';
import { unitsData } from './data';

@Component({
  selector: 'app-measurement-units-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './measurement-units-shared.component.html',
  styles: [],
})
export class MeasurementUnitsSharedComponent
  extends BasePage
  implements OnInit
{
  @Input() form: FormGroup;
  @Input() measurementUnitField: string = 'measurementUnit';

  @Input() showMeasurementUnits: boolean = true;

  measurementUnits = new DefaultSelect<IMeasurementUnits>();

  get measurementUnit() {
    return this.form.get(this.measurementUnitField);
  }

  constructor(/*private service: WarehouseService*/) {
    super();
  }

  ngOnInit(): void {}

  getUnits(params: ListParams) {
    //Provisional data
    let data = unitsData;
    let count = data.length;
    this.measurementUnits = new DefaultSelect(data, count);
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

  onUnitsChange(type: any) {
    //this.resetFields([this.subdelegation]);
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
