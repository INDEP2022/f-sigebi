import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { GOODS_EYE_VISIT_COLUMNS } from './validate-eye-visit-columns';

@Component({
  selector: 'app-validate-eye-visit',
  templateUrl: './validate-eye-visit.component.html',
  styles: [],
})
export class ValidateEyeVisitComponent extends BasePage implements OnInit {
  @ViewChild('tableGoods') tableGoods: Ng2SmartTableComponent;
  @Input() idRequest: number;
  params = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoodTotalItems: number = 0;
  selectedGoodColumns = new LocalDataSource();
  selectedGoodSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  selectedList: any = [];
  maneuverReqList: any[] = [];
  constructor() {
    super();
    this.selectedGoodSettings.columns = GOODS_EYE_VISIT_COLUMNS;
  }

  /* INJECTION */
  private modalService = inject(BsModalService);
  private bsModalRef = inject(BsModalRef);
  private rejectedGoodService = inject(RejectedGoodService);
  private goodsQueryService = inject(GoodsQueryService);
  private delegationService = inject(DelegationService);
  private fractionService = inject(FractionService);

  ngOnInit(): void {
    const self = this;
    this.selectedGoodSettings.columns = {
      select: {
        title: '',
        type: 'custom',
        sort: false,
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.toggle.subscribe((data: any) => {
            data.row.to = data.toggle;
            component.checked(data);
          });
        },
      },
    };

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      if (this.idRequest) {
        //this.getData(data);
      }
    });
  }
}
