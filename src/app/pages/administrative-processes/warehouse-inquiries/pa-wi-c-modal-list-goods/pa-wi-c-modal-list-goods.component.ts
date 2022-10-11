import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-pa-wi-c-modal-list-goods',
  templateUrl: './pa-wi-c-modal-list-goods.component.html',
  styles: [
  ]
})
export class PaWiCModalListGoodsComponent extends BasePage implements OnInit {

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

  data1 = [
    {
      numberGood: '1',
      description: 'Descripción 1',
      quantity: '1000',
      dossier: 'Expediente 1',
    },
    {
      numberGood: '2',
      description: 'Descripción 2',
      quantity: '2000',
      dossier: 'Expediente 2',
    },
    {
      numberGood: '2',
      description: 'Descripción 2',
      quantity: '2000',
      dossier: 'Expediente 2',
    },
    {
      numberGood: '2',
      description: 'Descripción 2',
      quantity: '2000',
      dossier: 'Expediente 2',
    },
    {
      numberGood: '2',
      description: 'Descripción 2',
      quantity: '2000',
      dossier: 'Expediente 2',
    },
    {
      numberGood: '2',
      description: 'Descripción 2',
      quantity: '2000',
      dossier: 'Expediente 2',
    },
    {
      numberGood: '2',
      description: 'Descripción 2',
      quantity: '2000',
      dossier: 'Expediente 2',
    }

  ];
  constructor(private bsModalRef: BsModalRef) { super() }

  ngOnInit(): void {
  }

  mostrar(){
    
  }
  return(){
    this.bsModalRef.hide();
  }
}
