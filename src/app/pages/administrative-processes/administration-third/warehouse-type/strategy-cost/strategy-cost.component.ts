import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IStrategyProcess,
  IStrategyService,
  IStrategyServicetype,
  IStrategyShift,
  IStrategyVariableCost,
} from 'src/app/core/models/administrative-processes/unit-cost.model';
import { ICosts } from 'src/app/core/models/catalogs/warehouse-classify-costs';
import { UnitCostService } from 'src/app/core/services/unit-cost/unit-cost.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRATEGY_COST_COLUMNS } from './strategy-cost-columns';

@Component({
  selector: 'app-strategy-cost',
  templateUrl: './strategy-cost.component.html',
  styles: [],
})
export class StrategyCostComponent extends BasePage implements OnInit {
  @Output() refresh = new EventEmitter<true>();
  data1: LocalDataSource = new LocalDataSource();
  strategyCost: ICosts[] = [];
  rowSelected: boolean = false;
  selectedRow: any = null;
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor(
    private modalRef: BsModalRef,
    private unitCostService: UnitCostService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: { ...STRATEGY_COST_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'costId'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getValuesAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());
  }
  close() {
    this.modalRef.hide();
  }
  getValuesAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.unitCostService.getAll(params).subscribe({
      next: response => {
        console.log(response);
        this.strategyCost = [];
        for (let i = 0; i < response.data.length; i++) {
          let descProcess: IStrategyProcess = response.data[i]
            .strategyProcess as IStrategyProcess;
          let descService: IStrategyService = response.data[i]
            .strategyService as IStrategyService;
          let descServiceType: IStrategyServicetype = response.data[i]
            .strategyServicetype as IStrategyServicetype;
          let descShift: IStrategyShift = response.data[i]
            .strategyShift as IStrategyShift;
          let descVariableCost: IStrategyVariableCost = response.data[i]
            .strategyVariableCost as IStrategyVariableCost;
          let desc =
            (descProcess != null ? descProcess.description : '') +
            ' / ' +
            (descService != null ? descService.description : '') +
            ' / ' +
            (descServiceType != null ? descServiceType.description : '') +
            ' / ' +
            (descShift != null ? descShift.description : '') +
            ' / ' +
            (descVariableCost != null ? descVariableCost.description : '');
          console.log();
          this.strategyCost.push({
            costId: response.data[i].costId,
            descCost: desc,
          });
          if (i == response.data.length - 1) {
            this.data1.load(this.strategyCost);
            this.data1.refresh();
            this.totalItems = response.count;
            this.loading = false;
          }
        }
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }
  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }
  confirm() {
    if (!this.rowSelected) return;
    this.refresh.emit(this.selectedRow);
    this.modalRef.hide();
  }
}
