import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOODS_TRACKER_CRITERIAS } from '../utils/goods-tracker-criterias.enum';
import { GoodTrackerForm } from '../utils/goods-tracker-form';

@Component({
  selector: 'app-goods-tracker',
  templateUrl: './goods-tracker.component.html',
  styleUrls: ['./goods-tracker.component.scss'],
})
export class GoodsTrackerComponent extends BasePage implements OnInit {
  filterCriterias = GOODS_TRACKER_CRITERIAS;
  form = this.fb.group(new GoodTrackerForm());
  showTable: boolean = false;
  params = new FilterParams();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {}

  searchGoods(params: any) {
    this.params.removeAllFilters();
    const form = this.form.value;
    for (const [key, value] of Object.entries(form)) {
      if (value) {
        this.params.addFilter(key, value);
      }
    }
    console.log(this.params.getParams());

    this.showTable = true;
  }
}
