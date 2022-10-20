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
/**import SERVICE**/
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IGood } from 'src/app/core/models/catalogs/goods.model';
import { goodsData } from './data';

@Component({
  selector: 'app-goods-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './goods-shared.component.html',
  styles: [
  ]
})
export class GoodsSharedComponent extends BasePage implements OnInit {

  @Input() form: FormGroup;
  @Input() goodField: string = 'goodId';

  @Input() showGoods: boolean = true;
  //If Form PatchValue
  @Input() patchValue: boolean= false;

  params = new BehaviorSubject<ListParams>(new ListParams());
  goods = new DefaultSelect<IGood>();

  constructor() {
    super();
  }

  ngOnInit(): void {}

  getGoods(params: ListParams) {
    //Provisional data
    let data = goodsData;
    let count = data.length;
    this.goods = new DefaultSelect(data, count);

    /*this.service.getAll(params).subscribe(
      data => {
        this.goods = new DefaultSelect(data.data, data.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      () => {}
    );*/
  }

  onGoodsChange(type: any) {
    if(this.patchValue){
      this.form.patchValue({
        goodId: type.goodId,
        goodDescription: type.goodDescription
      });
    }

    this.form.updateValueAndValidity();
    //this.resetFields([this.subgood]);
    //this.subgoods = new DefaultSelect();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      //field.setValue(null);
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
