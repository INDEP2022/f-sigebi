import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_DATA_TABLE } from './columns-data-table';
import { COLUMNS_USER_PERMISSIONS } from './columns-user-permissions';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';

@Component({
  selector: 'app-fdp-dit-c-data-table',
  templateUrl: 'fdp-dit-c-data-table.component.html',
  styles: [],
})
export class FdpDitCDataTableComponent extends BasePage implements OnInit {
  @Input() type: number;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  data: any;
  constructor() {
    super();
    this.settings = { ...this.settings, actions: false };
  }

  ngOnInit(): void {
    if (this.type == 1 || this.type == 2) {
      //comercio exterior o delitos federales
      this.settings.columns = COLUMNS_DATA_TABLE;
      this.data = EXAMPLE_DATA1;
    } else {
      if (this.type == 3) {
        //Otros Trans
        this.settings.columns = {
          ...COLUMNS_DATA_TABLE,
          quantity: { title: 'Cantidad', type: 'number', sort: false },
        };
        Object.defineProperty(EXAMPLE_DATA1[0], 'quantity', {
          value: 2,
        });
        this.data = EXAMPLE_DATA1;
      } else {
        //Permisos Rastreador
        this.settings.columns = COLUMNS_USER_PERMISSIONS;
        this.data = EXAMPLE_DATA2;
      }
    }
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
}

const EXAMPLE_DATA1 = [
  {
    tag: 'des_etiqueta',
    status: 'status',
    desStatus: 'des_status',
    transNumb: 1,
    desTrans: 'des_trans',
    clasifNumb: 2,
    desClasif: 'des_clasif',
    unit: 2,
  },
];

const EXAMPLE_DATA2 = [
  {
    user: 'AMORENOL',
    name: 'ANIBAL MORENO LUCIO',
  },
];
