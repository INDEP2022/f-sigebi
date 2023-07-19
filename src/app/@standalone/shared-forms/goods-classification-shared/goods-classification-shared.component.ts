import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
//Params
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
//import { GoodClassificationService } from 'src/app/core/services/catalogs/good-classification.service';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';

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
  @Input() label = 'Clasificación de Bienes';
  @Input() form: FormGroup;
  @Input() goodClassificationField: string = 'goodClassification';

  @Input() showGoodClassification: boolean = true;

  classifications = new DefaultSelect<any>();

  get goodClassification() {
    return this.form.get(this.goodClassificationField);
  }

  constructor(private service: GoodSssubtypeService) {
    super();
    this.getGoodClassification(new ListParams());
  }

  ngOnInit(): void {}

  getGoodClassification(params: ListParams) {
    //Provisional data
    /* let data = goodsClassData;
    let count = data.length;
    this.classifications = new DefaultSelect(data, count); */
    const paramsF = new FilterParams();
    Number.isNaN(parseInt(params.text))
      ? paramsF.addFilter('description', params.text, SearchFilter.ILIKE)
      : paramsF.addFilter('numClasifGoods', parseInt(params.text));
    this.service.getAllSssubtype(paramsF.getParams()).subscribe(
      async data => {
        console.log(data);
        const newData = await Promise.all(
          data['data'].map((e: any) => {
            return {
              ...e,
              viewVal: `${e.numClasifGoods}-${e.description}`,
            };
          })
        );
        console.log(newData);

        this.classifications = new DefaultSelect(newData, data.count);
      },
      err => {
        let error = '';
        if (err.classification === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );
  }

  onGoodClassificationChange(type: any) {
    //this.resetFields([this.subdelegation]);
    this.form.updateValueAndValidity();
    console.log(this.form);
    console.log(type);
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
