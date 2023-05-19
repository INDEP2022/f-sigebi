import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-edo-fisico',
  templateUrl: './edo-fisico.component.html',
  styleUrls: [],
})
export class EdoFisicoComponent extends BasePage implements OnInit {
  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      goodId: {
        title: 'No. Bien',
        type: 'number',
        sort: false,
      },
      description: {
        title: 'Descripción',
        type: 'string',
        sort: false,
      },
      physicalStatus: {
        title: 'Edo.Fisico',
        type: 'string',
        sort: false,
        valuePrepareFunction: (value: any) => {
          switch (value) {
            case 0:
              return 'MALO';
              break;
            case 1:
              return 'REGULAR';
              break;
            case 2:
              return 'BUENO';
              break;
            default:
              return 'SIN ESPECIFICAR';
              break;
          }
        },
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  dataGoods = new LocalDataSource();
  goodData: any[];
  constructor(private bsModel: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.dataGoods = new LocalDataSource(this.goodData);
  }

  close() {
    this.bsModel.hide();
  }
}
