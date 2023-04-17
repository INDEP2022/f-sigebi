import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
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
import { IWarehouseTypeWarehouse } from 'src/app/core/models/catalogs/type-warehouse.model';
import { IWarehouseClassifyCosts } from 'src/app/core/models/catalogs/warehouse-classify-costs';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { TypeWarehouseService } from 'src/app/core/services/catalogs/type-warehouse.service';
import { WarehouseClassifyCostsService } from 'src/app/core/services/catalogs/warehouse-classify-costs.service';
import { UnitCostService } from 'src/app/core/services/unit-cost/unit-cost.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { WarehouseTypeModalComponent } from '../warehouse-type-modal/warehouse-type-modal.component';
import { WarehouseTypeModalsComponent } from '../warehouse-type-modals/warehouse-type-modals.component';
import {
  QUALIFIERS_COLUMNS,
  WAREHOUSE_TIPE_COLUMNS,
} from './warehouse-type-columns';

@Component({
  selector: 'app-warehouse-type',
  templateUrl: './warehouse-type.component.html',
  styles: [],
})
export class WarehouseTypeComponent extends BasePage implements OnInit {
  data1: LocalDataSource = new LocalDataSource();
  columnFilters1: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  typeWarehouse: IWarehouseTypeWarehouse[] = [];
  values: IWarehouseTypeWarehouse;
  classifyCosts: IWarehouseClassifyCosts[] = [];
  data2: LocalDataSource = new LocalDataSource();
  columnFilters2: any = [];
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  settings2 = { ...this.settings };

  constructor(
    private modalService: BsModalService,
    private typeWarehouseService: TypeWarehouseService,
    private warehouseClassifyCostsService: WarehouseClassifyCostsService,
    private goodSssubtypeService: GoodSssubtypeService,
    private unitCostService: UnitCostService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: false,
        position: 'right',
      },
      hideSubHeader: false,
      columns: { ...QUALIFIERS_COLUMNS },
    };
    this.settings2.columns = WAREHOUSE_TIPE_COLUMNS;
    this.settings2.actions.add = false;
    this.settings2 = {
      ...this.settings2,
      hideSubHeader: false,
    };
  }

  ngOnInit(): void {
    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            /*SPECIFIC CASES*/
            filter.field == 'warehouseTypeId'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters2[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters2[field];
            }
          });
          this.getValuesAll();
        }
      });
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
            filter.field == 'classifGoodNumber'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.getClassifyCostsAll();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getClassifyCostsAll());
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getValuesAll());
  }
  getValuesAll() {
    this.loading = true;
    let params = {
      ...this.params2.getValue(),
      ...this.columnFilters2,
    };
    this.typeWarehouseService.getAllType(params).subscribe({
      next: response => {
        this.typeWarehouse = response.data;
        this.data2.load(this.typeWarehouse);
        this.data2.refresh();
        this.totalItems2 = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }
  getClassifyCostsAll() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters1,
    };

    this.warehouseClassifyCostsService.getAll(params).subscribe({
      next: response => {
        let classif: IWarehouseClassifyCosts[];
        this.classifyCosts = [];
        classif = response.data;
        this.getList(classif);
        this.totalItems = response.count;
        // this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }
  getList(classif: any) {
    if (classif != null) {
      this.loading = true;
      for (let i = 0; i < classif.length; i++) {
        var params1 = new ListParams();
        params1[
          'filter.numClasifGoods'
        ] = `$eq:${classif[i].classifGoodNumber}`;
        this.goodSssubtypeService.getAll(params1).subscribe({
          next: response1 => {
            classif[i].descClassif = response1.data[0].description;
          },
          error: error => {
            this.loading = false;
            console.log(error);
          },
        });
      }
      this.loading = true;
      for (let i = 0; i < classif.length; i++) {
        var params2 = new ListParams();
        params2['filter.costId'] = `$eq:${classif[i].costId}`;
        this.unitCostService.getAll(params2).subscribe({
          next: response2 => {
            let descProcess: IStrategyProcess = response2.data[0]
              .strategyProcess as IStrategyProcess;
            let descService: IStrategyService = response2.data[0]
              .strategyService as IStrategyService;
            let descServiceType: IStrategyServicetype = response2.data[0]
              .strategyServicetype as IStrategyServicetype;
            let descShift: IStrategyShift = response2.data[0]
              .strategyShift as IStrategyShift;
            let descVariableCost: IStrategyVariableCost = response2.data[0]
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
            classif[i].descCost = desc;
            if (i == classif.length - 1) {
              this.classifyCosts = classif;
              this.data1.load(this.classifyCosts);
              this.data1.refresh();
              this.loading = false;
            }
          },
          error: error => {
            this.loading = false;
            console.log(error);
          },
        });
      }
    }
  }
  rowsSelected(event: any) {
    this.values = event.data;
  }
  openType(data?: IWarehouseTypeWarehouse) {
    let config: ModalOptions = {
      initialState: {
        data,
        callback: (next: boolean) => {
          this.params2
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getValuesAll());
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(WarehouseTypeModalsComponent, config);
  }
  openTypeClassifyCost(data?: IWarehouseTypeWarehouse) {
    let value = this.values;
    let config: ModalOptions = {
      initialState: {
        data,
        value,
        callback: (next: boolean) => {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getClassifyCostsAll());
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(WarehouseTypeModalComponent, config);
  }
  openTypeClassify(data?: IWarehouseTypeWarehouse) {
    if (this.values) {
      let value = this.values;
      let config: ModalOptions = {
        initialState: {
          data,
          value,
          callback: (next: boolean) => {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getClassifyCostsAll());
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(WarehouseTypeModalComponent, config);
    } else {
      this.onLoadToast(
        'warning',
        'advertencia',
        'Se debe seleccionar un Tipo de almacén'
      );
    }
  }
}
