import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IGoodProgramming,
  IGoodProgrammingSelect,
} from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DomicileService } from 'src/app/core/services/catalogs/domicile.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  ESTATE_COLUMNS_NOTIFY,
  ESTATE_COLUMNS_VIEW,
} from '../../acept-programming/columns/estate-columns';
import { DetailGoodProgrammingFormComponent } from '../../shared-components-programming/detail-good-programming-form/detail-good-programming-form.component';
import { estates, users } from './schedule-notify-data';

import { takeUntil } from 'rxjs';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { USER_COLUMNS_SHOW } from '../../acept-programming/columns/users-columns';

@Component({
  selector: 'app-schedule-notify-form',
  templateUrl: './schedule-notify-form.component.html',
  styles: [],
})
export class ScheduleNotifyFormComponent extends BasePage implements OnInit {
  settingsUser = {
    ...this.settings,
    actions: false,
    columns: USER_COLUMNS_SHOW,
  };
  settingsState = {
    ...this.settings,
    columns: ESTATE_COLUMNS_NOTIFY,
    actions: { columnTitle: 'Detalle domicilio', position: 'right' },
    edit: {
      editButtonContent: '<i class="fa fa-file-alt text-success mx-2"></i>',
    },
  };

  users = users;
  estates = estates;
  idProgramming: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsTransportableGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsGuardGood = 0;
  totalItemsWarehouse = 0;
  paramsWarehouseGoods = new BehaviorSubject<ListParams>(new ListParams());
  paramsGuardGoods = new BehaviorSubject<ListParams>(new ListParams());
  delegationName: string = '';
  transferentName: string = '';
  stationName: string = '';
  typeRelevantName: string = '';
  warehouseName: string = '';
  warehouseUbication: string = '';
  authorityName: string = '';
  totalItems: number = 0;
  programming: Iprogramming;
  usersToProgramming: LocalDataSource = new LocalDataSource();
  paramsShowTransportable = new BehaviorSubject<ListParams>(new ListParams());
  paramsShowWarehouse = new BehaviorSubject<ListParams>(new ListParams());

  totalItemsUsers: number = 0;
  headingTransportable: string = `Transportables(0)`;
  headingGuard: string = `Resguardo(0)`;
  headingWarehouse: string = `Almacén INDEP(0)`;
  formLoading: boolean = false;
  formLoadingTransportable: boolean = false;
  formLoadingGuard: boolean = false;
  formLoadingWarehouse: boolean = false;
  loadingReportGoods: boolean = false;
  stateName: string = '';
  settingsTransportableGoods = {
    ...this.settings,
    actions: {
      delete: false,
      edit: true,
      columnTitle: 'Acciones',
      position: 'right',
    },
    edit: {
      editButtonContent: '<i class="fa fa-eye"></i>',
    },
    columns: ESTATE_COLUMNS_VIEW,
  };

  settingGuardGoods = {
    ...this.settings,
    actions: {
      delete: false,
      edit: true,
      columnTitle: 'Acciones',
      position: 'right',
    },
    edit: {
      editButtonContent: '<i class="fa fa-eye"></i>',
    },
    columns: ESTATE_COLUMNS_VIEW,
  };

