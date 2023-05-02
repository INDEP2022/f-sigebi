import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, skip, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  FilterMatchTracker,
  OperatorValues,
  TrackerValues,
} from '../utils/constants/filter-match';
import { GOODS_TRACKER_CRITERIAS } from '../utils/goods-tracker-criterias.enum';
import { GoodTrackerForm } from '../utils/goods-tracker-form';

@Component({
  selector: 'app-goods-tracker',
  templateUrl: './goods-tracker.component.html',
  styleUrls: ['./goods-tracker.component.scss'],
})
export class GoodsTrackerComponent extends BasePage implements OnInit {
  @ViewChild('scrollTable') scrollTable: ElementRef<HTMLDivElement>;
  filterCriterias = GOODS_TRACKER_CRITERIAS;
  form = this.fb.group(new GoodTrackerForm());
  showTable: boolean = false;
  params = new FilterParams();
  totalItems: number = 0;
  _params = new BehaviorSubject(new ListParams());
  goods: ITrackedGood[] = [];
  subloading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private goodTrackerService: GoodTrackerService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this._params.pipe(takeUntil(this.$unSubscribe), skip(1)).subscribe(next => {
      this.params.limit = next.limit;
      this.params.page = next.page;
      this.getGoods();
    });
  }

  async searchGoods(params: any) {
    this.params.removeAllFilters();
    const form = this.form.value;
    for (const [key, value] of Object.entries(form)) {
      let operator = this.getOperator(key);
      const _val = this.getValue(value, key);
      if (Array.isArray(value) && value.length > 0) {
        operator = SearchFilter.IN;
      }
      const _key = this.getKeyParam(key);
      if (_val && _key) {
        this.params.addFilter(_key, _val, operator);
      }
    }
    this.getGoods();
    this.showTable = true;
  }

  getOperator(key: string) {
    return OperatorValues[key] ?? SearchFilter.EQ;
  }

  getKeyParam(key: string) {
    const match = FilterMatchTracker as any;
    return match[key] ?? null;
  }

  getValue(value: any, key: string) {
    let _val;
    const customVal = TrackerValues[key];
    _val = value;
    if (customVal) {
      _val = customVal;
    }
    if (Array.isArray(_val)) {
      if (_val.length === 0) {
        return null;
      }
      const x = _val
        .filter(x => x?.length > 0)
        .join(',')
        .replaceAll(',,', ',');
      return x.replaceAll(',,', ',');
    }
    return _val;
  }

  getGoods() {
    this.loading = true;
    this.scrollTable.nativeElement.scrollIntoView();
    this.goodTrackerService.getAll(this.params.getParams()).subscribe({
      next: res => {
        this.loading = false;
        this.goods = res.data;
        this.totalItems = res.count;
      },
      error: () => {
        this.goods = [];
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  getAll() {
    this.showTable = true;
    this.params.removeAllFilters();
    this.getGoods();
  }
}
