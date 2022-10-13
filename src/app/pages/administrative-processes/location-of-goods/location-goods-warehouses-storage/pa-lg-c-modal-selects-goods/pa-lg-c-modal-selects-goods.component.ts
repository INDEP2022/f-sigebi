import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'app-pa-lg-c-modal-selects-goods',
  templateUrl: './pa-lg-c-modal-selects-goods.component.html',
  styles: [],
})
export class PaLgCModalSelectsGoodsComponent implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table
  settings = {
    //selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    noDataMessage: 'No se encontrarón registros',
    mode: 'external', // ventana externa
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
      amount: {
        title: 'Cantidad',
        width: '10%',
        sort: false,
      },
      act: {
        title: 'Acta',
        width: '10%',
        sort: false,
      },
    },
  };

  data = [
    {
      numberGood: '1',
      description: 'Descripción 1',
      amount: 'Cant. 1',
      act: 'Act 1',
    },
    {
      numberGood: '2',
      description: 'Descripción 2',
      amount: 'Cant. 2',
      act: 'Act 2',
    },
  ];

  constructor(private bsModalRef: BsModalRef) {}

  ngOnInit(): void {}

  returnModal() {
    this.bsModalRef.hide();
  }
}
