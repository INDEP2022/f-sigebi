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
import { IMeasurementUnits } from 'src/app/core/models/catalogs/measurement-units.model';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';

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

  constructor(private service: StrategyServiceService) {
    super();
  }

  ngOnInit(): void {
    this.getUnits(new ListParams());
  }

  getUnits(params: ListParams) {
    //Provisional data
    /* let data = unitsData;
    let count = data.length;
    console.log(data);
    this.measurementUnits = new DefaultSelect(data, count); */
    // if (
    //   this.measurementUnits.data.length === this.measurementUnits.count &&
    //   this.measurementUnits.data.length !== 0
    // ) {
    //   this.measurementUnits.reset = true;
    //   return;
    // }
    this.service.getMedUnits(params).subscribe(
      data => {
        console.log(data);
        this.measurementUnits = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.measurementUnits = new DefaultSelect();
        /* console.log(err);
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.error.message;
        }
        this.measurementUnits = new DefaultSelect([], 0); */
        // this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  changeValue(event: any) {
    console.log(event);
  }

  updateAndValidate() {
    this.form.updateValueAndValidity();
  }

  onUnitsChange(type: any) {
    //this.resetFields([this.subdelegation]);
    this.getUnits(new ListParams());
    this.updateAndValidate();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.updateAndValidate();
  }
}
