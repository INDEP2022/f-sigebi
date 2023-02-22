import { Component, OnInit } from '@angular/core';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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

  data1: any;
  constructor(private bsModalRef: BsModalRef, private opcion: ModalOptions) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        numberGood: {
          title: 'No Bien',
          width: '10%',
          sort: false,
        },
        description: {
          title: 'Descripcion',
          width: '20%',
          sort: false,
        },
        quantity: {
          title: 'Cantidad',
          width: '10%',
          sort: false,
        },
        dossier: {
          title: 'Expediente',
          width: '10%',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.data1 = this.opcion.initialState;
  }

  return() {}
}
