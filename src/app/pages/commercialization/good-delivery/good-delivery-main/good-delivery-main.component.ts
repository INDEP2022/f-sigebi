import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, skip, takeUntil, tap } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
@Component({
  selector: 'app-good-delivery-main',
  templateUrl: './good-delivery-main.component.html',
  styles: [],
})
export class GoodDeliveryMainComponent extends BasePage implements OnInit {
  selectedRows: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  goodsRastreador: any[] = [];
  ngGlobal: IGlobalVars = null;
  data = new LocalDataSource();
  columnFilters: any = [];
  rel_bienes: any;
  total: any;
  goodsSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    hideSubHeader: false,
  };
  goodsSelected: any[] = [];
  goodsTracker: any = null;
  valRastreador: boolean = false;
  constructor(
    private goodService: GoodService,
    private globalVarsService: GlobalVarsService,
    private router: Router,
    private goodTrackerService: GoodTrackerService,
    private goodProcessService: GoodProcessService,
    private authService: AuthService,
    private historyGoodService: HistoryGoodService
  ) {
    super();
    this.goodsSettings.columns = {
      selection: {
        sort: false,
        title: 'Selección',
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (isSelected: boolean, row: any) =>
          this.isBillingSelected(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onBillingSelect(instance),
        filter: false,
      },
      fileNumber: {
        title: 'Expediente',
        type: 'number',
        sort: false,
      },
      id: {
        title: 'No. Bien',
        type: 'number',
        sort: false,
      },
      description: {
        title: 'Descripción',
        type: 'string',
        sort: false,
      },
      status: {
        title: 'Estatus',
        type: 'string',
        sort: false,
      },
    };
  }
  // ACTIONS CHECKBOX TABLE - START //
  onBillingSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.billingSelectedChange(data.row, data.toggle),
    });
  }
  isBillingSelected(_good: any) {
    const exists = this.goodsSelected.find((good: any) => good.id == _good.id);
    return !exists ? false : true;
  }
  billingSelectedChange(good: any, selected: boolean) {
    if (selected) {
      this.goodsSelected.push(good);
    } else {
      this.goodsSelected = this.goodsSelected.filter(
        (_good: any) => _good.id != good.id
      );
    }
  }
  // ACTIONS CHECKBOX TABLE - END //
  ngOnInit(): void {
    this.rel_bienes = null;
    this.globalVarsService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          if (this.ngGlobal.REL_BIENES != null) {
            this.rel_bienes = this.ngGlobal.REL_BIENES;
          }
        },
      });

    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.EQ;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'fileNumber':
                searchFilter = SearchFilter.EQ;
                break;
              case 'id':
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
    if (this.rel_bienes != null) {
      this.backRastreador(this.rel_bienes);
      this.params
        .pipe(
          skip(1),
          tap(() => {
            this.getGoodStatus('no');
          }),
          takeUntil(this.$unSubscribe)
        )
        .subscribe(() => {});
    } else {
      this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
        this.getGoodStatus();
      });
    }
  }

  getData() {
    this.loadFromGoods();
  }

  changeStatus() {
    // Vendido y Entregado
    if (this.goodsSelected.length == 0)
      return this.alert(
        'warning',
        'Debe seleccionar al menos un bien para realizar el cambio de estatus',
        ''
      );
    this.alertQuestion(
      'question',
      'Se realizará el cambio de estatus de los bienes seleccionados',
      '¿Desea continuar?'
    ).then(question => {
      if (question.isConfirmed) {
        let result = this.goodsSelected.map(async item => {
          let obj = {
            goodId: item.goodId,
            id: item.id,
            status: 'ENT',
          };
          await this.updateGoodStatus(obj);
          // let params2 = {
          //   propertyNum: item.id,
          //   status: 'ENT',
          //   changeDate: new Date(),
          //   userChange: this.authService.decodeToken().preferred_username,
          //   statusChangeProgram: 'FCOMERCAMESTBIEN',
          // };
          // await this.insertHistoric(params2);
        });

        Promise.all(result).then(resp => {
          this.alert(
            'success',
            'Estatus cambiados correctamente',
            `Se cambiaron el estatus de ${this.goodsSelected.length} bienes.`
          );
          this.goodsSelected = [];
          this.getGoodStatus();
        });
      }
    });
  }

  insertHistoric(data: any) {
    return new Promise((resolve, reject) => {
      this.historyGoodService.PostStatus(data).subscribe({
        next: response => {
          resolve(true);
        },
        error(err) {
          resolve(false);
        },
      });
    });
  }

  getGoodStatus(alert?: string) {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodService.filterStatusGood(params).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.data.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        if (alert == 'si') {
          this.alert(
            'warning',
            'No se encontraron los bienes seleccionados en el Rastreador',
            ''
          );
          delete this.params.getValue()['filter.id'];
          this.reloadGetGoodStatus();
        } else {
          this.loading = false;
        }
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }
  reloadGetGoodStatus() {
    this.loading = true;
    this.getGoodStatus();
  }
  updateGoodStatus(data: any) {
    return new Promise((resolve, reject) => {
      this.goodService.updateWithParams(data).subscribe({
        next: response => {
          resolve(true);
        },
        error(err) {
          resolve(false);
        },
      });
    });
  }

  async loadFromGoods() {
    const global = await this.globalVarsService.getVars();
    this.globalVarsService.updateSingleGlobal('REL_BIENES', 0, global);
    localStorage.setItem('rastreador', '2');
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FCOMERCAMESTBIEN',
      },
    });
  }

  backRastreador(global: any) {
    this.loading = true;
    this.goodTrackerService.PaInsGoodtmptracker_(global).subscribe({
      next: response => {
        let obj = {
          goodNumber: [],
        };
        let result = response.data.map(item => {
          obj.goodNumber.push(item.goodNumber);
        });
        Promise.all(result).then(resp => {
          this.goodsTracker = obj;
          this.valRastreador = true;
          this.params.getValue()['filter.id'] = `$in:${obj.goodNumber.join(
            ','
          )}`;
          this.getGoodStatus('si');
          this.deleteGoodTracker(this.rel_bienes);
        });
      },
      error: err => {
        this.alert('warning', `No se cargaron bienes del rastreador`, '');
        this.params = new BehaviorSubject<ListParams>(new ListParams());
        this.getGoodStatus();
      },
    });
  }

  goodtrackertmp(goodNum: number) {
    return new Promise((resolve, reject) => {
      this.goodTrackerService.getGoodTrackerTmp(goodNum).subscribe({
        next: value => {
          let result = value.data.map(item => {
            item['description'] = item.goodDescription;
          });
          Promise.all(result).then(resp => {
            resolve(value.data[0]);
          });
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  deleteGoodTracker(id: number): void {
    this.goodTrackerService.deleteTrackerGood(id).subscribe();
  }

  resetTable() {
    delete this.params.getValue()['filter.id'];
    this.goodsSelected = [];
    this.valRastreador = false;
    this.goodsRastreador = [];
    this.data.getFilter().filters = [];
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
    this.getGoodStatus();
  }
}
