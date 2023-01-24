import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
//import { GoodTypeService } from 'src/app/core/services/catalogs/good-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IGoodStatus } from 'src/app/core/models/catalogs/good-status.model';
import { goodsStatuData } from './data';

@Component({
  selector: 'app-goods-status-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './goods-status-shared.component.html',
  styles: [],
})
export class GoodsStatusSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() goodStatusField: string = 'goodStatus';

  @Input() showGoodStatus: boolean = true;

  status = new DefaultSelect<IGoodStatus>();

  get goodStatus() {
    return this.form.get(this.goodStatusField);
  }

  constructor(/*private service: WarehouseService*/) {
    super();
  }

  ngOnInit(): void {}

  getGoodStatus(params: ListParams) {
    //Provisional data
    let data = goodsStatuData;
    let count = data.length;
    this.status = new DefaultSelect(data, count);
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

  onGoodStatusChange(type: any) {
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
