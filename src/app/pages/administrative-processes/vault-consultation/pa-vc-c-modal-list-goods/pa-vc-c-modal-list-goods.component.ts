import { Component, OnInit } from '@angular/core';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-pa-vc-c-modal-list-goods',
  templateUrl: './pa-vc-c-modal-list-goods.component.html',
  styles: [
  ]
})
export class PaVcCModalListGoodsComponent extends BasePage implements OnInit {

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table
  settings = {
    //selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false
    },
    hideSubHeader: true,//oculta subheaader de filtro
    noDataMessage: "No se encontrarón registros",
    mode: 'external', // ventana externa
    columns: {
      numberGood: {
        title: 'No Bien',
        width: '10%'
      },
      description: {
        title: 'Descripcion',
        width: '20%'
      },
      quantity: {
        title: 'Cantidad',
        width: '10%'
      },
      dossier: {
        title: 'Expediente',
        width: '10%'
      }
    },
  };

  data1: any;
  constructor(private bsModalRef: BsModalRef, private opcion: ModalOptions) { super() }

  ngOnInit(): void {
    this.data1 = this.opcion.initialState;
  }
  
  return(){
    this.bsModalRef.hide();
  }

}
