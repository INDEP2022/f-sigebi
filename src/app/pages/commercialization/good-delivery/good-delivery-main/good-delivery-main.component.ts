import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import { GOOD_DELIVERY_COLUMNS } from './good-delivery-columns';

@Component({
  selector: 'app-good-delivery-main',
  templateUrl: './good-delivery-main.component.html',
  styles: [],
})
export class GoodDeliveryMainComponent extends BasePage implements OnInit {
  selectedRows: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  goodsColumns: any[] = [];
  ngGlobal: IGlobalVars = null;
  LocalData = new LocalDataSource();
  columnFilters: any = [];
  flag: boolean = false;

  goodsSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
    hideSubHeader: false,
  };

  constructor(
    private goodService: GoodService,
    private globalVarsService: GlobalVarsService,
    private router: Router,
    private goodTrackerService: GoodTrackerService
  ) {
    super();
    this.goodsSettings.columns = GOOD_DELIVERY_COLUMNS;
  }

  ngOnInit(): void {
    this.globalVarsService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          console.log('GLOBAL ', this.ngGlobal);
          if (this.ngGlobal.REL_BIENES != null) {
            console.log('REL_BIENES ', this.ngGlobal.REL_BIENES);
            //this.backRastreador(this.ngGlobal.REL_BIENES);
          }
        },
      });
    this.LocalData.onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'file':
                field = 'filter.expediente.id';
                searchFilter = SearchFilter.EQ;
                break;
              case 'goodId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'status':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getGoodStatus();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodStatus());
  }

  getData() {
    /*this.goodsColumns = this.goodsTestData;
    this.totalItems = this.goodsColumns.length;*/
    //this.goodService.filterStatusGood(status, params).subscribe({});
    this.loadFromGoods();
  }

  selectRows(rows: any[]) {
    console.log('row ', rows);
    if (rows.length > 0) {
      this.selectedRows = rows;
      console.log('Rows Selected->', this.selectedRows);
      console.log('SelectRows', this.selectedRows[0].goodId);
      this.flag = true;
    } else {
      this.flag = false;
      this.selectedRows = [];
    }
  }

  changeStatus() {
    // Llamar servicio para cambiar estado
    this.alertQuestion(
      'warning',
      'Cambio de Estatus a Bien Vendido y Entregado',
      '¿ Estas Seguro de Modificar el ESTATUS de los Bienes Seleccionados ?'
    ).then(question => {
      if (question.isConfirmed) {
        if (this.selectedRows != null && this.selectedRows != undefined) {
          console.log('this.selectedRows', this.selectedRows);
          for (let i = 0; i < this.selectedRows.length; i++) {
            console.log(
              'this.selectedRows.length ->',
              this.selectedRows.length
            );
            console.log('params->', this.selectedRows[i].goodId);
            this.updateGoodStatus(this.selectedRows[i].goodId, 'ENT');
          }
        }
        console.log(this.selectedRows);
        this.onLoadToast(
          'success',
          'Estatus Cambiado con Éxito',
          `Se Cambio el Estado de ${this.selectedRows.length} Bienes.`
        );
        this.selectedRows = [];
        //this.getData();
        this.LocalData.refresh();
        this.getGoodStatus();
      }
    });
  }

  getGoodStatus() {
    this.goodsColumns = [];
    this.LocalData.load(this.goodsColumns);
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodService.filterStatusGood(params).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('RESP.GoodStatus-> ', resp);
        console.log('Resp GoodStatus', resp.data[0].expediente.id);
        for (let i = 0; i < resp.count; i++) {
          if (resp.data[i] != null && resp.data[i] != undefined) {
            let params = {
              file:
                resp.data[i].expediente != null
                  ? resp.data[i].expediente.id
                  : null,
              goodId: resp.data[i].goodId,
              description: resp.data[i].description,
              status: resp.data[i].status,
            };
            this.goodsColumns.push(params);
            this.LocalData.load(this.goodsColumns);
            this.totalItems = resp.count;
          }
        }
      }
    });
  }

  updateGoodStatus(good: number, status: string) {
    this.goodService.putStatusGood(good, status).subscribe(resp => {
      if (resp != null && resp != undefined) {
        console.log('Resp updateGoodStatus->', resp);
      }
    });
  }

  async loadFromGoods() {
    const global = await this.globalVarsService.getVars();
    this.globalVarsService.updateSingleGlobal('REL_BIENES', 0, global);
    // const selfState = await this.eventPreparationService.getState();
    // this.eventPreparationService.updateState({
    //   ...selfState,
    //   eventForm: this.eventForm,
    //   lastLot: Number(this.lotSelected.id) ?? -1,
    //   lastPublicLot: this.lotSelected.publicLot ?? 1,
    //   executionType: this.onlyBase ? 'base' : 'normal',
    // });

    localStorage.setItem('rastreador', '2');
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FCOMERCAMESTBIEN',
      },
    });
  }

  addGoodRastreador(good: any) {
    this.goodService.getByGood(good).subscribe({
      next: response => {
        console.log(' good ', response);
      },
    });
  }

  /*backRastreador() {
    this.goodTrackerService.PaInsGoodtmptracker(global).subscribe({
      next: response => {
        console.log('respuesta TMPTRAKER', response);
        for (let i = 0; i < response.count; i++) {
          console.log('entra ---> For');
          this.addGoodRastreador(response.data[0].goodNumber);
        }
        console.log('sale del For');
      },
    });
  }*/
}
