import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { ViewFileButtonComponent } from './../select-goods/view-file-button/view-file-button.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-result-visits',
  templateUrl: './result-visits.component.html',
  styles: [],
})
export class ResultVisitsComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  goodTotalItems: number = 0;
  data = [
    {
      goodNameAllocator: '1345',
      contributingResult: 'ACEPTADO',
      observations: 'BIEN ACEPTADO',
      requestNumb: 6862,
      file: 142,
      manageNumb: 606,
      reservedQuantity: 20,
      description: 'CANDIL DECORATIVO',
      saeNumb: '',
      inventoryNumb: '0065655555',
      officeNumb: '600-06-00',
      fileType: 'PAMA',
      uniqueKey: '601-69-68',
      unit: 'PIEZA',
    },
  ];

  constructor() {
    super();
    const self = this;
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
    this.settings.columns = {
      viewFile: {
        title: 'Expediente',
        type: 'custom',
        sort: false,
        renderComponent: ViewFileButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            component.viewFile(row);
          });
        },
      },
      ...this.settings.columns,
    };
  }

  ngOnInit(): void {
    this.getGoods();
  }

  getGoods() {
    //obetener datos de bienes desde el servicio
    this.goodTotalItems = this.data.length;
  }
}
