import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterParams } from './../../../common/repository/interfaces/list-params';
//Rxjs
import { BehaviorSubject } from 'rxjs';
//Params
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
/**import SERVICE**/
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { IGood } from 'src/app/core/models/catalogs/goods.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';

@Component({
  selector: 'app-goods-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './goods-shared.component.html',
  styles: [],
})
export class GoodsSharedComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() form: FormGroup;
  @Input() goodField: string = 'goodId';

  @Input() showGoods: boolean = true;
  //If Form PatchValue
  @Input() patchValue: boolean = false;
  @Input() classifGood: number;

  params = new BehaviorSubject<FilterParams>(new FilterParams());
  goods = new DefaultSelect<IGood>();

  constructor(private readonly service: GoodService) {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getGoods({ limit: 10, page: 1 });
  }

  ngOnInit(): void {}

  getGoods(params: ListParams) {
    //Provisional data
    // let data = goodsData;
    // let count = data.length;
    // this.goods = new DefaultSelect(data, count);
    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;
    if (this.classifGood) {
      data.addFilter('goodClassNumber', this.classifGood);
    }
    if (params.text != undefined && params.text != '') {
      data.addFilter('description', params.text);
    }
    this.service.getAllFilter(data.getParams()).subscribe({
      next: data => {
        this.goods = new DefaultSelect(data.data, data.count);
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }
        this.onLoadToast('error', 'Error', error);
      },
      complete: () => {},
    });
  }

  onGoodsChange(type: any) {
    if (this.patchValue) {
      this.form.patchValue({
        goodId: type.goodId,
        goodDescription: type.goodDescription,
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
