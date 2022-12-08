import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  GoodsTrackerCriteriasEnum,
  GOODS_TRACKER_CRITERIAS,
} from '../constants/goods-tracker-criterias.enum';
import { GOODS_TRACKER_FORM } from '../constants/goods-tracker-form';

@Component({
  selector: 'app-goods-tracker',
  templateUrl: './goods-tracker.component.html',
  styles: [
    `
      form-radio {
        margin-top: -15px !important;
        margin-bottom: -15px !important;
      }
    `,
  ],
})
export class GoodsTrackerComponent extends BasePage implements OnInit {
  @ViewChild('scrollFilter') scrollFilter: ElementRef;
  @ViewChild('tableItems') tableItems: ElementRef<HTMLDivElement>;
  criteriasEnum = GoodsTrackerCriteriasEnum;
  filterCriterias = GOODS_TRACKER_CRITERIAS;
  form = this.fb.group(GOODS_TRACKER_FORM);
  showTable: boolean = false;

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
      this.scrollFilter.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    });
  }

  searchGoods(params: any) {
    this.showTable = true;
    this.tableItems.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }

  getFilterName(): string {
    return (
      this.filterCriterias.find(
        criteria => criteria.value === this.criteriaControl.value
      )?.label ?? ''
    );
  }
}
