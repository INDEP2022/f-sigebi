import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-search-fraction',
  templateUrl: './search-fraction.component.html',
  styles: [
    `
      form {
        margin-top: -50px !important;
      }
    `,
  ],
})
export class SearchFractionComponent extends BasePage implements OnInit {
  form = this.fb.group({
    filter: this.fb.array([
      this.fb.group({
        operator: new FormControl<'Y' | 'O'>('Y'),
        value: new FormControl<string>(null),
      }),
    ]),
  });
  fractions: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  fractionSelected: any = null;

  get filter() {
    return this.form.controls.filter as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private goodsQueryService: GoodsQueryService,
    private modalRef: BsModalRef
  ) {
    super();
  }

  addFilter() {
    if (this.filter.length == 4) {
      return;
    }
    const filterForm = this.fb.group({
      operator: new FormControl<'Y' | 'O'>('Y'),
      value: new FormControl<string>(null),
    });
    this.filter.push(filterForm);
  }

  removeFilter(index: number) {
    this.filter.removeAt(index);
  }

  ngOnInit(): void {
    this.addDynamicFilter();
    this.listenParams();
  }

  addDynamicFilter() {
    this.form.valueChanges.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: form => {
        const allFilled = form.filter.filter(
          filter => filter.value?.length > 0
        );
        if (allFilled.length == this.filter.length) {
          this.addFilter();
        }
      },
    });
  }

  listenParams() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getFractions());
  }

  getFractions() {
    const params = this.params.getValue();
    const filter = this.form.value.filter.filter(f => f.value != null);
    this.goodsQueryService.getFractionsFilter(params, { filter }).subscribe({
      next: res => {
        this.fractions = res.data;
        this.totalItems = res.count;
      },
    });
  }

  selectFraction(fraction: any) {
    this.fractionSelected = fraction;
  }

  confirm() {
    this.modalRef.content.callback(this.fractionSelected.fraction);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
