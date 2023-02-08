import { Component, OnInit } from '@angular/core';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-modal-classification-goods',
  templateUrl: './modal-classification-goods.component.html',
  styles: [],
})
export class ModalClassificationGoodsComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table

  data1: any;
  constructor(private bsModalRef: BsModalRef, private opcion: ModalOptions) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        numberGood: {
          title: 'No Clasif. Bien',
          width: '10%',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {}

  return() {
    this.bsModalRef.hide();
  }
}
