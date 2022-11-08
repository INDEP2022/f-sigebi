import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { FLYER_SUBJECT_CAT_COLUMNS } from './flyer-subject-catalog-column';

@Component({
  selector: 'app-c-p-c-flyer-subject-catalog',
  templateUrl: './c-p-c-flyer-subject-catalog.component.html',
  styles: [],
})
export class CPCFlyerSubjectCatalogComponent
  extends BasePage
  implements OnInit
{
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...FLYER_SUBJECT_CAT_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.getPagination();
  }

  getPagination() {
    this.columns = this.data;
    this.totalItems = this.columns.length;
  }

  data = [
    {
      code: 101,
      description: 'Descripción de 101',
      typeFyer: 'Tipo volante',
      relationGoods: 'false',
      userPermission: 'true',
    },
    {
      code: 102,
      description: 'Descripción de 102',
      typeFyer: 'Tipo volante',
      relationGoods: 'false',
      userPermission: 'true',
    },
    {
      code: 103,
      description: 'Descripción de 103',
      typeFyer: 'Tipo volante',
      relationGoods: 'false',
      userPermission: 'true',
    },
    {
      code: 104,
      description: 'Descripción de 104',
      typeFyer: 'Tipo volante',
      relationGoods: 'false',
      userPermission: 'true',
    },
  ];
}
