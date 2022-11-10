import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { FINANCIAL_INDICATORS_COLUMNS } from './financial-indicators-columns';

@Component({
  selector: 'app-c-p-c-cat-financial-indicators',
  templateUrl: './c-p-c-cat-financial-indicators.component.html',
  styles: [],
})
export class CPCCatFinancialIndicatorsComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columns: any[] = [];

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...FINANCIAL_INDICATORS_COLUMNS },
      selectMode: 'multi',
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  data = [
    {
      id: 1,
      name: 'Nombre 1',
      description: 'Descripción 1',
      formule: false,
    },
    {
      id: 2,
      name: 'Nombre 2',
      description: 'Descripción 2',
      formule: true,
    },
    {
      id: 3,
      name: 'Nombre 3',
      description: 'Descripción 3',
      formule: true,
    },
    {
      id: 4,
      name: 'Nombre 4',
      description: 'Descripción 4',
      formule: false,
    },
  ];

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }
}
