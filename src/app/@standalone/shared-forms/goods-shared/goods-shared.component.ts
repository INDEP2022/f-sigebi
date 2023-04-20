import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
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
export class GoodsSharedComponent extends BasePage implements OnInit {
  @Input() label: string = 'Bienes';
  @Input() form: FormGroup;
  @Input() goodField: string = 'goodId';

  @Input() showGoods: boolean = true;
  //If Form PatchValue
  @Input() patchValue: boolean = false;
  @Output() good = new EventEmitter<IGood>();
  params = new BehaviorSubject<ListParams>(new ListParams());
  goods = new DefaultSelect<IGood>();

  constructor(private readonly goodServices: GoodService) {
    super();
  }

  ngOnInit(): void {}

  getGoods(params: ListParams) {
    //Provisional data
    /* let data = goodsData;
    let count = data.length;
    this.goods = new DefaultSelect(data, count);
 */
    this.goodServices.getAll(params).subscribe(
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
    );
  }

  onGoodsChange(type: IGood) {
    if (this.patchValue) {
      this.form.patchValue({
        goodId: type.goodId,
        goodDescription: type.goodDescription,
      });
    }
    this.good.emit(type);
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
