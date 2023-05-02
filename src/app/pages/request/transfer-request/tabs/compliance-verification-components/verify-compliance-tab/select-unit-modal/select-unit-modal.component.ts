import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-select-unit-modal',
  templateUrl: './select-unit-modal.component.html',
  styles: [],
})
export class SelectUnitModalComponent extends BasePage implements OnInit {
  public detailAssets: ModelForm<any>;
  public selectTansferUnitMeasure = new DefaultSelect();
  public event: EventEmitter<any> = new EventEmitter();
  good: any;

  private readonly goodsQueryService = inject(GoodsQueryService);

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.detailAssets = this.fb.group({
      unitLigie: [null],
    });
    this.getTransferentUnit(new ListParams());
  }

  getTransferentUnit(params: ListParams) {
    params['filter.measureTlUnit'] = `$ilike:${params.text}`;
    params.limit = 20;
    this.goodsQueryService
      .getCatMeasureUnitView(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          this.selectTansferUnitMeasure = new DefaultSelect(
            resp.data,
            resp.count
          );
        },
        error: error => {
          console.log(error);
        },
      });
  }

  select() {
    const unitValue = this.detailAssets.controls['unitLigie'].value;
    const unitDesc = this.selectTansferUnitMeasure.data.filter(
      x => x.uomCode === unitValue
    );

    const body = {
      id: this.good.id,
      unitId: unitValue,
      unitDesc: unitDesc[0].measureTlUnit,
    };
    this.triggerEvent(body);
    this.close();
  }

  triggerEvent(item: any) {
    this.event.emit(item);
  }

  close() {
    this.modalRef.hide();
  }
}
