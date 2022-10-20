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
import { ICabms } from 'src/app/core/models/administrative-processes/siab-sami-interaction/cabms.model';
import { cabmsData } from './data';

@Component({
  selector: 'app-cabms-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './cabms-shared.component.html',
  styles: [
  ]
})
export class CabmsSharedComponent extends BasePage implements OnInit {
  
  @Input() form: FormGroup;
  @Input() cabmsField: string = 'cabms';

  @Input() showCabms: boolean = true;
  //If Form PatchValue
  @Input() patchValue: boolean= false;

  items = new DefaultSelect<ICabms>();

  constructor(/*private service: WarehouseService*/) {
    super();
  }

  ngOnInit(): void {}

  getCabms(params: ListParams) {
    //Provisional data
    let data = cabmsData;
    let count = data.length;
    this.items = new DefaultSelect(data, count);
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

  onCabmsChange(type: any) {
    if(this.patchValue){
      this.form.patchValue({
        cabmsId: type.cabmsId,
        category: type.category,
        itemDescription: type.itemDescription,
        partId: type.partId,
        opcode: type.opcode,
        opDescription: type.opDescription,
      });
    }

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

