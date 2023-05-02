import { Component, OnInit } from '@angular/core';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-modal-list-goods',
  templateUrl: './modal-list-goods.component.html',
  styles: [],
})
export class ModalListGoodsComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table

  goods: IGood[] = [];
  constructor(
    private bsModalRef: BsModalRef,
    private opcion: ModalOptions,
    private readonly goodServices: GoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        id: {
          title: 'No Bien',
          width: '10%',
          sort: false,
        },
        description: {
          title: 'Descripcion',
          width: '30%',
          sort: false,
        },
        quantity: {
          title: 'Cantidad',
          width: '5%',
          sort: false,
        },
        fileNumber: {
          title: 'Expediente',
          width: '5%',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.loading = true;
    const idSafe: any = this.opcion.initialState;
    console.log(Number(idSafe));
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodBySafe(idSafe));
  }

  return() {
    this.bsModalRef.hide();
  }
  getGoodBySafe(idSafe: string | number): void {
    this.goodServices.getBySafe(idSafe, this.params.getValue()).subscribe({
      next: response => {
        console.log(response);
        this.goods = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
}
