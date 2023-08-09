import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import {
  IReceipt,
  IRecepitGuard,
} from 'src/app/core/models/receipt/receipt.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ESTATE_COLUMNS_VIEW } from '../../acept-programming/columns/estate-columns';

@Component({
  selector: 'app-goods-receipts-form',
  templateUrl: './goods-receipts-form.component.html',
  styles: [],
})
export class GoodsReceiptsFormComponent extends BasePage implements OnInit {
  receipt: IReceipt;
  receipGuards: IGood[] = [];
  goodsReceiptGuards: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsGuardGood = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  type: string = '';
  constructor(
    private modalRef: BsModalRef,
    private receptionService: ReceptionGoodService,
    private goodService: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: ESTATE_COLUMNS_VIEW,
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsReceipt());
  }

  getGoodsReceipt() {
    if (this.type == 'guard') {
      this.loading = true;
      this.params.getValue()['filter.receiptGuardId'] = this.receipt.id;
      this.receptionService
        .getReceptionGoods(this.params.getValue())
        .subscribe({
          next: response => {
            this.totalItems = response.count;
            const goodsGuard: IGood[] = [];
            response.data.map((item: IRecepitGuard) => {
              this.paramsGuardGood.getValue()['filter.id'] = item.idGood;
              this.goodService
                .getAll(this.paramsGuardGood.getValue())
                .subscribe({
                  next: response => {
                    if (response.data[0].physicalStatus == 1) {
                      response.data[0].physicalStatusName = 'BUENO';
                    }
                    if (response.data[0].physicalStatus == 2) {
                      response.data[0].stateConservationName = 'MALO';
                    }
                    if (response.data[0].stateConservation == 1) {
                      response.data[0].physicalStatusName = 'BUENO';
                    }
                    if (response.data[0].stateConservation == 2) {
                      response.data[0].stateConservationName = 'MALO';
                    }
                    goodsGuard.push(response.data[0]);

                    this.goodsReceiptGuards.load(goodsGuard);
                    this.totalItems = goodsGuard.length;
                    this.loading = false;
                  },
                  error: error => {
                    console.log(error);
                  },
                });
            });
          },
          error: error => {
            console.log('error', error);
          },
        });
    }

    if (this.type == 'warehouse') {
      this.loading = true;
      this.params.getValue()['filter.receiptGuardId'] = this.receipt.id;
      this.receptionService
        .getReceptionGoods(this.params.getValue())
        .subscribe({
          next: response => {
            console.log('response warehouse', response);
            const goodsGuard: IGood[] = [];
            response.data.map((item: IRecepitGuard) => {
              this.paramsGuardGood.getValue()['filter.id'] = item.idGood;
              this.goodService
                .getAll(this.paramsGuardGood.getValue())
                .subscribe({
                  next: response => {
                    if (response.data[0].physicalStatus == 1) {
                      response.data[0].physicalStatusName = 'BUENO';
                    }
                    if (response.data[0].physicalStatus == 2) {
                      response.data[0].stateConservationName = 'MALO';
                    }
                    if (response.data[0].stateConservation == 1) {
                      response.data[0].physicalStatusName = 'BUENO';
                    }
                    if (response.data[0].stateConservation == 2) {
                      response.data[0].stateConservationName = 'MALO';
                    }
                    goodsGuard.push(response.data[0]);

                    this.goodsReceiptGuards.load(goodsGuard);
                    this.totalItems = goodsGuard.length;
                    this.loading = false;
                  },
                  error: error => {
                    console.log(error);
                  },
                });
            });
          },
          error: error => {
            console.log('error', error);
          },
        });
    }
  }

  close() {
    this.modalRef.hide();
  }
}
