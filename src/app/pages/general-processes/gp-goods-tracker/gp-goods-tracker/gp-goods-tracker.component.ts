import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  GoodsTrackerCriteriasEnum,
  GOODS_TRACKER_CRITERIAS,
} from '../constants/goods-tracker-criterias.enum';
import { GOODS_TRACKER_FORM } from '../constants/goods-tracker-form';

@Component({
  selector: 'app-gp-goods-tracker',
  templateUrl: './gp-goods-tracker.component.html',
  styles: [
    `
      form-radio {
        margin-top: -15px !important;
        margin-bottom: -15px !important;
      }
    `,
  ],
})
export class GpGoodsTrackerComponent extends BasePage implements OnInit {
  criteriasEnum = GoodsTrackerCriteriasEnum;
  filterCriterias = GOODS_TRACKER_CRITERIAS;
  form = this.fb.group(GOODS_TRACKER_FORM);
  @ViewChild('scrollFiler') scrollFiler: ElementRef;

  get criteriaControl() {
    return this.form.controls.criterio;
  }

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.listenCriteriaChange();
  }

  listenCriteriaChange() {
    this.form.controls.criterio.valueChanges.subscribe(criteria => {
      this.scrollFiler.nativeElement.scrollIntoView({ behavior: 'smooth' });
    });
  }

  searchGoods(params: any) {
    console.log(params);
  }

  getFilterName(): string {
    return (
      this.filterCriterias.find(
        criteria => criteria.value === this.criteriaControl.value
      )?.label ?? ''
    );
  }
}
