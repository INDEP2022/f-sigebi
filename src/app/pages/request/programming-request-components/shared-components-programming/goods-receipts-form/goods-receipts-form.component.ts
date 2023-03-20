import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { IRecepitGuard } from 'src/app/core/models/receipt/receipt.model';
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
  receiptId: number;
  receipGuards: IGood[] = [];
  goodsReceiptGuards: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
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
    this.params.getValue()['filter.receiptGuardId'] = 456400;
    this.receptionService.getReceptionGoods(this.params.getValue()).subscribe({
      next: response => {
        response.data.map((items: IRecepitGuard) => {
          console.log('id bien', items.idGood);
          this.goodService.getById(items.idGood).subscribe({
            next: data => {
              this.receipGuards.push(data);
              console.log(this.receipGuards);
              this.goodsReceiptGuards.load(this.receipGuards);
              this.totalItems = this.goodsReceiptGuards.count();
            },
          });
        });
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
