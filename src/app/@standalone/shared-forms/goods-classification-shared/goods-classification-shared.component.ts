import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
//import { GoodClassificationService } from 'src/app/core/services/catalogs/good-classification.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IGoodClassification } from 'src/app/core/models/catalogs/good-classification.model';
import { goodsClassData } from './data';

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
  @Input() label = 'Classificación de Bienes';
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
