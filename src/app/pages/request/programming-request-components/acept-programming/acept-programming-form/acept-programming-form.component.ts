import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IGoodProgramming,
  IGoodProgrammingSelect,
} from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ConfirmProgrammingComponent } from '../../../shared-request/confirm-programming/confirm-programming.component';
import { ElectronicSignatureListComponent } from '../../../shared-request/electronic-signature-list/electronic-signature-list.component';
import { ShowProgrammingComponent } from '../../../shared-request/show-programming/show-programming.component';
import { ShowSignatureProgrammingComponent } from '../../../shared-request/show-signature-programming/show-signature-programming.component';
import {
  settingGuard,
  settingTransGoods,
  settingWarehouse,
} from '../../perform-programming/perform-programming-form/settings-tables';
import { DetailGoodProgrammingFormComponent } from '../../shared-components-programming/detail-good-programming-form/detail-good-programming-form.component';
import { RejectProgrammingFormComponent } from '../../shared-components-programming/reject-programming-form/reject-programming-form.component';
import { ESTATE_COLUMNS } from '../columns/estate-columns';
import { USER_COLUMNS } from '../columns/users-columns';

@Component({
  selector: 'app-acept-programming-form',
  templateUrl: './acept-programming-form.component.html',
  styles: [],
})
export class AceptProgrammingFormComponent extends BasePage implements OnInit {
  estateSettings = {
    ...this.settings,
    actions: false,
    columns: ESTATE_COLUMNS,
  };

  settingsTransportableGoods = { ...this.settings, ...settingTransGoods };

  settingGuardGoods = {
    ...this.settings,
    ...settingGuard,
  };

  settingWarehouseGoods = {
    ...this.settings,
    ...settingWarehouse,
  };

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalItemsTransportable: number = 0;
  totalItemsWarehouse: number = 0;
  idTransferent: any;
  idStation: any;
  programming: Iprogramming;
  usersData: any[] = [];
  estateData: any[] = [];
  programmingId: number = 0;

  goodsTranportables: LocalDataSource = new LocalDataSource();
  goodsGuards: LocalDataSource = new LocalDataSource();
  goodsWarehouse: LocalDataSource = new LocalDataSource();

  headingTransportable: string = `Transportables(0)`;
  headingGuard: string = `Resguardo(0)`;
  headingWarehouse: string = `Almacén SAE(0)`;
  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private programmingService: ProgrammingRequestService,
    private regionalDelegationService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private stationService: StationService,
    private authorityService: AuthorityService,
    private typeRelevantService: TypeRelevantService,
    private warehouseService: WarehouseService
  ) {
    super();
    this.settings = { ...this.settings, actions: false, columns: USER_COLUMNS };
    this.programmingId = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    this.getProgrammingId();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getUsersProgramming());

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.showGoodProgramming());
  }

  getProgrammingId() {
    return this.programmingService
      .getProgrammingId(this.programmingId)
      .subscribe(data => {
        this.programming = data;
        this.idTransferent = data.tranferId;
        this.idStation = data.stationId;
        this.getRegionalDelegation();
        this.gettransferent();
        this.getStation();
        this.getAuthority();
        this.getTypeRelevant();
        this.getwarehouse();
        this.statusProgramming();
      });
  }

  getRegionalDelegation() {
    this.regionalDelegationService
      .getById(this.programming.regionalDelegationNumber)
      .subscribe(data => {
        this.programming.regionalDelegationNumber = data.description;
      });
  }

  gettransferent() {
    return this.transferentService
      .getById(this.programming.tranferId)
      .subscribe(data => {
        this.programming.tranferId = data.nameTransferent;
      });
  }

  getStation() {
    return this.stationService
      .getById(this.programming.stationId)
      .subscribe(data => {
        this.programming.stationId = data.stationName;
      });
  }

  getAuthority() {
    const filterColumns = {
      idAuthority: Number(this.programming.autorityId),
      idTransferer: Number(this.idTransferent),
      idStation: Number(this.idStation),
    };
    return this.authorityService.postByIds(filterColumns).subscribe(data => {
      this.programming.autorityId = data['authorityName'];
    });
  }

  getTypeRelevant() {
    return this.typeRelevantService
      .getById(this.programming.typeRelevantId)
      .subscribe(data => {
        this.programming.typeRelevantId = data.description;
      });
  }

  getwarehouse() {
    return this.warehouseService
      .getById(this.programming.storeId)
      .subscribe(data => {
        this.programming.storeId = data.description;
      });
  }

  getUsersProgramming() {
    this.loading = true;
    const ids = {
      programmingId: this.programmingId,
    };
    this.programmingService
      .getUsersProgramming(this.params.getValue(), ids)
      .subscribe({
        next: response => {
          this.usersData = [response];
          this.totalItems = this.usersData.length;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  statusProgramming() {
    //console.log('Status programación', this.programming.status);
  }

  confirm() {}

  rejectProgramming() {
    const config = MODAL_CONFIG;
    let idProgramming = this.programmingId;
    config.initialState = {
      idProgramming,
      callback: (next: boolean) => {
        if (next) {
        }
      },
    };

    this.modalService.show(RejectProgrammingFormComponent, config);
  }

  signOffice() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.showProg();
        }
      },
    };

    const confirmPro = this.modalService.show(
      ConfirmProgrammingComponent,
      config
    );
  }

  showProg() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.electronicSign();
        }
      },
    };
    const showProg = this.modalService.show(ShowProgrammingComponent, config);
  }

  electronicSign() {
    const config = MODAL_CONFIG;
    config.initialState = {
      callback: (next: boolean) => {
        if (next) {
          this.showSignProg();
        }
      },
    };

    const electronicSign = this.modalService.show(
      ElectronicSignatureListComponent,
      config
    );
  }

  showSignProg() {
    const showSignProg = this.modalService.show(
      ShowSignatureProgrammingComponent,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  showGoodProgramming() {
    this.params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getGoodsProgramming(this.params.getValue())
      .subscribe(data => {
        this.filterStatusTrans(data.data);
        this.filterStatusWarehouse(data.data);
      });
  }

  filterStatusTrans(data: IGoodProgramming[]) {
    const goodsTrans = data.filter(items => {
      return items.status == 'EN_TRANSPORTABLE';
    });
    this.headingTransportable = `Transportables(${goodsTrans.length})`;
    const viewGoods = goodsTrans.map(info => {
      return info.view;
    });
    this.goodsTranportables.load(viewGoods);
    this.totalItemsTransportable = this.goodsTranportables.count();
  }

  filterStatusWarehouse(data: IGoodProgramming[]) {
    const goodswarehouse = data.filter(items => {
      return items.status == 'EN_ALMACÉN';
    });
    this.headingWarehouse = `En almacén SAE(${goodswarehouse.length})`;
    const viewGoods = goodswarehouse.map(info => {
      return info.view;
    });
    this.goodsWarehouse.load(viewGoods);
    this.totalItemsWarehouse = this.goodsWarehouse.count();
  }

  showGood(item: IGoodProgrammingSelect) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      item,
      callback: () => {},
    };
    this.modalService.show(DetailGoodProgrammingFormComponent, config);
  }
}
