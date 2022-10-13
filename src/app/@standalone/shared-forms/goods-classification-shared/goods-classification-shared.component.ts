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
//import { GoodClassificationService } from 'src/app/core/services/catalogs/good-classification.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IGoodClassification } from 'src/app/core/models/catalogs/good-classification.model';
import { goodsClassData } from './goodsClassData';

@Component({
  selector: 'app-goods-classification-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './goods-classification-shared.component.html',
  styles: [],
})
export class GoodsClasificationSharedComponent
  extends BasePage
  implements OnInit
{
  @Input() form: FormGroup;
  @Input() goodClassificationField: string = 'goodClassification';

  @Input() showGoodClassification: boolean = true;

  classifications = new DefaultSelect<IGoodClassification>();

  get goodClassification() {
    return this.form.get(this.goodClassificationField);
  }

  constructor(/*private service: WarehouseService*/) {
    super();
  }

  ngOnInit(): void {}

  getGoodClassification(params: ListParams) {
    //Provisional data
    let data = goodsClassData;
    let count = data.length;
    this.classifications = new DefaultSelect(data, count);
    /*this.service.getAll(params).subscribe(data => {
        this.classification = new DefaultSelect(data.data,data.count);
      },err => {
        let error = '';
        if (err.classification === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);

      }, () => {}
    );*/
  }

  onGoodClassificationChange(type: any) {
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
