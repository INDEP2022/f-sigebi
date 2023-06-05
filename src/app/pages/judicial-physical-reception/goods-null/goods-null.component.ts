import { Component, OnInit } from '@angular/core';
import { IAttribGoodBad } from 'src/app/core/models/ms-good/good';
import { AttribGoodBadService } from 'src/app/core/services/ms-good/attrib-good-bad.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';

@Component({
  selector: 'app-goods-null',
  templateUrl: './goods-null.component.html',
  styleUrls: ['./goods-null.component.scss'],
})
export class GoodsNullComponent
  extends BasePageWidhtDinamicFiltersExtra<IAttribGoodBad>
  implements OnInit
{
  constructor(private attribGoodBadService: AttribGoodBadService) {
    super();
    this.service = this.attribGoodBadService;
    this.ilikeFilters = ['motive'];
    this.settings = {
      ...this.settings,
      columns: {
        id: {
          title: 'No. Bien',
          type: 'string',
          sort: false,
        },
        motive: {
          title: 'Motivo',
          type: 'string',
          sort: false,
        },
      },
    };
  }
}
