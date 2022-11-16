import { Component, Input, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SELECT_GOODS_COLUMNS } from '../select-goods/select-goods-columns';
import { ViewFileButtonComponent } from '../select-goods/view-file-button/view-file-button.component';

@Component({
  selector: 'app-goods-list',
  templateUrl: './goods-list.component.html',
  styles: [],
})
export class GoodsListComponent extends BasePage implements OnInit {
  @Input() requestId: number;
  selectedGoodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoodTotalItems: number = 0;
  selectedGoodColumns: any[] = [];
  selectedGoodSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };

  goodTestData = [
    {
      origin: 'INVENTARIOS',
      description: 'CANDIL DECORATIVO',
      key: '801-69-68-65-2',
      manageNo: 605,
      transferAmount: 2,
      transactionAmount: 60,
      reservedAmount: 20,
      availableAmount: 40,
      destination: 'Admon',
      fileNo: 141,
      transferRequestNo: 6882,
      saeNo: '',
    },
  ];

  constructor(private modalService: BsModalService) {
    super();
    this.selectedGoodSettings.columns = SELECT_GOODS_COLUMNS;
  }

  ngOnInit(): void {
    const self = this;
    this.selectedGoodSettings.columns = {
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
      ...this.selectedGoodSettings.columns,
    };
    this.getData();
  }

  getData() {
    const good: any = Object.assign({ viewFile: '' }, this.goodTestData[0]);
    this.selectedGoodColumns = [...this.selectedGoodColumns, good];
    this.selectedGoodTotalItems = this.selectedGoodColumns.length;
  }

  viewFile(file: any) {}
}
