import { Component, Input, SimpleChanges } from '@angular/core';
import {
  GoodFractionService,
  IFraction,
} from 'src/app/core/services/ms-good/good-fraction.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-fraction-table',
  templateUrl: './fraction-table.component.html',
  styleUrls: ['./fraction-table.component.scss'],
})
export class FractionTableComponent extends BasePageWidhtDinamicFiltersExtra<IFraction> {
  @Input() goodNumber: number;
  @Input() fractionCod: string;
  constructor(private goodFractionService: GoodFractionService) {
    super();
    this.haveInitialCharge = false;
    this.service = this.goodFractionService;
    this.ilikeFilters = ['descripcion_fraccion'];
    this.settings = {
      ...this.settings,
      actions: null,
      columns: COLUMNS,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    if (changes['goodNumber']) {
      if (changes['goodNumber'].currentValue) {
        this.getData();
      } else {
        this.dataNotFound();
      }
      return;
    }
    if (changes['fractionCod']) {
      if (changes['fractionCod'].currentValue) {
        this.getData();
      } else {
        this.dataNotFound();
      }
    }
  }

  override getParams() {
    let newColumnFilters = this.columnFilters;
    if (this.goodNumber) {
      newColumnFilters['filter.no_bien'] = '$eq:' + this.goodNumber;
    }
    if (this.fractionCod) {
      newColumnFilters['filter.codigo_fraccion'] = '$eq:' + this.fractionCod;
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }

  // private getData() {
  //   this.goodFractionService
  //     .getAll({
  //       goodNumber: this.goodNumber,
  //       fractionCod: this.fractionCod,
  //     })
  //     .pipe(takeUntil(this.$unSubscribe))
  //     .subscribe({
  //       next: response => {
  //         if (response) {
  //           this.data = response.data;
  //           this.totalItems = response.data.length;
  //         }
  //       },
  //     });
  // }
}
