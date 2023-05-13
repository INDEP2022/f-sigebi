import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { addDays } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, takeUntil, throwError } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { minDate } from 'src/app/common/validations/date.validators';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { IDelegationState } from 'src/app/core/models/catalogs/delegation-state.model';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { ITypeRelevant } from 'src/app/core/models/catalogs/type-relevant.model';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import {
  IGoodProgramming,
  IGoodProgrammingSelect,
} from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IGood } from 'src/app/core/models/good/good.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { DomicileService } from 'src/app/core/services/catalogs/domicile.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TransferentesSaeService } from 'src/app/core/services/catalogs/transferentes-sae.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ProgrammingGoodService } from '../../../../../core/services/ms-programming-request/programming-good.service';
import { WarehouseFormComponent } from '../../../shared-request/warehouse-form/warehouse-form.component';
import { ESTATE_COLUMNS } from '../../acept-programming/columns/estate-columns';
import { SearchUserFormComponent } from '../../schedule-reception/search-user-form/search-user-form.component';
import { userData } from '../../schedule-reception/search-user-form/users-data';
import { DetailGoodProgrammingFormComponent } from '../../shared-components-programming/detail-good-programming-form/detail-good-programming-form.component';
import { EstateSearchFormComponent } from '../estate-search-form/estate-search-form.component';
import { IEstateSearch } from '../estate-search-form/estate-search.interface';
import { UserFormComponent } from '../user-form/user-form.component';
import { WarehouseSelectFormComponent } from '../warehouse-select-form/warehouse-select-form.component';
import {
  settingGuard,
  settingTransGoods,
  SettingUserTable,
  settingWarehouse,
} from './settings-tables';

