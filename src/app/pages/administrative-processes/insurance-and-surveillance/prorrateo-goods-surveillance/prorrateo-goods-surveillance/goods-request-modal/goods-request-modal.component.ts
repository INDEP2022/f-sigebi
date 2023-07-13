import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GOOD_LIST } from './column.list';
import { GoodService } from 'src/app/core/services/good/good.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-goods-request-modal',
  templateUrl: './goods-request-modal.component.html',
  styles: [],
})
export class GoodsRequestModalComponent extends BasePage implements OnInit {
  banks = new DefaultSelect<any>();
  data = new LocalDataSource();
  noRequest = '';
  constructor(
    private modal: BsModalRef,
    private goodServices: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: GOOD_LIST,
    };
  }

  ngOnInit(): void {
    console.log("Numero ngOnInit: ", this.noRequest);
    this.getGoodByNoRequest(this.noRequest);

  }


  getGoodByNoRequest(noRequest: number | string) {
    this.goodServices.getByRequestId(noRequest).subscribe({
      next: response => {
        for (let i = 0; response.data.length; i++) {
          if (response.data[i] != undefined) {
            let item = {
              No_bien: response.data[i].goodId,
              descripcion: response.data[i].description
            }
            this.banks.data.push(item);
          } else {
            this.data.load(this.banks.data);
            this.data.refresh();
            break;
          }
        }

      },
      error: err => {
        console.log(err);
      },
    });
  }


  close() {
    this.modal.hide();
  }
}