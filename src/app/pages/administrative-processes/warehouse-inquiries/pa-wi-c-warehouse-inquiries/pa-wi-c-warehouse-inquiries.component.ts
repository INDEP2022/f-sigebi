import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { PaWiCModalListGoodsComponent } from '../pa-wi-c-modal-list-goods/pa-wi-c-modal-list-goods.component';

export interface ExampleWarehouse{
  number: number,
  description: string,
  location: string,
  responsible: string,
  entity: string,
  municipality: string,
  city: string,
  locality: string,
  goods?: ExapleGoods[]
}


export interface ExapleGoods{
  numberGood: number,
  description: string,
  quantity: number,
  dossier: string,
}

@Component({
  selector: 'app-pa-wi-c-warehouse-inquiries',
  templateUrl: './pa-wi-c-warehouse-inquiries.component.html',
  styles: [
  ]
})
export class PaWiCWarehouseInquiriesComponent extends BasePage implements OnInit {

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
      number: {
        title: 'No',
        width: '10%',
        sort: false
      },
      description: {
        title: 'Descripcion',
        width: '20%',
        sort: false
      },
      location: {
        title: 'Ubicacion',
        width: '10%',
        sort: false
      },
      responsible: {
        title: 'Responsable',
        width: '10%',
        sort: false
      },
      entity: {
        title: 'Entidad',
        width: '10%',
        sort: false
      },
      municipality: {
        title: 'Municipio',
        width: '10%',
        sort: false
      },
      city: {
        title: 'Ciudad',
        width: '10%',
        sort: false
      },
      locality: {
        title: 'Localidad',
        width: '10%',
        sort: false
      }
    },
  };

  data: ExampleWarehouse[] = [
    {
      number: 1,
      description: 'Descripción 1',
      location: 'Ubicacion 1',
      responsible: 'Responsable 1',
      entity: 'Entidad 1',
      municipality: 'Municipio 1',
      city: 'Ciudad 1',
      locality: 'Localidad 1',
      goods: [
        {
          numberGood: 1,
          description: 'Descripción 1',
          quantity: 1000,
          dossier: 'Expediente 1',
        },
        {
          numberGood: 2,
          description: 'Descripción 2',
          quantity: 2000,
          dossier: 'Expediente 2',
        },
        {
          numberGood: 3,
          description: 'Descripción 3',
          quantity: 3000,
          dossier: 'Expediente 3',
        }
      ]
    },
    {
      number: 2,
      description: 'Descripción 2',
      location: 'Ubicacion 2',
      responsible: 'Responsable 2',
      entity: 'Entidad 2',
      municipality: 'Municipio 2',
      city: 'Ciudad 2',
      locality: 'Localidad 2'
    }
  ];
  
  constructor(private modalService: BsModalService) { super() }

  ngOnInit(): void {
  }

  select(event: any) {
    event.data.goods ? this.openModal(event.data.goods) : this.alert('info','Ooop...','Este Almacen no contiene Bines');
  }

  openModal(data: any): void {
    this.modalService.show( PaWiCModalListGoodsComponent , {
      initialState: data,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

}
