import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, takeUntil, throwError } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { minDate } from 'src/app/common/validations/date.validators';
import { IAddress } from 'src/app/core/models/administrative-processes/siab-sami-interaction/address.model';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { IDelegationState } from 'src/app/core/models/catalogs/delegation-state.model';
import { ILocality } from 'src/app/core/models/catalogs/locality.model';
import { IMunicipality } from 'src/app/core/models/catalogs/municipality.model';
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
import { ITask } from 'src/app/core/models/ms-task/task-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { DomicileService } from 'src/app/core/services/catalogs/domicile.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TransferentesSaeService } from 'src/app/core/services/catalogs/transferentes-sae.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { StoreAliasStockService } from 'src/app/core/services/ms-store/store-alias-stock.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { ProgrammingGoodService } from '../../../../../core/services/ms-programming-request/programming-good.service';
import { WarehouseFormComponent } from '../../../shared-request/warehouse-form/warehouse-form.component';
import { ESTATE_COLUMNS } from '../../acept-programming/columns/estate-columns';
import { SearchUserFormComponent } from '../../schedule-reception/search-user-form/search-user-form.component';
import { userData } from '../../schedule-reception/search-user-form/users-data';
import { DomicileFormComponent } from '../../shared-components-programming/domicile-form/domicile-form.component';
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
  // form: FormGroup = new FormGroup({});
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
  regionalDelegationUser: any;
  performForm: FormGroup = new FormGroup({});
  estateForm: FormGroup = new FormGroup({});
  searchGoodsForm: FormGroup = new FormGroup({});
  regionalsDelegations = new DefaultSelect<IRegionalDelegation>();
  states = new DefaultSelect<IDelegationState>();
  transferences = new DefaultSelect<ITransferente>();
  stations = new DefaultSelect<IStation>();
  authorities = new DefaultSelect<IAuthority>();
  typeRelevant = new DefaultSelect<ITypeRelevant>();
  warehouse = new DefaultSelect<IWarehouse>();
  akaWarehouse = new DefaultSelect<IAddress>();
  statesSearch = new DefaultSelect<IStateOfRepublic>();
  municipailitites = new DefaultSelect<IMunicipality>();
  localities = new DefaultSelect<ILocality>();
  warehouseUbication: string = '';
  tranportableItems: number = 0;
  headingTransportable: string = `Transportables(0)`;
  headingGuard: string = `Resguardo(0)`;
  headingWarehouse: string = `Almacén INDEP(0)`;
  idProgramming: number = 0;
  idAuthority: string = '';
  idState: number = 0;
  idStation: string | number;
  idTypeRelevant: number = 0;
  showForm: boolean = false;
  showUbication: boolean = false;
  showSelectTransferent: boolean = false;
  showSelectStation: boolean = false;
  showSelectAuthority: boolean = false;
  showWarehouseInfo: boolean = false;
  loadingGoods: boolean = false;
  formLoading: boolean = false;
  loadingReport: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  paramsState = new BehaviorSubject<ListParams>(new ListParams());
  paramsTransportableGoods = new BehaviorSubject<ListParams>(new ListParams());
  paramsShowTransportable = new BehaviorSubject<ListParams>(new ListParams());
  paramsShowGuard = new BehaviorSubject<ListParams>(new ListParams());
  paramsShowWarehouse = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsTransportableGoods: number = 0;
  totalItemsTransportableGuard: number = 0;
  totalItemsTransportableWarehouse: number = 0;
  paramsGuardGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsGuardGoods: number = 0;
  paramsWarehouseGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsWarehouseGoods: number = 0;
  paramsUsers = new BehaviorSubject<ListParams>(new ListParams());
  paramsUsersCheck = new BehaviorSubject<ListParams>(new ListParams());
  paramsGoodsProg = new BehaviorSubject<ListParams>(new ListParams());
  paramsNewWarehouse = new BehaviorSubject<ListParams>(new ListParams());
  paramsAuthority = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsUsers: number = 0;
  loadGoods: boolean = false;
  dataProg: boolean = false;
  newTransferent: boolean = true;
  delegationId: number = 0;
  delRegUserLog: string = '';
  delegation: string = '';
  employeTypeUserLog: string = '';
  task: any = null;
  showGoods: IGoodProgramming;
  observationNewWarehouse: number = 0;
  keepDatepickerOpened: true;
  idNewWarehouse: number = 0;
  dateValidate: any;
  infoTask: ITask;
  goodsProgCopy: IGoodProgramming[] = [];
  goodsProg: IGoodProgramming[] = [];
  settingsTransportableGoods = { ...this.settings, ...settingTransGoods };
  settingUser = { ...this.settings, ...SettingUserTable };
  settingGuardGoods = {
    ...this.settings,
    ...settingGuard,
  };

  settingWarehouseGoods = {
    ...this.settings,
    ...settingWarehouse,
  };

  transferentId: string | number;
  stationId: string | number;
  autorityId: string | number;

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
    private domicilieService: DomicileService,
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router,
    private municipalityService: MunicipalityService,
    private localityService: LocalityService,
    private storeAkaService: StoreAliasStockService,
    private goodProcessService: GoodProcessService,
    private statesService: StateOfRepublicService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: {
        ...ESTATE_COLUMNS,
        /*name: {
          title: 'Selección bienes',
          sort: false,
          position: 'left',
          type: 'custom',
          valuePrepareFunction: (user: any, row: any) =>
            this.isGoodSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.onGoodChange(instance),
        }, */
      },
    };

    this.idProgramming = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    this.getInfoUserLog();
    this.getRegionalDelegationSelect(new ListParams());
    this.getTypeRelevantSelect(new ListParams());
    this.getAkaWarehouse(new ListParams());
    this.getStates(new ListParams());
    this.getMunicipalities(new ListParams());
    this.getLocalities(new ListParams());
    this.getWarehouseSelect(new ListParams());
    this.getTransferentSelect(new ListParams());
    this.showUsersProgramming();
    this.getProgrammingData();
    this.performSearchForm();
    this.obtainInfoWarehouse();
    this.prepareForm();
    this.getInfoTask();
    this.task = JSON.parse(localStorage.getItem('Task'));
  }

  getInfoTask() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    this.task = JSON.parse(localStorage.getItem('Task'));
    params.getValue()['filter.id'] = this.task.id;
    this.taskService.getAll(params.getValue()).subscribe({
      next: response => {
        this.infoTask = response.data[0];
      },
      error: error => {},
    });
  }

  obtainInfoWarehouse() {
    this.paramsNewWarehouse.getValue()['filter.idProgramming'] =
      this.idProgramming;

    this.storeAkaService
      .getAllWarehouses(this.paramsNewWarehouse.getValue())
      .subscribe({
        next: response => {
          this.observationNewWarehouse = response.data[0].nbobservation;
          this.idNewWarehouse = response.data[0].nbidnewstore;
        },
        error: error => {},
      });
  }

  //Información de el usuario logeado//
  getInfoUserLog() {
    this.programmingService.getUserInfo().subscribe(data => {
      this.userInfo = data;
      this.delRegUserLog = this.userInfo.delegacionreg;
      this.employeTypeUserLog = this.userInfo.employeetype;
    });
  }

  //Información de la programación//
  getProgrammingData() {
    this.programmingService
      .getProgrammingId(this.idProgramming)
      .subscribe(data => {
        this.dataProgramming = data;
        this.setDataProgramming();
      });
  }

  performSearchForm() {
    this.searchGoodsForm = this.fb.group({
      warehouse: [null],
      state: [null],
      municipality: [null],
      colony: [null],
      postalCode: [null],
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
    } else {
      this.goodSelect = this.goodSelect.filter(
        _good => _good.idGood != _good.idGood
      );
    }
  }

  prepareForm() {
    this.formLoading = true;

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
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      observation: [
        null,
        [Validators.maxLength(400), Validators.pattern(STRING_PATTERN)],
      ],
      regionalDelegationNumber: [null, [Validators.required]],
      delregAttentionId: [null, [Validators.required]],
      stateKey: [null, [Validators.required]],
      tranferId: [null, [Validators.required]],
      stationId: [null, [Validators.required]],
      autorityId: [null, [Validators.required]],
      typeRelevantId: [null, [Validators.required]],
      storeId: [null],
      folio: [null],
    });
  }
  checkInfoDate2() {
    const startDateValue = this.performForm.get('startDate').value;
    console.log('Valor de startDate:', startDateValue);
    // Realiza cualquier operación adicional con el valor de startDateValue
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

  typeSchedule(type?: ITypeRelevant) {
    if (type?.id != null) {
      this.showForm = true;
      this.idTypeRelevant = type?.id;
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoods());
    }
  }

  showWarehouse(warehouse: IWarehouse) {
    this.warehouseUbication = warehouse?.ubication;
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
          alert;
          this.alert('success', 'Correcto', 'Usuario creado');
          // this.onLoadToast('success', 'Correcto', 'Usuario creado');
          this.showUsersProgramming();
        } else if (data) {
          this.alert('success', 'Correcto', 'Usuario modificado');
          this.showUsersProgramming();
        }
      },
    };

    const rejectionComment = this.modalService.show(UserFormComponent, config);
  }

  async newWarehouse() {
    if (this.regionalDelegationUser) {
      if (this.performForm.get('startDate').value) {
        this.performForm
          .get('startDate')
          .setValue(new Date(this.performForm.get('startDate').value));
      }
      if (this.performForm.get('endDate').value) {
        this.performForm
          .get('endDate')
          .setValue(new Date(this.performForm.get('endDate').value));
      }

      if (this.transferentId)
        this.performForm.get('tranferId').setValue(this.transferentId);
      if (this.stationId)
        this.performForm.get('stationId').setValue(this.stationId);
      if (this.autorityId) {
        this.performForm.get('autorityId').setValue(this.autorityId);
      }

      this.performForm
        .get('regionalDelegationNumber')
        .setValue(this.delegationId);

      this.performForm.get('delregAttentionId').setValue(this.delegationId);

      const folio: any = await this.generateFolio(this.performForm.value);
      this.performForm.get('folio').setValue(folio);
      const task = JSON.parse(localStorage.getItem('Task'));
      const updateTask = await this.updateTask(folio, task.id);
      if (updateTask) {
        this.programmingGoodService
          .updateProgramming(this.idProgramming, this.performForm.value)
          .subscribe({
            next: async () => {
              this.loading = false;
              const regDelData = this.regionalDelegationUser;
              let config = {
                ...MODAL_CONFIG,
                class: 'modal-lg modal-dialog-centered',
              };
              config.initialState = {
                programmingId: this.idProgramming,
                regDelData,
                callback: (next: boolean) => {},
              };

              this.modalService.show(WarehouseFormComponent, config);
            },
            error: error => {},
          });
      }
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
          if (userData.length > 0) {
            this.usersToProgramming.load(userData);
          } else {
            this.usersToProgramming.load([]);
          }
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

    this.modalService.show(EstateSearchFormComponent, config);
  }

  showGoodsProgramming() {
    const municipality = this.searchGoodsForm.get('municipality').value;
    const colony = this.searchGoodsForm.get('colony').value;
    const akaWarehouse = this.searchGoodsForm.get('warehouse').value;
    const postalCode = this.searchGoodsForm.get('postalCode').value;
    const state = this.searchGoodsForm.get('state').value;

    if (!municipality && !colony && !akaWarehouse && !postalCode && !state) {
      this.getProgGoods();
    }

    if (municipality && !colony && !akaWarehouse && !postalCode && !state) {
      const filterData = this.goodsProgCopy.filter(item => {
        return item.townshipKey == municipality;
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (municipality && colony && !akaWarehouse && !postalCode && !state) {
      const filterData = this.goodsProgCopy.filter(item => {
        return item.townshipKey == municipality && item.settlementKey == colony;
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (municipality && colony && akaWarehouse && !postalCode && !state) {
      const filterData = this.goodsProgCopy.filter(item => {
        return (
          item.townshipKey == municipality &&
          item.settlementKey == colony &&
          item.aliasStore == akaWarehouse
        );
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (municipality && colony && akaWarehouse && postalCode && !state) {
      const filterData = this.goodsProgCopy.filter(item => {
        return (
          item.townshipKey == municipality &&
          item.settlementKey == colony &&
          item.aliasStore == akaWarehouse &&
          item.code == postalCode
        );
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (colony && !municipality && !akaWarehouse && !postalCode && !state) {
      const filterData = this.goodsProgCopy.filter(item => {
        return item.settlementKey == colony;
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (akaWarehouse) {
      const filterData = this.goodsProgCopy.filter(item => {
        console.log('item', item);
        console.log('akaWarehouse', akaWarehouse);
        return item.aliasWarehouse == akaWarehouse;
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (akaWarehouse && colony && !municipality && !postalCode && !state) {
      const filterData = this.goodsProgCopy.filter(item => {
        return (
          item.aliasWarehouse == akaWarehouse && item.settlementKey == colony
        );
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (akaWarehouse && colony && municipality && !postalCode && !state) {
      const filterData = this.goodsProgCopy.filter(item => {
        return (
          item.aliasWarehouse == akaWarehouse &&
          item.settlementKey == colony &&
          item.townshipKey == municipality
        );
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (akaWarehouse && colony && municipality && postalCode && !state) {
      const filterData = this.goodsProgCopy.filter(item => {
        return (
          item.aliasWarehouse == akaWarehouse &&
          item.settlementKey == colony &&
          item.townshipKey == municipality &&
          item.code == postalCode
        );
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (postalCode && !akaWarehouse && !colony && !municipality && !state) {
      const filterData = this.goodsProgCopy.filter(item => {
        return item.code == postalCode;
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (postalCode && akaWarehouse && !colony && !municipality && !state) {
      const filterData = this.goodsProgCopy.filter(item => {
        return item.aliasWarehouse == akaWarehouse && item.code == postalCode;
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (postalCode && akaWarehouse && colony && !municipality && !state) {
      const filterData = this.goodsProgCopy.filter(item => {
        return (
          item.aliasWarehouse == akaWarehouse &&
          item.settlementKey == colony &&
          item.code == postalCode
        );
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (postalCode && akaWarehouse && colony && municipality && !state) {
      const filterData = this.goodsProgCopy.filter(item => {
        return (
          item.aliasWarehouse == akaWarehouse &&
          item.settlementKey == colony &&
          item.townshipKey == municipality &&
          item.code == postalCode
        );
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (state && !postalCode && !akaWarehouse && !colony && !municipality) {
      const filterData = this.goodsProgCopy.filter(item => {
        return item.stateKey == state;
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }
    if (state && postalCode && !akaWarehouse && !colony && !municipality) {
      const filterData = this.goodsProgCopy.filter(item => {
        return item.stateKey == state && item.code == postalCode;
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (state && postalCode && akaWarehouse && !colony && !municipality) {
      const filterData = this.goodsProgCopy.filter(item => {
        return (
          item.aliasWarehouse == akaWarehouse &&
          item.stateKey == state &&
          item.code == postalCode
        );
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (state && postalCode && akaWarehouse && colony && !municipality) {
      const filterData = this.goodsProgCopy.filter(item => {
        return (
          item.aliasWarehouse == akaWarehouse &&
          item.settlementKey == colony &&
          item.code == postalCode &&
          item.stateKey == state
        );
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }

    if (state && postalCode && akaWarehouse && colony && municipality) {
      const filterData = this.goodsProgCopy.filter(item => {
        return (
          item.aliasWarehouse == akaWarehouse &&
          item.settlementKey == colony &&
          item.townshipKey == municipality &&
          item.stateKey == state &&
          item.code == postalCode
        );
      });

      if (filterData.length > 0) {
        this.estatesList.load(filterData);
      } else {
        this.alert(
          'warning',
          'Acción inválida',
          'No hay bienes disponibles para programar'
        );
        this.estatesList.load(filterData);
      }
    }
  }
  showClean() {
    this.searchGoodsForm.get('municipality').setValue('');
    this.searchGoodsForm.get('colony').setValue('');
    this.searchGoodsForm.get('warehouse').setValue('');
    this.searchGoodsForm.get('postalCode').setValue('');
    this.searchGoodsForm.get('state').setValue('');
    this.estatesList.load(this.goodsProg);
  }

  searchProgGoods(filter: Object) {
    this.loadingGoods = true;
    this.goodsQueryService
      .postGoodsProgramming(this.params.getValue(), filter)
      .subscribe({
        next: response => {
          const goodsFilter = response.data.map(items => {
            if (items.physicalState) {
              if (items.physicalState == 1) {
                items.physicalState = 'BUENO';
                return items;
              } else if (items.physicalState == 2) {
                items.physicalState = 'MALO';
                return items;
              }
            } else {
              return items;
            }
          });

          this.filterGoodsProgramming(goodsFilter);
          this.loadingGoods = false;
        },
        error: error => (this.loadingGoods = false),
      });
  }

  getRegionalDelegationSelect(params?: ListParams) {
    //Delegation regional user login //
    this.programmingService.getUserInfo().subscribe((data: any) => {
      this.regionalDelegationService
        .getById(data.department)
        .subscribe((delegation: IRegionalDelegation) => {
          this.delegationId = delegation.id;
          this.delegation = delegation.description;
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
    this.delegationId = item.id;
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
    this.idState = Number(state.id);
    this.getWarehouseSelect(new ListParams());
    if (this.transferentId) this.getStations(new ListParams());
  }

  getTransferentSelect(params?: ListParams) {
    params['sortBy'] = 'nameTransferent:ASC';
    params['filter.status'] = `$eq:${1}`;
    this.transferentService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.nameAndId = `${data.id} - ${data.nameTransferent}`;
          return data;
        });
        this.transferences = new DefaultSelect(data.data, data.count);
      },
      error: error => {},
    });
  }

  transferentSelect(transferent: ITransferente) {
    this.transferentId = transferent?.id;
    this.performForm.get('stationId').setValue(null);
    this.performForm.get('autorityId').setValue(null);
    this.getStations(new ListParams());
  }

  getStations(params?: ListParams) {
    this.showSelectStation = true;
    params['filter.idTransferent'] = this.transferentId;
    params['filter.stationName'] = `$ilike:${params.text}`;
    params['sortBy'] = 'stationName:ASC';

    this.stationService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.nameAndId = `${data.id} - ${data.stationName}`;
          return data;
        });
        this.stations = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.stations = new DefaultSelect();
      },
    });
  }

  stationSelect(item: IStation) {
    this.performForm.get('autorityId').setValue(null);
    this.idStation = item.id;
    this.stationId = item.id;
    this.getAuthoritySelect(new ListParams());
  }

  getAuthoritySelect(params?: ListParams) {
    params['filter.authorityName'] = `$ilike:${params.text}`;
    params['filter.idTransferer'] = `$eq:${this.transferentId}`;
    params['sortBy'] = 'authorityName:ASC';
    delete params['search'];
    delete params.text;
    this.authorityService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.nameAndId = `${data.idAuthority} - ${data.authorityName}`;
          return data;
        });
        this.authorities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.authorities = new DefaultSelect();
      },
    });
  }

  getAkaWarehouse(params?: ListParams) {
    this.storeAkaService.getAll(params).subscribe({
      next: response => {
        this.akaWarehouse = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  getStates(params?: ListParams) {
    this.stateService.getAll(params).subscribe({
      next: response => {
        const statesData = response.data.map(data => {
          return data.stateCode;
        });
        this.statesSearch = new DefaultSelect(statesData, response.count);
      },

      error: error => {},
    });
  }

  getMunicipalities(params?: ListParams) {
    this.municipalityService.getAll(params).subscribe({
      next: response => {
        this.municipailitites = new DefaultSelect(
          response.data,
          response.count
        );
      },
      error: error => {},
    });
  }

  getLocalities(params?: ListParams) {
    this.localityService.getAll(params).subscribe({
      next: response => {
        this.localities = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  authoritySelect(item: IAuthority) {
    this.idAuthority = item.idAuthority;
    this.autorityId = item.idAuthority;
  }

  getTypeRelevantSelect(params: ListParams) {
    this.typeRelevantService.getAll(params).subscribe(data => {
      this.typeRelevant = new DefaultSelect(data.data, data.count);
      this.formLoading = false;
    });
  }

  getWarehouseSelect(params: ListParams) {
    this.showWarehouseInfo = true;
    params.limit = 6039;
    //params['filter.stateCode'] = this.idState;
    this.warehouseService.getAll(params).subscribe(data => {
      this.warehouse = new DefaultSelect(data.data, data.count);
    });
  }

  //Visualizar bienes transportables //

  getProgGoods() {
    this.loadingGoods = true;
    const filterColumns: Object = {
      regionalDelegation: Number(this.delegationId),
      transferent: Number(this.transferentId),
      // transferent: Number(760),
      relevantType: Number(this.idTypeRelevant),
      statusGood: 'APROBADO',
    };
    this.goodsQueryService
      .postGoodsProgramming(this.params.getValue(), filterColumns)
      .subscribe({
        next: response => {
          console.log('response', response);
          let goodsFilter = response.data.map(items => {
            if (items.physicalState) {
              if (items.physicalState == 1) {
                items.physicalState = 'BUENO';
                return items;
              } else if (items.physicalState == 2) {
                items.physicalState = 'MALO';
                return items;
              }
            } else {
              return items;
            }
          });
          // const goodsFilter = goodsFilter.filter(item => item);
          goodsFilter = goodsFilter.filter(item => item);
          // console.log('goodsFilter1222', JSON.stringify(goodsFilter2));
          this.goodsProgCopy = goodsFilter;
          this.goodsProg = goodsFilter;

          this.estatesList.load(goodsFilter);
          this.totalItems = response.count;
          this.loadingGoods = false;
          //this.filterGoodsProgramming(goodsFilter);
          //
        },
        error: error => (this.loadingGoods = false),
      });
  }

  filterGoodsProgramming(goods: any[]) {
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
          this.alert(
            'info',
            'Advertencía',
            'No hay bienes disponibles para programar'
          );
          this.estatesList.load([]);
          this.totalItems = filter.length;
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
      ).then(async question => {
        if (question.isConfirmed) {
          const createProgGood = await this.insertGoodsProgTrans();

          if (createProgGood) {
            const updateGood: any = await this.changeStatusGoodTrans();

            if (updateGood) {
              const showGoods: any = await this.getFilterGood(
                'EN_TRANSPORTABLE'
              );

              if (showGoods) {
                const _showGoods = await this.showGoodsTransportable(showGoods);

                if (_showGoods) {
                  this.getProgGoods();
                  this.goodSelect = [];
                }
              }
            }
          }
        }
      });
    } else {
      this.alert('warning', 'Error', 'Se necesita tener un bien seleccionado');
    }
  }

  /*------Inserta bienes con status transportable -----*/
  insertGoodsProgTrans() {
    return new Promise((resolve, reject) => {
      this.goodSelect.map((item: any) => {
        const formData: Object = {
          programmingId: this.idProgramming,
          creationUser: this.userInfo.name,
          modificationUser: this.userInfo.name,
          goodId: item.googId,
          version: '1',
          status: 'EN_TRANSPORTABLE',
        };

        this.programmingGoodService.createGoodProgramming(formData).subscribe({
          next: () => {
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
      });
    });
  }

  /*------------Cambiar status del bien a transportable ------------------*/
  changeStatusGoodTrans() {
    return new Promise(async (resolve, reject) => {
      this.goodSelect.map(item => {
        const formData: Object = {
          id: Number(item.goodNumber),
          goodId: item.googId,
          goodStatus: 'EN_TRANSPORTABLE',
          programmationStatus: 'EN_TRANSPORTABLE',
        };
        this.goodService.updateByBody(formData).subscribe({
          next: () => {
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
      });
    });
  }
  /*------ MOSTRAMOS LOS BIENES DISPONIBLES A PROGRAMAR -------*/
  showGoodsTransportable(showGoods: IGoodProgramming[]) {
    const showTransportable: any = [];
    return new Promise((resolve, reject) => {
      showGoods.map((item: IGoodProgramming) => {
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
                showTransportable.push(item);
                this.goodsTranportables.load(showTransportable);
                this.totalItemsTransportableGoods =
                  this.goodsTranportables.count();
                this.headingTransportable = `Transportable(${this.goodsTranportables.count()})`;
                resolve(true);
              });
            },
          });
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
      ).then(async question => {
        if (question.isConfirmed) {
          const params = new ListParams();
          if (this.idTypeRelevant == 1) {
            const tieneMenaje = '';
            const menajes = 0;
            this.goodSelect.map(item => {
              params['filter.id'] = item.googId;

              this.goodService.getAll(params).subscribe(data => {});
            });
          } else {
            const data = this.goodSelect.map(item => {
              const data = {
                idTransferent: item.transfereeId,
                idDelegation: item.delegationRegionalId,
                typeTransferent: item.typeTransfer,
              };
              return data;
            });

            let config = {
              ...MODAL_CONFIG,
              class: 'modal-lg modal-dialog-centered',
            };
            config.initialState = {
              data,
              typeTransportable: 'guard',
              callback: async (data: any) => {
                if (data) {
                  const createProgGood = await this.addGoodsGuards();

                  if (createProgGood) {
                    const updateGood: any = await this.changeStatusGoodGuard();

                    if (updateGood) {
                      const showGoods: any = await this.getFilterGood(
                        'EN_RESGUARDO_TMP'
                      );

                      if (showGoods) {
                        const _showGoods = await this.showGoodsGuard(showGoods);

                        if (_showGoods) {
                          this.getProgGoods();
                          this.goodSelect = [];
                        }
                      }
                    }
                  }
                }
              },
            };

            this.modalService.show(WarehouseSelectFormComponent, config);
          }
        }
      });
    } else {
      this.alert('warning', 'Error', 'Se necesita tener un bien seleccionado');
    }
  }

  async addGoodsGuards() {
    return new Promise((resolve, reject) => {
      this.goodSelect.map((item: any) => {
        const formData: Object = {
          programmingId: this.idProgramming,
          creationUser: this.userInfo.name,
          modificationUser: this.userInfo.name,
          goodId: item.googId,
          version: '1',
          status: 'EN_RESGUARDO_TMP',
        };

        this.programmingGoodService.createGoodProgramming(formData).subscribe({
          next: () => {
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
      });
    });
  }

  /*------------Cambio de status a resguardo ------------------*/
  changeStatusGoodGuard() {
    return new Promise(async (resolve, reject) => {
      this.goodSelect.map(item => {
        const formData: Object = {
          id: Number(item.goodNumber),
          goodId: item.googId,
          goodStatus: 'EN_RESGUARDO_TMP',
          programmationStatus: 'EN_RESGUARDO_TMP',
        };
        this.goodService.updateByBody(formData).subscribe({
          next: () => {
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
      });
    });
  }

  showGoodsGuard(showGoods: IGoodProgramming[]) {
    const showGuards: any = [];
    return new Promise((resolve, reject) => {
      showGoods.map((item: IGoodProgramming) => {
        this.paramsShowGuard.getValue()['filter.id'] = item.goodId;
        this.goodService.getAll(this.paramsShowGuard.getValue()).subscribe({
          next: async data => {
            data.data.map(async item => {
              const aliasWarehouse: any = await this.getAliasWarehouse(
                item.addressId
              );
              item['aliasWarehouse'] = aliasWarehouse;

              if (item.statePhysicalSae == 1)
                item['statePhysicalSae'] = 'BUENO';
              if (item.statePhysicalSae == 2) item['statePhysicalSae'] = 'MALO';
              showGuards.push(item);

              this.goodsGuards.load(showGuards);
              this.totalItemsTransportableGuard = this.goodsGuards.count();
              this.headingGuard = `Resguardo(${this.goodsGuards.count()})`;
              resolve(true);
            });
          },
        });
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
          const idTransferent = this.transferentId;
          config.initialState = {
            idTransferent,
            typeTransportable: 'warehouse',
            callback: async (data: any) => {
              if (data) {
                const createProgGood = await this.addGoodsWarehouse();

                if (createProgGood) {
                  const updateGood: any = await this.changeStatusGoodWarehouse(
                    data
                  );

                  if (updateGood) {
                    const showGoods: any = await this.getFilterGood(
                      'EN_ALMACEN_TMP'
                    );

                    if (showGoods) {
                      const _showGoods = await this.showGoodsWarehouse(
                        showGoods
                      );

                      if (_showGoods) {
                        this.getProgGoods();
                        this.goodSelect = [];
                      }
                    }
                  }
                }
              }
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
    return new Promise((resolve, reject) => {
      this.goodSelect.map((item: any) => {
        const formData: Object = {
          programmingId: this.idProgramming,
          creationUser: this.userInfo.name,
          modificationUser: this.userInfo.name,
          goodId: item.googId,
          version: '1',
          status: 'EN_ALMACEN_TMP',
        };

        this.programmingGoodService.createGoodProgramming(formData).subscribe({
          next: () => {
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
      });
    });
  }

  //Cambio de status en la programación//

  async changeStatusGoodWarehouse(warehouse: number) {
    return new Promise(async (resolve, reject) => {
      this.goodSelect.map(item => {
        const formData: Object = {
          id: Number(item.goodNumber),
          goodId: item.googId,
          goodStatus: 'EN_ALMACEN_TMP',
          programmationStatus: 'EN_ALMACEN_TMP',
          storeId: warehouse,
        };
        this.goodService.updateByBody(formData).subscribe({
          next: () => {
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
      });
    });
  }

  //filtrar información por almacén //

  async showGoodsWarehouse(showGoods: IGoodProgramming[]) {
    const showWarehouse: any = [];
    return new Promise((resolve, reject) => {
      showGoods.map((item: IGoodProgramming) => {
        this.paramsShowWarehouse.getValue()['filter.id'] = item.goodId;
        this.goodService.getAll(this.paramsShowWarehouse.getValue()).subscribe({
          next: async data => {
            data.data.map(async item => {
              const aliasWarehouse: any = await this.getAliasWarehouse(
                item.addressId
              );
              item['aliasWarehouse'] = aliasWarehouse;

              if (item.statePhysicalSae == 1)
                item['statePhysicalSae'] = 'BUENO';
              if (item.statePhysicalSae == 2) item['statePhysicalSae'] = 'MALO';
              showWarehouse.push(item);
              this.goodsWarehouse.load(showWarehouse);
              this.totalItemsTransportableWarehouse =
                this.goodsWarehouse.count();
              this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.count()})`;
              resolve(true);
            });
          },
        });
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
    this.modalService.show(DomicileFormComponent, config);
  }
  // Visualizar información de alias almacen //
  // showDomicile(item: any) {
  //   let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
  //   config.initialState = {
  //     item,
  //     callback: () => {},
  //   };
  //   this.modalService.show(DomicileFormComponent, config);
  // }

  removeGoodTrans(item: IGood) {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea eliminar el bien de transportable?'
    ).then(async question => {
      if (question.isConfirmed) {
        this.goodsTranportables.remove(item);
        const backInfoGood = await this.removeStatusGood(item);
        if (backInfoGood) {
          const formData: Object = {
            programmingId: this.idProgramming,
            goodId: item.id,
          };
          this.programmingGoodService
            .deleteGoodProgramming(formData)
            .subscribe(() => {
              this.alert(
                'success',
                'Correcto',
                'Bien eliminado de transportable correctamente'
              );
              const deleteGood = this.goodsTranportables.count();
              this.headingTransportable = `Transportable(${deleteGood})`;
              this.getProgGoods();
            });
        }
      }
    });
  }

  removeStatusGood(good: IGood) {
    return new Promise((resolve, reject) => {
      const _good: Object = {
        id: good.id,
        goodId: good.goodId,
        goodStatus: 'APROBADO',
        programmationStatus: null,
      };
      this.goodService.updateByBody(_good).subscribe({
        next: res => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  removeGoodGuard(item: IGood) {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea eliminar el bien de resguardo?'
    ).then(async question => {
      if (question.isConfirmed) {
        this.goodsGuards.remove(item);
        const backInfoGood = await this.removeStatusGood(item);
        if (backInfoGood) {
          const formData: Object = {
            programmingId: this.idProgramming,
            goodId: item.id,
          };
          this.programmingGoodService
            .deleteGoodProgramming(formData)
            .subscribe(() => {
              this.alert(
                'success',
                'Correcto',
                'Bien eliminado de resguardo correctamente'
              );
              const deleteGood = this.goodsGuards.count();
              this.headingGuard = `Resguardo(${deleteGood})`;

              this.getProgGoods();
            });
        }
      }
    });
  }

  removeGoodWarehouse(item: IGood) {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea eliminar el bien de almacén?'
    ).then(async question => {
      if (question.isConfirmed) {
        this.goodsWarehouse.remove(item);
        const backInfoGood = await this.removeStatusGood(item);
        if (backInfoGood) {
          const formData: Object = {
            programmingId: this.idProgramming,
            goodId: item.id,
          };
          this.programmingGoodService
            .deleteGoodProgramming(formData)
            .subscribe(() => {
              this.alert(
                'success',
                'Correcto',
                'Bien eliminado de alamcén correctamente'
              );
              const deleteGood = this.goodsWarehouse.count();
              this.headingWarehouse = `Almacén INDEP(${deleteGood})`;

              this.getProgGoods();
            });
        }
      }
    });
  }

  //Actualizar programación con información de la programación
  confirm() {
    if (this.performForm.get('startDate').value) {
      this.performForm
        .get('startDate')
        .setValue(new Date(this.performForm.get('startDate').value));
    }
    if (this.performForm.get('endDate').value) {
      this.performForm
        .get('endDate')
        .setValue(new Date(this.performForm.get('endDate').value));
    }

    if (this.transferentId)
      this.performForm.get('tranferId').setValue(this.transferentId);
    if (this.stationId)
      this.performForm.get('stationId').setValue(this.stationId);
    if (this.autorityId) {
      this.performForm.get('autorityId').setValue(this.autorityId);
    }

    this.performForm
      .get('regionalDelegationNumber')
      .setValue(this.delegationId);

    this.performForm.get('delregAttentionId').setValue(this.delegationId);
    this.alertQuestion(
      'info',
      'Confirmación',
      '¿Desea guardar la información de la programación?'
    ).then(async question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.formLoading = true;
        const folio: any = await this.generateFolio(this.performForm.value);
        this.performForm.get('folio').setValue(folio);
        const task = JSON.parse(localStorage.getItem('Task'));
        const updateTask = await this.updateTask(folio, task.id);
        if (updateTask) {
          this.programmingGoodService
            .updateProgramming(this.idProgramming, this.performForm.value)
            .subscribe({
              next: async () => {
                this.loading = false;
                this.alert(
                  'success',
                  'Acción correcta',
                  'Programacíón guardada correctamente'
                );
                this.performForm
                  .get('regionalDelegationNumber')
                  .setValue(this.delegation);
                this.getProgrammingData();
                this.formLoading = false;
                this.newTransferent = false;
              },
              error: error => {},
            });
        }
      }
    });
  }

  updateTask(folio: string, taskId: number) {
    return new Promise((resolve, reject) => {
      const body: ITask = {
        title: 'Realizar Programación con folio: ' + folio,
      };

      this.taskService.update(taskId, body).subscribe({
        next: () => {
          resolve(true);
        },
        error: error => {},
      });
    });
  }

  //Enviar datos para terminar la tarea//
  sendProgramation() {
    let message: string = '';
    let error: number = 0;

    const startDate = this.performForm.get('startDate').value;
    const endDate = this.performForm.get('endDate').value;
    const storeId = this.performForm.get('storeId').value;
    const emailTransfer = this.performForm.get('emailTransfer').value;
    const city = this.performForm.get('city').value;
    const address = this.performForm.get('address').value;
    const regionalDelegationNumber = this.performForm.get(
      'regionalDelegationNumber'
    );
    const stateKey = this.performForm.get('stateKey').value;
    const tranferId = this.performForm.get('tranferId').value;
    const stationId = this.performForm.get('stationId').value;
    const autorityId = this.performForm.get('autorityId').value;

    if (
      this.goodsTranportables.count() == 0 &&
      this.goodsGuards.count() == 0 &&
      this.goodsWarehouse.count() == 0
    ) {
      message = 'Se necesita Bienes para continuar la tarea';
      error = error + 1;
    }

    if (error == 0 && this.usersToProgramming.count() == 0) {
      message = 'Se necesita Usuarios para continuar la tarea';
      error = error + 1;
    }

    if (error == 0 && startDate == null) {
      message = 'Es necesario tener Fecha Inicio del operativo';
      error = error + 1;
    }

    if (error == 0 && endDate == null) {
      message = 'Es necesario tener Fecha Fin del operativo';
      error = error + 1;
    }

    if (error == 0 && storeId == null) {
      message = 'Es necesario tener almacén destino';
      error = error + 1;
    }

    if (error == 0 && emailTransfer == null) {
      message = 'Se necesita ingresar Correo Electrónico de la Transferente';
      error = error + 1;
    }

    if (error == 0 && city == null) {
      message = 'Se necesita ingresar ciudad a la programación';
      error = error + 1;
    }

    if (error == 0 && address == null) {
      message = 'Se necesita ingresar dirección a la programación';
      error = error + 1;
    }

    if (error == 0 && stateKey == null) {
      message = 'Se necesita ingresar un estado';
      error = error + 1;
    }

    if (error == 0 && regionalDelegationNumber == null) {
      message = 'Se necesita ingresar una delegación regional';
      error = error + 1;
    }

    if (error == 0 && tranferId == null) {
      message = 'Se necesita ingresar una transferente';
      error = error + 1;
    }

    if (error == 0 && stationId == null) {
      message = 'Se necesita ingresar una emisora';
      error = error + 1;
    }

    if (error == 0 && autorityId == null) {
      message = 'Se necesita ingresar una autoridad';
      error = error + 1;
    }

    if (error > 0) {
      this.alert('info', 'Error', `${message}`);
    } else if (error == 0) {
      this.performForm
        .get('startDate')
        .setValue(new Date(this.performForm.get('startDate').value));
      this.performForm
        .get('endDate')
        .setValue(new Date(this.performForm.get('endDate').value));

      this.performForm.get('tranferId').setValue(this.transferentId);
      this.performForm.get('stationId').setValue(this.stationId);
      this.performForm.get('autorityId').setValue(this.autorityId);
      this.performForm
        .get('regionalDelegationNumber')
        .setValue(this.delegationId);
      this.performForm.get('delregAttentionId').setValue(this.delegationId);
      this.alertQuestion(
        'info',
        'Confirmación',
        `¿Esta seguro de enviar la programación ${this.dataProgramming.id}?`
      ).then(async question => {
        if (question.isConfirmed) {
          this.loading = true;
          const folio: any = await this.generateFolio(this.performForm.value);
          this.performForm.get('folio').setValue(folio);
          const task = JSON.parse(localStorage.getItem('Task'));
          const updateTask = await this.updateTask(folio, task.id);
          if (updateTask) {
            this.programmingGoodService
              .updateProgramming(this.idProgramming, this.performForm.value)
              .subscribe({
                next: async () => {
                  this.performForm
                    .get('regionalDelegationNumber')
                    .setValue(this.delegation);
                  this.generateTaskAceptProgramming(folio);
                  this.loading = false;
                },
                error: error => {},
              });
          }
        }
      });

      /*this.alertQuestion(
        'question',
        'Enviar Programación',
        `¿Esta seguro de enviar la programación ${this.dataProgramming.id}?`
      ).then(async question => {
        if (question.isConfirmed) {
          this.loading = true;
          this.performForm
            .get('regionalDelegationNumber')
            .setValue(this.delegationId);
          const folio: any = await this.generateFolio(this.performForm.value);
          this.performForm.get('folio').setValue(folio);
          //const updateTask = await this.updateTask(folio);
          this.programmingGoodService
            .updateProgramming(this.idProgramming, this.performForm.value)
            .subscribe({
              next: async () => {
                this.generateTaskAceptProgramming(folio);
                this.loading = false;
              },
            });
        }
      }); */
    }
  }

  generateFolio(programming: Iprogramming) {
    return new Promise((resolve, reject) => {
      this.transferentService.getById(programming.tranferId).subscribe({
        next: response => {
          if (this.employeTypeUserLog == 'SAE') {
            const folio =
              `R-${this.delegation}` +
              '-' +
              `${response.keyTransferent}` +
              '-' +
              `${this.idProgramming}`;
            resolve(folio);
          } else if (this.employeTypeUserLog == 'TE') {
            const folio =
              `R-${this.delegation}` +
              '-' +
              `${response.keyTransferent}` +
              '-' +
              `${this.idProgramming}-OS`;

            resolve(folio);
          }
        },
        error: error => {},
      });
    });
  }

  async generateTaskAceptProgramming(folio: string) {
    const user: any = this.authService.decodeToken();
    let body: any = {};
    const _task = JSON.parse(localStorage.getItem('Task'));
    body['idTask'] = _task.id;
    body['userProcess'] = user.username;
    body['type'] = 'SOLICITUD_PROGRAMACION';
    body['subtype'] = 'Realizar_Programacion';
    body['ssubtype'] = 'ENVIAR';

    let task: any = {};
    task['id'] = 0;
    task['assignees'] = _task.assignees;
    task['assigneesDisplayname'] = _task.assigneesDisplayname;
    task['creator'] = user.username;
    task['taskNumber'] = Number(this.idProgramming);
    task['title'] = 'Aceptar Programación con folio: ' + folio;
    task['programmingId'] = this.idProgramming;
    task['expedientId'] = 0;
    task['idDelegationRegional'] = this.delegationId;
    task['urlNb'] = 'pages/request/programming-request/acept-programming';
    task['processName'] = 'SolicitudProgramacion';
    task['taskDefinitionId'] = _task.id;
    body['task'] = task;

    const taskResult = await this.createTaskOrderService(body);

    this.loading = false;
    if (taskResult) {
      this.msgGuardado(
        'success',
        'Creación de tarea exitosa',
        `Se creó la tarea Aceptar Programación con el folio: ${folio}`
      );
    }
  }

  createTaskOrderService(body: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
          reject(false);
        },
      });
    });
  }

  deleteUser(user: any) {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea eliminar el usuario de la programación?'
    ).then(question => {
      if (question.isConfirmed) {
        let userObject: Object = {
          programmingId: Number(user.programmingId),
          email: user.email,
        };

        this.programmingService
          .deleteUserProgramming(userObject)
          .subscribe(data => {
            // this.onLoadToast('success', 'Correcto', 'Usuario eliminado');
            this.alert('success', 'Operación exitosa', 'Usuario eliminado');
            this.reloadData();
          });
      }
    });
  }

  reloadData() {
    this.paramsUsersCheck.getValue()['filter.programmingId'] =
      this.idProgramming;
    this.programmingService
      .getUsersProgramming(this.paramsUsersCheck.getValue())
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
        },
        error: error => {
          this.usersToProgramming.load([]);
        },
      });
  }

  reportGoodsProgramming() {
    this.loadingReport = true;
    const dataObject: Object = {
      regionalDelegation: this.delegationId,
      userId: this.employeTypeUserLog,
    };
    this.programmingGoodService
      .showReportGoodProgramming(dataObject)
      .subscribe({
        next: (response: any) => {
          this.downloadExcel(response.base64File);
          this.loadingReport = false;
        },
        error: error => {
          this.loadingReport = false;
          this.onLoadToast(
            'info',
            'Error',
            'Error al visualizar los bienes disponibles a programar'
          );
        },
      });
  }

  downloadExcel(excel: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excel}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.click();
    this.onLoadToast('success', '', 'Archivo generado');
  }

  close() {
    this.modalService.hide();
  }

  setDataProgramming() {
    if (this.dataProgramming.folio) {
      this.showForm = true;
      this.performForm.get('address').setValue(this.dataProgramming.address);
      this.performForm.get('city').setValue(this.dataProgramming.city);
      this.performForm.get('stateKey').setValue(this.dataProgramming.stateKey);
      this.performForm.get('storeId').setValue(this.dataProgramming.storeId);
      this.performForm
        .get('emailTransfer')
        .setValue(this.dataProgramming.emailTransfer);
      this.performForm
        .get('observation')
        .setValue(this.dataProgramming.observation);
      this.performForm
        .get('stationId')
        .setValue(Number(this.dataProgramming.stationId));
      this.performForm
        .get('typeRelevantId')
        .setValue(this.dataProgramming.typeRelevantId);
      this.performForm
        .get('startDate')
        .setValue(
          moment(this.dataProgramming.startDate).format('DD/MMMM/YYYY')
        );
      this.performForm
        .get('endDate')
        .setValue(moment(this.dataProgramming.endDate).format('DD/MMMM/YYYY'));

      this.transferentId = this.dataProgramming.tranferId;

      this.stationId = this.dataProgramming.stationId;
      this.autorityId = this.dataProgramming.autorityId;

      this.delegationId = this.dataProgramming.regionalDelegationNumber;
      this.dataProg = true;
      this.paramsTransportableGoods.getValue()['filter.programmingId'] =
        this.idProgramming;

      this.programmingService
        .getGoodsProgramming(this.paramsTransportableGoods.getValue())
        .subscribe({
          next: async data => {
            this.showTransportable(data.data);
            this.showGuard(data.data);
            this.showWarehouseGoods(data.data);
          },
          error: error => {},
        });

      if (this.dataProgramming.storeId) {
        this.warehouseService.getById(this.dataProgramming.storeId).subscribe({
          next: response => {
            this.warehouseUbication = response.description;
          },
          error: error => {},
        });
      }

      if (this.dataProgramming.tranferId) {
        this.newTransferent = false;
        this.transferentService
          .getById(this.dataProgramming.tranferId)
          .subscribe({
            next: response => {
              const nameAndId = `${response.id} - ${response.nameTransferent}`;
              this.performForm.get('tranferId').setValue(nameAndId);
            },
            error: error => {},
          });
      }

      this.params.getValue()['filter.id'] = this.dataProgramming.stationId;
      this.params.getValue()['filter.idTransferent'] =
        this.dataProgramming.tranferId;
      this.stationService.getAll(this.params.getValue()).subscribe({
        next: response => {
          const nameAndId = `${response.data[0].id} - ${response.data[0].stationName}`;
          this.performForm.get('stationId').setValue(nameAndId);
        },
        error: error => {},
      });

      this.paramsAuthority.getValue()['filter.idTransferer'] =
        this.transferentId;
      this.authorityService.getAll(this.paramsAuthority.getValue()).subscribe({
        next: response => {
          const nameAndId = `${response.data[0].idAuthority} - ${response.data[0].authorityName}`;
          this.performForm.get('autorityId').setValue(nameAndId);
          this.idStation = this.dataProgramming.stationId;
          this.transferentId = this.dataProgramming.tranferId;
          this.getAuthoritySelect(new ListParams());
        },
        error: error => {},
      });
    }
  }

  showTransportable(goodsProg: IGoodProgramming[]) {
    const filterTrans = goodsProg.filter(item => {
      return item.status == 'EN_TRANSPORTABLE';
    });
    const showTransportable: any = [];
    filterTrans.map((item: IGoodProgramming) => {
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

              if (item.physicalStatus == 1) item['physicalStatus'] = 'BUENO';
              if (item.physicalStatus == 2) item['physicalStatus'] = 'MALO';
              showTransportable.push(item);

              this.goodsTranportables.load(showTransportable);
              this.totalItemsTransportableGoods =
                this.goodsTranportables.count();
              this.headingTransportable = `Transportable(${this.goodsTranportables.count()})`;
            });
          },
        });
    });
  }

  showGuard(goodsProg: IGoodProgramming[]) {
    const filterTrans = goodsProg.filter(item => {
      return item.status == 'EN_RESGUARDO_TMP';
    });
    const showGuard: any = [];
    filterTrans.map((item: IGoodProgramming) => {
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
              if (item.statePhysicalSae == 2) item['statePhysicalSae'] = 'MALO';
              showGuard.push(item);
              this.goodsGuards.load(showGuard);
              this.totalItemsTransportableGuard = this.goodsGuards.count();
              this.headingGuard = `Resguardo(${this.goodsGuards.count()})`;
            });
          },
        });
    });
  }

  goodsSelect(data: any) {
    this.goodSelect = data;
  }

  showWarehouseGoods(goodsProg: IGoodProgramming[]) {
    const filterTrans = goodsProg.filter(item => {
      return item.status == 'EN_ALMACEN_TMP';
    });
    const showWarehouse: any = [];
    filterTrans.map((item: IGoodProgramming) => {
      this.paramsShowWarehouse.getValue()['filter.id'] = item.goodId;
      this.goodService.getAll(this.paramsShowWarehouse.getValue()).subscribe({
        next: async data => {
          data.data.map(async item => {
            const aliasWarehouse: any = await this.getAliasWarehouse(
              item.addressId
            );
            item['aliasWarehouse'] = aliasWarehouse;

            if (item.statePhysicalSae == 1) item['statePhysicalSae'] = 'BUENO';
            if (item.statePhysicalSae == 2) item['statePhysicalSae'] = 'MALO';
            showWarehouse.push(item);
            this.goodsWarehouse.load(showWarehouse);
            this.totalItemsTransportableWarehouse = this.goodsWarehouse.count();
            this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.count()})`;
          });
        },
      });
    });
  }

  msgGuardado(icon: any, title: string, message: string) {
    Swal.fire({
      title: title,
      html: message,
      icon: icon,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
      }
    });
  }

  checkInfoDate(event: any) {
    const startDate = event;
    const _startDateFormat = moment(startDate).format('DD/MMMM/YYYY');

    const _endDateFormat = moment(this.performForm.get('endDate').value).format(
      'DD/MMMM/YYYY'
    );
    const date = moment(new Date()).format('YYYY-MM-DD');
    this.programmingService.getDateProgramming(date, 5).subscribe({
      next: (response: any) => {
        const correctDate = moment(response).format('DD/MMMM/YYYY');
        if (correctDate > _startDateFormat || correctDate > _endDateFormat) {
          this.performForm
            .get('startDate')
            .addValidators([minDate(new Date(response))]);
          this.performForm
            .get('startDate')
            .setErrors({ minDate: { min: new Date(response) } });
          this.performForm
            .get('endDate')
            .addValidators([minDate(new Date(response))]);
          this.performForm
            .get('endDate')
            .setErrors({ minDate: { min: new Date(response) } });
          this.performForm.markAllAsTouched();
          this.performForm.reset();
          /*const endDate = this.performForm.get('endDate').value;
          const _endDateFormat = moment(endDate).format(
            'DD/MMMM/YYYY, h:mm:ss a'
          );
          if (correctDate > _endDateFormat) {
            this.performForm.get('endDate').clearValidators();
            this.performForm
              .get('endDate')
              .addValidators([
                Validators.required,
                minDate(new Date(response)),
              ]);
            this.performForm.get('endDate').updateValueAndValidity();
            this.performForm
              .get('endDate')
              .setErrors({ minDate: { min: response } });
            this.performForm.markAllAsTouched();
          } */
        }
      },
    });
  }
}
