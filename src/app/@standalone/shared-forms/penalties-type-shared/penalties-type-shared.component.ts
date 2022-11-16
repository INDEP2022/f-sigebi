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
import { ITypePenalty } from 'src/app/core/models/administrative-processes/type-penalty';
import { TypePenaltiesData } from './data';

@Component({
  selector: 'app-penalties-type-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './penalties-type-shared.component.html',
  styles: [],
})
export class PenaltiesTypeSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() typePenaltyField: string = 'typePenalty';

  @Input() showTypePenalties: boolean = true;

  typePenalties = new DefaultSelect<ITypePenalty>();

  constructor(/*private service: WarehouseService*/) {
    super();
  }

  ngOnInit(): void {
    let penaltyId = this.form.controls[this.typePenaltyField].value;
    if (penaltyId !== null && this.form.contains('penaltyDescription')) {
      let penaltyD = this.form.controls['penaltyDescription'].value;
      this.typePenalties = new DefaultSelect([
        {
          id: penaltyId,
          description: penaltyD,
        },
      ]);
      this.form.updateValueAndValidity();
    }
  }

  getTypePenalties(params: ListParams) {
    //Provisional data
    let data = TypePenaltiesData;
    let count = data.length;
    this.typePenalties = new DefaultSelect(data, count);
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

  onTypePenaltiesChange(type: any) {
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
