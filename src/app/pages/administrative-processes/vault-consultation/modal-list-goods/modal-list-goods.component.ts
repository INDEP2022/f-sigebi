import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
@Component({
  selector: 'app-modal-list-goods',
  templateUrl: './modal-list-goods.component.html',
  styles: [],
})
export class ModalListGoodsComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  // totalItems: number = 0;
  // params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table
  goods: IGood[] = [];
  @Input() idSafe: number;
  @Output() onConfirm = new EventEmitter<any>();
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
    this.loading = true;
    const idSafe: any = this.opcion.initialState;
    const safe = Object.values(idSafe);
    const go = safe[0].toString().concat(safe[1].toString());

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodBySafe(Number(go)));
  }

  return() {
    this.bsModalRef.hide();
  }
  getGoodBySafe(idSafe: number | string): void {
    this.loading = true;
    this.params.getValue()['search'] = this.params.getValue().text;
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

  getNumbersInString(cadena: string) {
    var tmp = cadena.split('');
    var map = tmp.map(function (current): any {
      if (!isNaN(parseInt(current))) {
        return current;
      }
    });
    var numbers = map.filter(function (value) {
      return value != undefined;
    });
    return numbers.join('');
  }
}
