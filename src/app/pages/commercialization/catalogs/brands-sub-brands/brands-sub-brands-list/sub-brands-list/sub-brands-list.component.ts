import { Component, Input, OnInit } from '@angular/core';
import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { ParameterSubBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-sub-brands.service';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import { COLUMNS2 } from '../columns';

@Component({
  selector: 'app-sub-brands-list',
  templateUrl: './sub-brands-list.component.html',
  styles: [],
})
export class SubBrandsListComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  flag: number = 0;
  private _rowBrand: string;
  @Input() get rowBrand(): string {
    return this._rowBrand;
  }
  set rowBrand(value: string) {
    this._rowBrand = value;
    const field = `filter.idBrand`;
    this.columnFilters[field] = `${SearchFilter.EQ}:${value}`;
    if (this.flag > 0) {
      this.getData();
    }
    this.flag++;
  }
  constructor(private subBrandService: ParameterSubBrandsService) {
    super();
    this.service = this.subBrandService;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: COLUMNS2,
    };
  }
}