  settingWarehouseGoods = {
    ...this.settings,
    actions: {
      delete: false,
      edit: true,
      columnTitle: 'Acciones',
      position: 'right',
    },
    edit: {
      editButtonContent: '<i class="fa fa-eye"></i>',
    },
    columns: ESTATE_COLUMNS_VIEW,
  };
  goodsTranportables: LocalDataSource = new LocalDataSource();
  goodsGuards: LocalDataSource = new LocalDataSource();
  goodsWarehouse: LocalDataSource = new LocalDataSource();
  totalItemsTransportableGoods: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private programmingService: ProgrammingRequestService,
    private delegationService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private stationService: StationService,
    private authorityService: AuthorityService,
    private typeRelevatService: TypeRelevantService,
    private warehouseService: WarehouseService,
    private goodService: GoodService,
    private domicilieService: DomicileService,
    private modalService: BsModalService,
    private router: Router,
    private stateService: StateOfRepublicService,
    private goodsQueryService: GoodsQueryService,
    private massiveGoodService: MassiveGoodService
  ) {
    super();
    this.idProgramming = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
  }

  ngOnInit(): void {
    this.getProgrammingData();
    this.usersToProg();
    //this.getGoodProgramming();
  }

  getProgrammingData() {
    // this.formLoading = true;
    this.programmingService
      .getProgrammingId(this.idProgramming)
      .subscribe(data => {
        this.programming = data;
        this.getDelegationRegional(this.programming.regionalDelegationNumber);
        this.getTransferent(this.programming.tranferId);
        this.getState(this.programming);
        this.getStation(this.programming.stationId, this.programming.tranferId);
        this.getAuthority(
          this.programming.autorityId,
          this.programming.tranferId
        );
        this.getTypeRelevant(this.programming.typeRelevantId);
        this.getStore(this.programming.storeId);

        this.paramsTransportableGoods
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.filterStatusTrans());

        this.paramsGuardGoods
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.showGuard());

        this.paramsWarehouseGoods
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.showWarehouseGoods());
      });
  }

  getDelegationRegional(idDelegation: number) {
    this.params.getValue()['filter.id'] = idDelegation;
    this.delegationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.delegationName = response.data[0].description;
        this.params = new BehaviorSubject<ListParams>(new ListParams());
      },
      error: error => {},
    });
  }

  getTransferent(idTransferent: number) {
    this.params.getValue()['filter.id'] = idTransferent;
    this.transferentService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.transferentName = response.data[0].nameTransferent;
        this.params = new BehaviorSubject<ListParams>(new ListParams());
      },
      error: error => {},
    });
  }

  getState(programming: Iprogramming) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.programming.stateKey;
    this.stateService.getAll(params.getValue()).subscribe({
      next: response => {
        this.stateName = response.data[0].descCondition;
      },
    });
  }

  getStation(idStation: number, idTransferent: number) {
    this.params.getValue()['filter.id'] = idStation;
    this.params.getValue()['filter.idTransferent'] = idTransferent;
    this.stationService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.stationName = response.data[0].stationName;
        this.params = new BehaviorSubject<ListParams>(new ListParams());
      },
      error: error => {},
    });
  }

  getAuthority(idAuthority: number, idTransferent: number) {
    this.params.getValue()['filter.idTransferer'] = idTransferent;
    this.params.getValue()['filter.id'] = idAuthority;
    this.authorityService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.authorityName = response.data[0].authorityName;
        this.params = new BehaviorSubject<ListParams>(new ListParams());
      },
      error: error => {},
    });
  }

  getTypeRelevant(idTypeRelevant: number) {
    this.params.getValue()['filter.id'] = idTypeRelevant;
    this.typeRelevatService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.typeRelevantName = response.data[0].description;
        this.params = new BehaviorSubject<ListParams>(new ListParams());
      },
      error: error => {},
    });
  }

  getStore(idStore: number) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.organizationCode'] = idStore;
    this.goodsQueryService.getCatStoresView(params.getValue()).subscribe({
      next: response => {
        this.warehouseName = response.data[0].name;
        this.warehouseUbication = response.data[0].address1;
        this.formLoading = false;
      },
      error: error => {},
    });
    /*this.warehouseService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.warehouseName = response.data[0].description;
        this.warehouseUbication = response.data[0].ubication;
        this.params = new BehaviorSubject<ListParams>(new ListParams());
      },
      error: error => {},
    }); */
  }

  usersToProg() {
    this.params.getValue()['filter.programmingId'] = this.idProgramming;
    this.programmingService
      .getUsersProgramming(this.params.getValue())
      .subscribe({
        next: response => {
          const userData = response.data.map(items => {
            items.userCharge = items.charge?.description;
            return items;
          });
          if (userData.length > 0) {
            this.usersToProgramming.load(userData);
          } else {
            this.usersToProgramming.load([]);
          }
          this.totalItemsUsers = response.count;
          this.params = new BehaviorSubject<ListParams>(new ListParams());
        },
        error: error => {},
      });
  }

  getAliasWarehouse(idAddress: number) {
    return new Promise((resolve, reject) => {
      this.domicilieService.getById(idAddress).subscribe({
        next: response => {
          resolve(response.aliasWarehouse);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  showGood(item: IGoodProgrammingSelect) {
    let config = { ...MODAL_CONFIG, class: 'modal-xl modal-dialog-centered' };
    config.initialState = {
      item,
      callback: () => {},
    };
    this.modalService.show(DetailGoodProgrammingFormComponent, config);
  }

  filterStatusTrans() {
    this.formLoadingTransportable = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.idProgramming;
    params.getValue()['filter.status'] = 'EN_TRANSPORTABLE';
    this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
      next: async data => {
        this.totalItemsTransportableGoods = data.count;
        this.headingTransportable = `Transportable(${data.count})`;
        const showTransportable: any = [];
        data.data.map((item: IGoodProgramming) => {
          this.paramsShowTransportable.getValue()['filter.id'] = item.goodId;
          this.goodService
            .getAll(this.paramsShowTransportable.getValue())
            .subscribe({
              next: async data => {
                data.data.map(async item => {
                  const aliasWarehouse: any = await this.getAliasWarehouse(
                    item.addressId
                  );
                  item['aliasWarehouse'] = aliasWarehouse;

                  if (item.physicalStatus == 1)
                    item['physicalStatus'] = 'BUENO';
                  if (item.physicalStatus == 2) item['physicalStatus'] = 'MALO';
                  showTransportable.push(item);

                  this.goodsTranportables.load(showTransportable);
                  this.totalItemsTransportableGoods =
                    this.goodsTranportables.count();
                  this.formLoadingTransportable = false;
                });
              },
            });
        });
      },
      error: error => {
        this.formLoadingTransportable = false;
      },
    });
  }

  showGuard() {
    this.formLoadingGuard = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.idProgramming;
    params.getValue()['filter.status'] = 'EN_RESGUARDO_TMP';
    this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
      next: async data => {
        this.totalItemsGuardGood = data.count;
        this.headingGuard = `Resguardo(${data.count})`;
        const showGuard: any = [];
        data.data.map((item: IGoodProgramming) => {
          this.paramsShowTransportable.getValue()['filter.id'] = item.goodId;
          this.goodService
            .getAll(this.paramsShowTransportable.getValue())
            .subscribe({
              next: async data => {
                data.data.map(async item => {
                  const aliasWarehouse: any = await this.getAliasWarehouse(
                    item.addressId
                  );
                  item['aliasWarehouse'] = aliasWarehouse;

                  if (item.statePhysicalSae == 1)
                    item['statePhysicalSae'] = 'BUENO';
                  if (item.statePhysicalSae == 2)
                    item['statePhysicalSae'] = 'MALO';
                  showGuard.push(item);
                  this.goodsGuards.load(showGuard);
                  this.formLoadingGuard = false;
                });
              },
            });
        });
      },
      error: error => {
        this.formLoadingGuard = false;
      },
    });
  }

  showWarehouseGoods() {
    this.formLoadingWarehouse = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.idProgramming;
    params.getValue()['filter.status'] = 'EN_ALMACEN_TMP';

    this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
      next: async data => {
        this.totalItemsWarehouse = data.count;
        this.headingWarehouse = `Almacén INDEP(${data.count})`;
        const showWarehouse: any = [];
        data.data.map((item: IGoodProgramming) => {
          this.paramsShowWarehouse.getValue()['filter.id'] = item.goodId;
          this.goodService
            .getAll(this.paramsShowWarehouse.getValue())
            .subscribe({
              next: async data => {
                data.data.map(async item => {
                  const aliasWarehouse: any = await this.getAliasWarehouse(
                    item.addressId
                  );
                  item['aliasWarehouse'] = aliasWarehouse;

                  if (item.statePhysicalSae == 1)
                    item['statePhysicalSae'] = 'BUENO';
                  if (item.statePhysicalSae == 2)
                    item['statePhysicalSae'] = 'MALO';
                  showWarehouse.push(item);
                  this.goodsWarehouse.load(showWarehouse);
                  this.formLoadingWarehouse = false;
                });
              },
            });
        });
      },
      error: error => {
        this.formLoadingWarehouse = false;
      },
    });
  }

  generateReport(statusGoood: string, nameExcel: string) {
    if (statusGoood == 'EN_TRANSPORTABLE') {
      this.goodsTranportables.getElements().then(info => {
        if (info.length > 0) {
          this.loadingReportGoods = true;
          const params = new BehaviorSubject<ListParams>(new ListParams());
          params.getValue()[
            'filter.programmingId'
          ] = `$eq:${this.idProgramming}`;
          params.getValue()['filter.status'] = statusGoood;
          this.massiveGoodService
            .exportGoodProgramming(params.getValue())
            .subscribe({
              next: response => {
                this.loadingReportGoods = false;
                this.downloadExcel(response.base64File, nameExcel);
              },
              error: error => {
                this.alert(
                  'warning',
                  'Acción Invalida',
                  'No se pudo generar el reporte'
                );
                this.loadingReportGoods = false;
              },
            });
        } else {
          this.alert(
            'warning',
            'Acción Invalida',
            'No se encontraron bienes para generar el reporte'
          );
        }
      });
    }

    if (statusGoood == 'EN_RESGUARDO_TMP') {
      this.goodsGuards.getElements().then(info => {
        if (info.length > 0) {
          this.loadingReportGoods = true;
          const params = new BehaviorSubject<ListParams>(new ListParams());
          params.getValue()[
            'filter.programmingId'
          ] = `$eq:${this.idProgramming}`;
          params.getValue()['filter.status'] = statusGoood;
          this.massiveGoodService
            .exportGoodProgramming(params.getValue())
            .subscribe({
              next: response => {
                this.loadingReportGoods = false;
                this.downloadExcel(response.base64File, nameExcel);
              },
              error: error => {
                this.alert(
                  'warning',
                  'Acción Invalida',
                  'No se pudo generar el reporte'
                );
                this.loadingReportGoods = false;
              },
            });
        } else {
          this.alert(
            'warning',
            'Acción Invalida',
            'No se encontraron bienes para generar el reporte'
          );
        }
      });
    }

    if (statusGoood == 'EN_ALMACEN_TMP') {
      this.goodsWarehouse.getElements().then(info => {
        if (info.length > 0) {
          this.loadingReportGoods = true;
          const params = new BehaviorSubject<ListParams>(new ListParams());
          params.getValue()[
            'filter.programmingId'
          ] = `$eq:${this.idProgramming}`;
          params.getValue()['filter.status'] = statusGoood;
          this.massiveGoodService
            .exportGoodProgramming(params.getValue())
            .subscribe({
              next: response => {
                this.loadingReportGoods = false;
                this.downloadExcel(response.base64File, nameExcel);
              },
              error: error => {
                this.alert(
                  'warning',
                  'Acción Invalida',
                  'No se pudo generar el reporte'
                );
                this.loadingReportGoods = false;
              },
            });
        } else {
          this.alert(
            'warning',
            'Acción Invalida',
            'No se encontraron bienes para generar el reporte'
          );
        }
      });
    }
  }

  downloadExcel(excel: any, nameReport: string) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excel}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.download = nameReport;
    downloadLink.click();
    this.alert('success', 'Acción Correcta', 'Archivo generado');
  }

  backTask() {
    this.router.navigate(['pages/siab-web/sami/consult-tasks']);
  }
}
