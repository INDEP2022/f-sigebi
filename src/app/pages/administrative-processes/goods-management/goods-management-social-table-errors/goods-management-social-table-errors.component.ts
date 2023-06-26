import { Component, OnInit } from '@angular/core';
import { ITmpValSocialLoadSocialCabinet } from 'src/app/core/models/ms-social-cabinet/tmp-val-load-social-cabinet';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';

@Component({
  selector: 'app-goods-management-social-table-errors',
  templateUrl: './goods-management-social-table-errors.component.html',
  styleUrls: ['./goods-management-social-table-errors.component.scss'],
})
export class GoodsManagementSocialTableErrorsComponent
  extends BasePageWidhtDinamicFiltersExtra<ITmpValSocialLoadSocialCabinet>
  implements OnInit
{
  constructor() {
    super();
    this.haveInitialCharge = false;
    this.ilikeFilters = ['valMessage'];
  }
}