@Component({
  selector: 'app-perform-programming-form',
  templateUrl: './perform-programming-form.component.html',
  styles: [],
})
export class PerformProgrammingFormComponent
  extends BasePage
  implements OnInit
{
  goodsInfoTrans: any[] = [];
  goodsInfoGuard: any[] = [];
  goodsInfoWarehouse: any[] = [];
  userInfo: any;
  estatesList: LocalDataSource = new LocalDataSource();
  goodSelect: IGoodProgrammingSelect[] = [];
  goodsTranportables: LocalDataSource = new LocalDataSource();
  goodsGuards: LocalDataSource = new LocalDataSource();
  goodsWarehouse: LocalDataSource = new LocalDataSource();
  usersToProgramming: LocalDataSource = new LocalDataSource();
  dataSearch: IEstateSearch;
  dataProgramming: Iprogramming;
  regionalDelegationUser: IRegionalDelegation;
  performForm: FormGroup = new FormGroup({});
  estateForm: FormGroup = new FormGroup({});
  regionalsDelegations = new DefaultSelect<IRegionalDelegation>();
  states = new DefaultSelect<IDelegationState>();
  transferences = new DefaultSelect<ITransferente>();
  stations = new DefaultSelect<IStation>();
  authorities = new DefaultSelect<IAuthority>();
  typeRelevant = new DefaultSelect<ITypeRelevant>();
  warehouse = new DefaultSelect<IWarehouse>();
  warehouseUbication: string = '';
  tranportableItems: number = 0;
  headingTransportable: string = `Transportables(0)`;
  headingGuard: string = `Resguardo(0)`;
  headingWarehouse: string = `Almacén SAE(0)`;
  idProgramming: number = 0;
  idAuthority: string = '';
  idState: string = '';
  idTrans: number = 0;
  idStation: number = 0;
  idTypeRelevant: number = 0;
  showForm: boolean = false;
  showUbication: boolean = false;
  showSelectTransferent: boolean = false;
  showSelectStation: boolean = false;
  showSelectAuthority: boolean = false;
  showWarehouseInfo: boolean = false;
  loadingGoods: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  paramsTransportableGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsTransportableGoods: number = 0;
  totalItemsTransportableGuard: number = 0;
  totalItemsTransportableWarehouse: number = 0;
  paramsGuardGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsGuardGoods: number = 0;
  paramsWarehouseGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsWarehouseGoods: number = 0;
  paramsUsers = new BehaviorSubject<ListParams>(new ListParams());
  paramsGoodsProg = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsUsers: number = 0;
  loadGoods: boolean = false;
  delegationId: number = 0;
  delRegUserLog: string = '';
  showGoods: IGoodProgramming;
  settingUser = { ...this.settings, ...SettingUserTable };

  settingsTransportableGoods = { ...this.settings, ...settingTransGoods };

  settingGuardGoods = {
    ...this.settings,
    ...settingGuard,
  };

  settingWarehouseGoods = {
    ...this.settings,
    ...settingWarehouse,
  };

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private programmingGoodService: ProgrammingGoodService,
    private stationService: StationService,
    private regionalDelegationService: RegionalDelegationService,
    private stateService: DelegationStateService,
    private transferentService: TransferenteService,
    private typeRelevantService: TypeRelevantService,
    private warehouseService: WarehouseService,
    private authorityService: AuthorityService,
    private goodsQueryService: GoodsQueryService,
    private activatedRoute: ActivatedRoute,
    private programmingService: ProgrammingRequestService,
    private goodService: GoodService,
    private showHideErrorInterceptorService: showHideErrorInterceptorService,
    private transferentesSaeService: TransferentesSaeService,
    private domicilieService: DomicileService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: {
        ...ESTATE_COLUMNS,
        name: {
          title: 'Selección bienes',
          sort: false,
          position: 'left',
          type: 'custom',
          valuePrepareFunction: (user: any, row: any) =>
            this.isGoodSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodChange(instance),
        },
      },
    };

    this.idProgramming = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    this.showHideErrorInterceptorService.showHideError(false);
    this.prepareForm();
    this.getInfoUserLog();
    this.getProgrammingData();
    this.getRegionalDelegationSelect(new ListParams());
    this.getTypeRelevantSelect(new ListParams());
    this.showUsersProgramming();
    //this.getGoodsProgTrans();
  }

  //Información de el usuario logeado//
  getInfoUserLog() {
    this.programmingService.getUserInfo().subscribe(data => {
      this.userInfo = data;
      this.delRegUserLog = this.userInfo.delegacionreg;
    });
  }

  //Información de la programación//
  getProgrammingData() {
    this.programmingService
      .getProgrammingId(this.idProgramming)
      .subscribe(data => {
        this.dataProgramming = data;
      });
  }

  isGoodSelected(good: any) {
    const exist = this.goodSelect.find(_good => _good.idGood == good.idGood);
    if (!exist) return false;
    return true;
  }
  onGoodChange(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.sendGood(data.row, data.toggle),
    });
  }

  sendGood(good: any, selected: boolean) {
    if (selected) {
      this.goodSelect.push(good);
      console.log('good', good);
    } else {
      this.goodSelect = this.goodSelect.filter(
        _good => _good.idGood != _good.idGood
      );
    }
  }

  prepareForm() {
    const fiveDays = addDays(new Date(), 5);
    this.performForm = this.fb.group({
      emailTransfer: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(EMAIL_PATTERN),
        ],
      ],
      address: [
        null,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      city: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      startDate: [null, [Validators.required, minDate(new Date())]],
      endDate: [null, [Validators.required, minDate(new Date(fiveDays))]],
      observation: [
        null,
        [Validators.maxLength(400), Validators.pattern(STRING_PATTERN)],
      ],
      regionalDelegationNumber: [null, [Validators.required]],
      stateKey: [null, [Validators.required]],
      tranferId: [null, [Validators.required]],
      stationId: [null, [Validators.required]],
      autorityId: [null, [Validators.required]],
      typeRelevantId: [null, [Validators.required]],
      storeId: [null],
    });
  }

  searchEstate() {
    this.estateForm = this.fb.group({
      akaWarehouse: [null],
      state: [null],
      municipality: [null],
      colony: [null],
      cp: [null],
    });
  }

  typeSchedule(type: ITypeRelevant) {
    if (type.id != null) {
      this.showForm = true;
      this.idTypeRelevant = type.id;
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoods());
    }
  }

  showWarehouse(warehouse: IWarehouse) {
    this.warehouseUbication = warehouse.ubication;
    this.showUbication = true;
  }

  openForm(userData?: any) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    const idProgramming = this.idProgramming;
    config.initialState = {
      userData,
      idProgramming,
      callback: (data: boolean, create: boolean) => {
        if (data && create) {
          this.onLoadToast('success', 'Correcto', 'Usuario creado');
          this.showUsersProgramming();
        } else if (data) {
          this.onLoadToast('success', 'Correcto', 'Usuario modificado');
          this.showUsersProgramming();
        }
      },
    };

    const rejectionComment = this.modalService.show(UserFormComponent, config);
  }

  newWarehouse() {
    if (this.regionalDelegationUser) {
      const regDelData = this.regionalDelegationUser;
      let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
      config.initialState = {
        regDelData,
        callback: (next: boolean) => {},
      };

      const constShowWarehouse = this.modalService.show(
        WarehouseFormComponent,
        config
      );
    } else {
      this.onLoadToast(
        'warning',
        'Advertencia',
        'Para crear un almacén necesitas seleccionar una Delegación Regional'
      );
    }
  }

  listUsers() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    const typeUser = this.dataProgramming.typeUser;
    const idProgramming = this.idProgramming;
    const delegationUserLog = this.delRegUserLog;

    console.log('delegation', this.delegationId);
    config.initialState = {
      typeUser,
      idProgramming,
      delegationUserLog,
      callback: (data: boolean) => {
        if (data) {
          this.onLoadToast(
            'success',
            'Correcto',
            'Usuarios agregados a la programación correctamente'
          );
          this.showUsersProgramming();
        }
      },
    };

    const searchUser = this.modalService.show(SearchUserFormComponent, config);
  }

  //Mostrar lista de uusarios afiliados a la programación
  showUsersProgramming() {
    this.paramsUsers.getValue()['filter.programmingId'] = this.idProgramming;
    this.programmingService
      .getUsersProgramming(this.paramsUsers.getValue())
      .subscribe({
        next: response => {
          const userData = response.data.map(items => {
            items.userCharge = items.charge?.description;
            return items;
          });

          this.usersToProgramming.load(userData);
          this.totalItemsUsers = response.count;
        },
        error: error => {},
      });
  }

  estateSearch() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      userData,
      callback: (data: IEstateSearch) => {
        if (data) {
          this.dataSearch = data;
          this.showGoodsProgramming();
        }
      },
    };

    const estateSearch = this.modalService.show(
      EstateSearchFormComponent,
      config
    );
  }

  showGoodsProgramming() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getProgGoods());
  }

  getRegionalDelegationSelect(params?: ListParams) {
    //Delegation regional user login //
    this.programmingService.getUserInfo().subscribe((data: any) => {
      this.regionalDelegationService
        .getById(data.department)
        .subscribe((delegation: IRegionalDelegation) => {
          console.log('Delegación regional', delegation);
          this.delegationId = delegation.id;
          this.performForm
            .get('regionalDelegationNumber')
            .setValue(delegation.description);
          this.regionalDelegationUser = delegation;
          this.getStateSelect(new ListParams());
        });
    });

    if (params.text) {
      this.regionalDelegationService.search(params).subscribe(data => {
        this.regionalsDelegations = new DefaultSelect(data.data, data.count);
      });
    } else {
      this.regionalDelegationService.getAll(params).subscribe(data => {
        this.regionalsDelegations = new DefaultSelect(data.data, data.count);
      });
    }
  }

  regionalDelegationSelect(item: IRegionalDelegation) {
    this.regionalDelegationUser = item;
    this.getStateSelect(new ListParams());
  }

  getStateSelect(params?: ListParams) {
    params['filter.regionalDelegation'] = this.regionalDelegationUser.id;
    this.stateService.getAll(params).subscribe(data => {
      const filterStates = data.data.filter(_states => {
        return _states.stateCode;
      });

      const states = filterStates.map(items => {
        return items.stateCode;
      });

      this.states = new DefaultSelect(states, data.count);
    });
  }

  stateSelect(state: IStateOfRepublic) {
    this.idState = state.id;
    this.getTransferentSelect(new ListParams());
    this.getWarehouseSelect(new ListParams());
    if (this.idTrans) this.getStations(new ListParams());
  }

  getTransferentSelect(params?: ListParams) {
    if (this.idState) {
      params['filter.transferent.nameTransferent'] = `$ilike:${params.text}`;
      params['sortBy'] = 'nameTransferent:ASC';
      this.showSelectTransferent = true;
      const state = Number(this.idState);
      this.transferentesSaeService
        .getStateByTransferentKey(state, params)
        .subscribe({
          next: response => {
            const transferent = response.data.map(transferent => {
              return transferent.transferent;
            });
            this.transferences = new DefaultSelect(transferent, response.count);
          },
          error: error => {
            console.log(error);
          },
        });
    }
  }

  transferentSelect(transferent: ITransferente) {
    this.idTrans = transferent.id;
    this.getStations(new ListParams());
  }

  getStations(params?: ListParams) {
    if (this.idTrans && this.idState) {
      this.showSelectStation = true;
      params['filter.idTransferent'] = this.idTrans;
      params['filter.keyState'] = this.idState;
      this.stationService.getAll(params).subscribe(data => {
        this.stations = new DefaultSelect(data.data, data.count);
      });
    }
  }

  stationSelect(item: IStation) {
    this.idStation = item.id;
    this.getAuthoritySelect(new ListParams());
  }

  getAuthoritySelect(params?: ListParams) {
    if (this.idTrans && this.idStation) {
      const columns = {
        idTransferer: this.idTrans,
        idStation: this.idStation,
      };

      this.authorityService.postByColumns(params, columns).subscribe(data => {
        this.authorities = new DefaultSelect(data.data, data.count);

        this.showSelectAuthority = true;
      });
    }
  }

  authoritySelect(item: IAuthority) {
    this.idAuthority = item.idAuthority;
  }

  getTypeRelevantSelect(params: ListParams) {
    this.typeRelevantService.getAll(params).subscribe(data => {
      this.typeRelevant = new DefaultSelect(data.data, data.count);
    });
  }

  getWarehouseSelect(params: ListParams) {
    if (this.idState) {
      this.showWarehouseInfo = true;
      params['filter.stateCode'] = this.idState;
      if (params.text) {
        this.warehouseService.search(params).subscribe(data => {
          this.warehouse = new DefaultSelect(data.data, data.count);
        });
      } else {
        this.warehouseService.getAll(params).subscribe(data => {
          this.warehouse = new DefaultSelect(data.data, data.count);
        });
      }
    }
  }

  //Visualizar bienes transportables //

  getProgGoods() {
    this.loadingGoods = true;
    const filterColumns: Object = {
      regionalDelegation: Number(this.regionalDelegationUser.id),
      transferent: Number(this.idTrans),
      relevantType: Number(this.idTypeRelevant),
      statusGood: 'APROBADO',
    };
    console.log('filter', filterColumns);
    this.goodsQueryService
      .postGoodsProgramming(this.params.getValue(), filterColumns)
      .subscribe({
        next: response => {
          const goodsFilter = response.data.map(items => {
            if (items.physicalState == 1) {
              items.physicalState = 'BUENO';
              return items;
            } else if (items.physicalState == 2) {
              items.physicalState = 'MALO';
              return items;
            }
          });
          this.filterGoodsProgramming(goodsFilter);
          //this.estatesList.load(goodsFilter);
          //this.totalItems = response.count;
          this.loadingGoods = false;
        },
        error: error => (this.loadingGoods = false),
      });
  }

  filterGoodsProgramming(goods: any[]) {
    this.paramsGoodsProg.getValue()['filter.programmingId'] =
      this.idProgramming;
    this.programmingService
      .getGoodsProgramming(this.paramsGoodsProg.getValue())
      .pipe(
        catchError(error => {
          if (error.status == 400) {
            this.GoodsProgramming(goods);
          }
          return throwError(() => error);
        })
      )
      .subscribe(data => {
        const filter = goods.filter(good => {
          const index = data.data.findIndex(
            _good => _good.goodId == good.goodNumber
          );
          return index >= 0 ? false : true;
        });

        if (filter.length > 0) {
          this.estatesList.load(filter);
          this.totalItems = this.estatesList.count();
          this.loadingGoods = false;
        } else {
          this.onLoadToast(
            'warning',
            'No hay bienes disponibles para programar',
            ''
          );
        }
      });
  }

  //bienes ya programados
  GoodsProgramming(goodsFilter: any) {
    this.estatesList.load(goodsFilter);
    this.totalItems = this.estatesList.count();
  }

  sendTransportable() {
    if (this.goodSelect.length) {
      this.alertQuestion(
        'info',
        'Acción',
        'Los bienes seleccionados serán enviados a transportable'
      ).then(question => {
        if (question.isConfirmed) {
          this.insertGoodsProgTrans();
        }
      });
    } else {
      this.alert('warning', 'Error', 'Se necesita tener un bien seleccionado');
    }
  }

  /*------Inserta bienes con status transportable -----*/
  async insertGoodsProgTrans() {
    this.goodSelect.map((item: any) => {
      const formData: Object = {
        programmingId: this.idProgramming,
        creationUser: this.userInfo.name,
        modificationUser: this.userInfo.name,
        goodId: item.goodNumber,
        version: '1',
        status: 'EN_TRANSPORTABLE',
      };
      this.programmingGoodService.createGoodsService(formData).subscribe({
        next: () => {},
        error: error => {
          console.log(error);
        },
      });
    });

    const goods: any = await this.changeStatusGoodTrans();
    if (goods) {
      this.showGoodsTransportable(goods);
    }
  }

  /*------------Cambiar status del bien a transportable ------------------*/
  changeStatusGoodTrans() {
    return new Promise(async (resolve, reject) => {
      this.goodSelect.map(item => {
        const formData: Object = {
          id: Number(item.goodNumber),
          goodId: item.googId,
          programmationStatus: 'EN_TRANSPORTABLE',
        };
        this.goodService.updateByBody(formData).subscribe({
          next: () => {},
        });
      });

      const showGoods: any = await this.getFilterGood('EN_TRANSPORTABLE');
      if (showGoods) {
        resolve(showGoods);
      }
    });
  }

  showGoodsTransportable(showGoods: IGoodProgramming[]) {
    console.log('Mostrar', showGoods);
    showGoods.map((items: any) => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: async response => {
          console.log('bienes transportables', response);
          const aliasWarehouse = await this.getAliasWarehouse(
            response.addressId
          );
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          response['aliasWarehouse'] = aliasWarehouse;
          this.goodsInfoTrans.push(response);
          this.goodsTranportables.load(this.goodsInfoTrans);
          this.totalItemsTransportableGoods = this.goodsTranportables.count();
          this.headingTransportable = `Transportable(${this.goodsTranportables.count()})`;
          this.getProgGoods();
          this.goodSelect = [];
        },
      });
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
  /*------------Visualizar bienes programables transportables ---------------*/
  getFilterGood(type: string) {
    return new Promise((resolve, reject) => {
      this.paramsTransportableGoods.getValue()['filter.programmingId'] =
        this.idProgramming;

      this.programmingService
        .getGoodsProgramming(this.paramsTransportableGoods.getValue())
        .subscribe(data => {
          const filterGood = data.data.filter(item => {
            return item.status == type;
          });
          resolve(filterGood);
          //
        });
    });
  }

  /*-------------Filtrar bienes tranportable --------------*/

  getGoodsTransportable(data: IGoodProgramming[]) {
    return new Promise((resolve, reject) => {
      const filterTrans = data.filter(item => {
        return item.status == 'EN_TRANSPORTABLE';
      });
      resolve(filterTrans);
    });
  }

  /*------------ Enviar datos a resguardo ----------------------*/
  sendGuard() {
    if (this.goodSelect.length) {
      this.alertQuestion(
        'info',
        'Acción',
        'Los bienes seleccionados serán enviados a resguardo'
      ).then(question => {
        if (question.isConfirmed) {
          let config = {
            ...MODAL_CONFIG,
            class: 'modal-lg modal-dialog-centered',
          };
          const idTransferent = this.idTrans;
          config.initialState = {
            idTransferent,
            callback: (data: any) => {
              if (data) this.addGoodsGuards(data);
            },
          };

          this.modalService.show(WarehouseSelectFormComponent, config);
        }
      });
    } else {
      this.alert('warning', 'Error', 'Se necesita tener un bien seleccionado');
    }
  }

  async addGoodsGuards(data: any) {
    //console.log('Almacén a guardar ', data);
    this.goodSelect.map((item: any) => {
      const formData: Object = {
        programmingId: this.idProgramming,
        creationUser: this.userInfo.name,
        modificationUser: this.userInfo.name,
        goodId: item.goodNumber,
        version: '1',
        status: 'EN_RESGUARDO',
      };
      this.programmingGoodService
        .createGoodsService(formData)
        .subscribe(() => {});
    });

    const goods: any = await this.changeStatusGoodGuard();
    if (goods) {
      this.showGoodsGuard(goods);
    }
    this.getProgGoods();
  }

  /*------------Cambio de status a resguardo ------------------*/
  changeStatusGoodGuard() {
    return new Promise(async (resolve, reject) => {
      this.goodSelect.map((item: any) => {
        const formData: Object = {
          id: Number(item.goodNumber),
          goodId: item.googId,
          programmationStatus: 'EN_RESGUARDO',
        };

        this.goodService.updateByBody(formData).subscribe({
          next: () => {},
        });
      });
      const showGoods: any = await this.getFilterGood('EN_RESGUARDO');
      if (showGoods) {
        resolve(showGoods);
      }
    });
  }

  showGoodsGuard(showGoods: IGoodProgramming[]) {
    console.log('Mostrar', showGoods);
    showGoods.map((items: any) => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: async response => {
          console.log('bienes RESGUARDO', response);
          const aliasWarehouse = await this.getAliasWarehouse(
            response.addressId
          );
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          response['aliasWarehouse'] = aliasWarehouse;
          this.goodsInfoTrans.push(response);
          this.goodsGuards.load(this.goodsInfoTrans);
          this.totalItemsTransportableGuard = this.goodsGuards.count();
          this.headingGuard = `Resguardo(${this.goodsGuards.count()})`;
        },
      });
    });
  }

  /* Enviar datos a almacén */
  sendWarehouse() {
    if (this.goodSelect.length) {
      this.alertQuestion(
        'info',
        'Acción',
        'Los bienes seleccionados serán enviado a almacén'
      ).then(question => {
        if (question.isConfirmed) {
          let config = {
            ...MODAL_CONFIG,
            class: 'modal-lg modal-dialog-centered',
          };
          const idTransferent = this.idTrans;
          config.initialState = {
            idTransferent,
            callback: (data: any) => {
              if (data) this.addGoodsWarehouse();
            },
          };

          this.modalService.show(WarehouseSelectFormComponent, config);
        }
      });
    } else {
      this.alert('warning', 'Error', 'Se necesita tener un bien seleccionado');
    }
  }

  async addGoodsWarehouse() {
    this.goodSelect.map((item: any) => {
      const formData: Object = {
        programmingId: this.idProgramming,
        creationUser: this.userInfo.name,
        modificationUser: this.userInfo.name,
        goodId: item.goodNumber,
        version: '1',
        status: 'EN_ALMACEN',
      };
      this.programmingGoodService
        .createGoodsService(formData)
        .subscribe(() => {});
    });

    const goods: any = await this.changeStatusGoodWarehouse();
    if (goods) {
      this.showGoodsWarehouse(goods);
    }
  }

  //Cambio de status en la programación//

  async changeStatusGoodWarehouse() {
    return new Promise(async (resolve, reject) => {
      this.goodSelect.map((item: any) => {
        console.log('tem', item);
        const formData: Object = {
          id: Number(item.goodNumber),
          goodId: item.googId,
          programmationStatus: 'EN_ALMACEN',
        };
        this.goodService.updateByBody(formData).subscribe({
          next: () => {},
        });
      });

      const showGoods: any = await this.getFilterGood('EN_ALMACEN');
      if (showGoods) {
        resolve(showGoods);
      }
    });
  }

  //filtrar información por almacén //

  async showGoodsWarehouse(showGoods: IGoodProgramming[]) {
    console.log('Mostrar', showGoods);
    showGoods.map((items: any) => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: async response => {
          console.log('bienes ALMACÉN', response);
          const aliasWarehouse = await this.getAliasWarehouse(
            response.addressId
          );
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          response['aliasWarehouse'] = aliasWarehouse;
          this.goodsInfoTrans.push(response);
          this.goodsWarehouse.load(this.goodsInfoTrans);
          this.totalItemsTransportableWarehouse = this.goodsWarehouse.count();
          this.headingWarehouse = `Almacén SAE(${this.goodsWarehouse.count()})`;
        },
      });
    });
  }

  // Visualizar información del bien //
  showGood(item: IGoodProgrammingSelect) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      item,
      callback: () => {},
    };
    this.modalService.show(DetailGoodProgrammingFormComponent, config);
  }

  removeGoodTrans(item: IGood) {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea eliminar el bien de transportable?'
    ).then(question => {
      if (question.isConfirmed) {
        this.removeStatusGood(item);
        const formData: Object = {
          programmingId: this.idProgramming,
          goodId: item.id,
        };
        this.programmingGoodService
          .deleteGoodProgramming(formData)
          .subscribe(() => {
            this.onLoadToast(
              'success',
              'Bien eliminado de transportable correctamente',
              ''
            );
          });
      }
    });
  }

  removeStatusGood(good: IGood) {
    const _good: Object = {
      id: good.id,
      programmationStatus: null,
    };
    this.goodService.updateByBody(_good).subscribe({
      next: res => {
        this.goodsInfoTrans = [];
        //this.getGoodsProgTrans();
      },
      error: error => {},
    });
  }

  removeGoodGuard(item: IGoodProgrammingSelect) {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea remover el bien?'
    ).then(question => {
      if (question.isConfirmed) {
        this.goodsGuards.remove(item);
        this.estatesList.getElements().then(items => {
          items.push(item);
          this.estatesList.load(items);
          this.headingGuard = `Resguardo(${this.goodsGuards.count()})`;
          this.totalItems = this.totalItems + 1;
          this.onLoadToast('success', 'Bien removido correctamente', '');
        });
      }
    });
  }

  removeGoodWarehouse(item: IGoodProgrammingSelect) {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea remover el bien?'
    ).then(question => {
      if (question.isConfirmed) {
        this.goodsWarehouse.remove(item);
        this.estatesList.getElements().then(items => {
          items.push(item);
          this.estatesList.load(items);
          this.headingWarehouse = `Almacén SAT(${this.goodsWarehouse.count()})`;
          this.totalItems = this.totalItems + 1;
          this.onLoadToast('success', 'Bien removido correctamente', '');
        });
      }
    });
  }

  //Actualizar programación con información de la programación
  confirm() {
    this.loading = true;
    console.log(this.performForm.value);
    console.log('primeros datos a guardar', this.performForm.value);
    this.programmingGoodService
      .updateProgramming(this.idProgramming, this.performForm.value)
      .subscribe(() => {
        this.loading = false;
        this.onLoadToast('success', 'Programacíón guardada correctamente', '');
      });
  }

  delete(user: any) {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea eliminar el usuario de la programación?'
    ).then(question => {
      if (question.isConfirmed) {
        console.log('user', user);
        let userObject: Object = {
          programmingId: Number(user.programmingId),
          email: user.email,
        };
        console.log(userObject);
        this.programmingService.deleteUserProgramming(userObject).subscribe({
          next: () => {
            this.onLoadToast('success', 'Usuario eliminado correctamente', '');
            this.showUsersProgramming();
          },
          error: error => {},
        });
      }
    });
  }

  close() {
    this.modalService.hide();
  }
}
