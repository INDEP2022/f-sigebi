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
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodsInvService } from 'src/app/core/services/ms-good/goodsinv.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { StoreAliasStockService } from 'src/app/core/services/ms-store/store-alias-stock.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  ADDRESS_PATTERN,
  EMAIL_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';
import { ProgrammingGoodService } from '../../../../../core/services/ms-programming-request/programming-good.service';
import { WarehouseFormComponent } from '../../../shared-request/warehouse-form/warehouse-form.component';
import { ESTATE_COLUMNS } from '../../acept-programming/columns/estate-columns';
import { SearchUserFormComponent } from '../../schedule-reception/search-user-form/search-user-form.component';
import { userData } from '../../schedule-reception/search-user-form/users-data';
import { DetailGoodProgrammingFormComponent } from '../../shared-components-programming/detail-good-programming-form/detail-good-programming-form.component';
import { DomicileFormComponent } from '../../shared-components-programming/domicile-form/domicile-form.component';
import { EstateSearchFormComponent } from '../estate-search-form/estate-search-form.component';
import { IEstateSearch } from '../estate-search-form/estate-search.interface';
import { UserFormComponent } from '../user-form/user-form.component';
import { WarehouseSelectFormComponent } from '../warehouse-select-form/warehouse-select-form.component';
import {
  settingGuard,
  settingGuardClose,
  settingTransGoods,
  settingTransGoodsClose,
  SettingUserTable,
  SettingUserTableClose,
  settingWarehouse,
  settingWarehouseClose,
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
  infoSelectForm: FormGroup = new FormGroup({});
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
  warehouseId: number = 0;
  tranportableItems: number = 0;
  headingTransportable: string = `Transportables (0)`;
  headingGuard: string = `Resguardo (0)`;
  headingWarehouse: string = `Almacén INDEP (0)`;
  idProgramming: number = 0;
  idAuthority: string = '';
  idState: number = 0;
  idStation: string | number;
  checked: string = 'checked';
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
  loadingTrans: boolean = false;
  loadingGuard: boolean = false;
  selectMasiveGood: boolean = false;
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
  loadingWarehouse: boolean = true;
  formLoadingWarehouse: boolean = false;
  formLoadingTransportable: boolean = false;
  formLoadingGuard: boolean = false;
  showTypeValor: boolean = false;
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
  stateKey: string = '';
  minDateFecElab = new Date();
  otValors = new DefaultSelect();
  idMunicipality: string = '';
  authorityName: string = '';
  settingsTransportableGoods = { ...this.settings, ...settingTransGoods };
  settingsTransportableGoodsClose = {
    ...this.settings,
    ...settingTransGoodsClose,
  };
  settingUser = { ...this.settings, ...SettingUserTable };
  settingUserClose = { ...this.settings, ...SettingUserTableClose };
  settingGuardGoods = {
    ...this.settings,
    ...settingGuard,
  };

  settingGuardGoodsClose = {
    ...this.settings,
    ...settingGuardClose,
  };

  settingWarehouseGoods = {
    ...this.settings,
    ...settingWarehouse,
  };

  settingWarehouseGoodsClose = {
    ...this.settings,
    ...settingWarehouseClose,
  };

  transferentId: number = 0;
  transferentName: string = '';
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
    private statesService: StateOfRepublicService,
    private massiveGoodService: MassiveGoodService,
    private dynamicCatalogService: DynamicCatalogService,
    private goodsinvService: GoodsInvService
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

    this.idProgramming = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
  }

  ngOnInit(): void {
    this.getInfoUserLog();
    this.getRegionalDelegationSelect(new ListParams());
    this.getTypeRelevantSelect(new ListParams());
    this.getAkaWarehouse(new ListParams());

    this.getTransferentSelect(new ListParams());
    this.getValueSelect(new ListParams());
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
      goodId: [null],
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
          Validators.pattern(ADDRESS_PATTERN),
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
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      observation: [
        null,
        [Validators.maxLength(400), Validators.pattern(STRING_PATTERN)],
      ],
      regionalDelegationNumber: [null, [Validators.required]],
      delregAttentionId: [null],
      stateKey: [null, [Validators.required]],
      tranferId: [null, [Validators.required]],
      stationId: [null, [Validators.required]],
      autorityId: [null, [Validators.required]],
      typeRelevantId: [null, [Validators.required]],
      storeId: [null],
      folio: [null],
      concurrentMsg: [null],
      aptoCilcular: [null],
    });
  }
  checkInfoDate2() {
    const startDateValue = this.performForm.get('startDate').value;
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

  showWarehouse(warehouse: any) {
    this.warehouseUbication = warehouse?.address1;
    this.warehouseId = warehouse?.organizationCode;
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

      if (this.warehouseId != 0) {
        this.performForm.get('storeId').setValue(this.warehouseId);
      }
      this.performForm
        .get('regionalDelegationNumber')
        .setValue(this.delegationId);

      this.performForm.get('delregAttentionId').setValue(this.delegationId);
      if (
        this.transferentId &&
        this.typeRelevant &&
        this.regionalDelegationUser
      ) {
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
                  class: 'modal-xl modal-dialog-centered',
                };
                config.initialState = {
                  programmingId: this.idProgramming,
                  regDelData,
                  callback: (next: boolean) => {
                    if (next) {
                      this.performForm
                        .get('regionalDelegationNumber')
                        .setValue(this.delegation);

                      this.performForm
                        .get('stationId')
                        .setValue(Number(this.dataProgramming.stationId));
                      this.setDataProgramming();
                    } else {
                      this.setDataProgramming();
                    }
                  },
                };

                this.modalService.show(WarehouseFormComponent, config);
              },
              error: error => {},
            });
        }
      } else {
        this.loading = false;
        const regDelData = this.regionalDelegationUser;
        let config = {
          ...MODAL_CONFIG,
          class: 'modal-lg modal-dialog-centered',
        };
        config.initialState = {
          programmingId: this.idProgramming,
          regDelData,
          callback: (next: boolean) => {
            if (next) {
              this.performForm
                .get('regionalDelegationNumber')
                .setValue(this.delegation);
              //this.setDataProgramming();
            }
          },
        };

        this.modalService.show(WarehouseFormComponent, config);
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
          this.alertInfo(
            'success',
            'Registro guardado',
            'Usuario agregado correctmante'
          ).then(question => {
            if (question.isConfirmed) {
              this.showUsersProgramming();
            }
          });
        }
      },
    };

    this.modalService.show(SearchUserFormComponent, config);
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
    const goodId = this.searchGoodsForm.get('goodId').value;

    if (
      !municipality &&
      !colony &&
      !akaWarehouse &&
      !postalCode &&
      !state &&
      !goodId
    ) {
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoods());
    }

    if (
      goodId &&
      !municipality &&
      !colony &&
      !akaWarehouse &&
      !postalCode &&
      !state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
        goodNumber: goodId,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }

    if (
      !goodId &&
      !municipality &&
      !colony &&
      akaWarehouse &&
      !postalCode &&
      !state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
        aliasStore: akaWarehouse,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }

    if (
      !goodId &&
      !municipality &&
      !colony &&
      !akaWarehouse &&
      !postalCode &&
      state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',

        stateKey: state,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }
    if (
      !goodId &&
      municipality &&
      !colony &&
      !akaWarehouse &&
      !postalCode &&
      state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
        municipality: municipality,
        stateKey: state,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }

    if (
      !goodId &&
      municipality &&
      colony &&
      !akaWarehouse &&
      !postalCode &&
      state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
        municipality: municipality,
        stateKey: state,
        locality: colony,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }

    if (
      !goodId &&
      municipality &&
      colony &&
      !akaWarehouse &&
      postalCode &&
      state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
        municipality: municipality,
        stateKey: state,
        locality: colony,
        postalCode: postalCode,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }

    if (
      !goodId &&
      !municipality &&
      !colony &&
      !akaWarehouse &&
      postalCode &&
      !state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',

        postalCode: postalCode,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }

    if (
      goodId &&
      municipality &&
      colony &&
      !akaWarehouse &&
      postalCode &&
      state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
        municipality: municipality,
        stateKey: state,
        locality: colony,
        postalCode: postalCode,
        goodNumber: goodId,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }

    if (
      goodId &&
      municipality &&
      colony &&
      akaWarehouse &&
      postalCode &&
      state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
        municipality: municipality,
        stateKey: state,
        locality: colony,
        postalCode: postalCode,
        goodNumber: goodId,
        aliasStore: akaWarehouse,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }

    if (
      goodId &&
      akaWarehouse &&
      !municipality &&
      !colony &&
      !postalCode &&
      !state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
        aliasStore: akaWarehouse,
        goodNumber: goodId,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }

    if (
      goodId &&
      !akaWarehouse &&
      municipality &&
      !colony &&
      !postalCode &&
      state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
        municipality: municipality,
        goodNumber: goodId,
        stateKey: state,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }
    if (
      goodId &&
      municipality &&
      !akaWarehouse &&
      colony &&
      !postalCode &&
      state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
        goodNumber: goodId,
        stateKey: state,
        municipality: municipality,
        locality: colony,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }

    if (
      goodId &&
      !municipality &&
      !akaWarehouse &&
      !colony &&
      postalCode &&
      !state
    ) {
      let tranferent: number = 0;
      let typeRelevant: number = 0;

      if (this.transferentId) {
        tranferent = this.transferentId;
      } else if (this.dataProgramming.tranferId)
        tranferent = this.dataProgramming.tranferId;

      if (this.idTypeRelevant) {
        typeRelevant = this.idTypeRelevant;
      } else if (this.dataProgramming.typeRelevantId) {
        typeRelevant = this.dataProgramming.typeRelevantId;
      }

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
        goodNumber: goodId,
        postalCode: postalCode,
      };

      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getProgGoodsSearch(filterColumns));
    }
  }

  showClean() {
    this.searchGoodsForm.reset();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getProgGoods());
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
          this.getWarehouseSelect(new ListParams());
          this.getStates(new ListParams());
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
    params['filter.sortBy'] = 'descCondition:ASC';
    params['filter.regionalDelegation'] = this.regionalDelegationUser.id;
    this.stateService.getAll(params).subscribe({
      next: data => {
        const filterStates = data.data.filter(_states => {
          return _states.stateCode;
        });

        const states = filterStates.map(items => {
          return items.stateCode;
        });

        this.states = new DefaultSelect(states, data.count);
      },
      error: error => {
        this.states = new DefaultSelect();
      },
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
      error: error => {
        this.transferences = new DefaultSelect();
      },
    });
  }

  getValueSelect(params?: ListParams) {
    params['filter.nmtable'] = 445;
    this.dynamicCatalogService.getTvalTable1(params).subscribe({
      next: response => {
        this.otValors = new DefaultSelect(response.data, response.count);
      },
      error: error => {},
    });
  }

  transferentSelect(transferent: ITransferente) {
    this.transferentId = transferent?.id;
    this.transferentName = transferent?.nameTransferent;
    this.performForm.get('stationId').setValue(null);
    this.performForm.get('autorityId').setValue(null);
    if (transferent?.id == 903) {
      this.showTypeValor = true;
    } else {
      this.showTypeValor = false;
    }
    this.getStations(new ListParams());
  }

  getStations(params?: ListParams) {
    if (this.transferentId == 1) {
      this.showSelectStation = true;
      params['filter.idTransferent'] = this.transferentId;
      //params['filter.idTransferer'] = `$eq:${this.delegationId}`;
      params['filter.keyState'] = this.idState;
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
    } else {
      this.showSelectStation = true;
      params['filter.idTransferent'] = this.transferentId;
      //params['filter.idTransferer'] = `$eq:${this.delegationId}`;
      //params['filter.keyState'] = this.idState;
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
    //params['filter.cveStatus'] = `$eq:${this.idState}`;
    params['filter.idStation'] = `$eq:${this.idStation}`;
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
    params['sortBy'] = 'aliasStock:ASC';
    this.storeAkaService.getAll(params).subscribe({
      next: response => {
        this.akaWarehouse = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.akaWarehouse = new DefaultSelect();
      },
    });
  }

  getStates(params?: ListParams) {
    params['filter.sortBy'] = 'descCondition:ASC';
    params['filter.regionalDelegation'] = this.regionalDelegationUser.id;

    this.stateService.getAll(params).subscribe({
      next: data => {
        console.log('data', data);
        const filterStates = data.data.filter(_states => {
          return _states.stateCode;
        });

        const states = filterStates.map(items => {
          return items.stateCode;
        });
        this.statesSearch = new DefaultSelect(states, data.count);
      },
      error: error => {
        this.statesSearch = new DefaultSelect();
      },
    });

    /*(data => {
      
    }); */
  }

  stateSearchSelect(state: IStateOfRepublic) {
    this.stateKey = state.id;
    this.getMunicipalities(new ListParams());
  }

  getMunicipalities(params?: ListParams) {
    params['sortBy'] = 'nameMunicipality:ASC';
    params['filter.stateKey'] = Number(this.stateKey);
    this.goodsinvService.getAllMunipalitiesByFilter(params).subscribe({
      next: response => {
        this.municipailitites = new DefaultSelect(
          response.data,
          response.count
        );
      },
      error: error => {
        this.municipailitites = new DefaultSelect();
      },
    });
    /*
    params['sortBy'] = 'nameMunicipality:ASC';
    params['filter.stateKey'] = this.stateKey;
    this.municipalityService.getAll(params).subscribe({
      next: response => {
        console.log('mun', response);
        this.municipailitites = new DefaultSelect(
          response.data,
          response.count
        );
      },
      error: error => {
        this.municipailitites = new DefaultSelect();
      },
    }); */
  }

  municipalitySearchSelect(municipality: IMunicipality) {
    this.idMunicipality = municipality.municipalityKey;
    this.getLocalities(new ListParams());
  }

  getLocalities(params?: ListParams) {
    params['sortBy'] = 'township:ASC';
    params['filter.municipalityKey'] = this.idMunicipality;
    params['filter.stateKey'] = this.stateKey;
    this.goodsinvService.getAllTownshipByFilter(params).subscribe({
      next: response => {
        this.localities = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.localities = new DefaultSelect();
      },
    });
  }

  authoritySelect(item: IAuthority) {
    this.idAuthority = item.idAuthority;
    this.autorityId = item.idAuthority;
    this.authorityName = item.authorityName;
  }

  getTypeRelevantSelect(params: ListParams) {
    params['sortBy'] = 'description:ASC';
    this.typeRelevantService.getAll(params).subscribe({
      next: data => {
        this.typeRelevant = new DefaultSelect(data.data, data.count);
        this.formLoading = false;
      },
      error: error => {
        this.typeRelevant = new DefaultSelect();
      },
    });
  }

  getWarehouseSelect(params: ListParams) {
    params['filter.regionalDelegation'] = this.delegationId;
    params['sortBy'] = 'name:ASC';
    this.showWarehouseInfo = true;
    this.goodsQueryService.getCatStoresView(params).subscribe({
      next: response => {
        console.log('almacenes', response);
        this.warehouse = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.warehouse = new DefaultSelect();
      },
    });
    /*params['sortBy'] = 'description:ASC';
    this.showWarehouseInfo = true;
    params.limit = 300;
    params['filter.responsibleDelegation'] = this.delegationId;
    this.warehouseService.getAll(params).subscribe({
      next: data => {
        this.warehouse = new DefaultSelect(data.data, data.count);
      },
      error: error => {
        this.warehouse = new DefaultSelect();
      },
    }); */
  }

  //Visualizar bienes transportables //

  getProgGoods() {
    let tranferent: number = 0;
    let typeRelevant: number = 0;

    if (this.transferentId) {
      tranferent = this.transferentId;
    } else if (this.dataProgramming.tranferId)
      tranferent = this.dataProgramming.tranferId;

    if (this.idTypeRelevant) {
      typeRelevant = this.idTypeRelevant;
    } else if (this.dataProgramming.typeRelevantId) {
      typeRelevant = this.dataProgramming.typeRelevantId;
    }

    if (this.transferentId != 903 || this.dataProgramming.tranferId != 903) {
      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
      };

      this.loadingGoods = true;

      this.goodsQueryService
        .postGoodsProgramming(this.params.getValue(), filterColumns)
        .subscribe({
          next: response => {
            if (response.count == 0) {
              this.loadingGoods = false;
              this.alert('warning', 'Advertencia', 'No se econtraron bienes');
              this.estatesList = new LocalDataSource();
            } else {
              let goodsFilter = response.data.map(async item => {
                const showMunicipality: any = await this.showMunicipality(
                  new ListParams(),
                  item.townshipKey,
                  item.stateKey
                );

                const showStateKey: any = await this.showStateOfRepublic(
                  item.stateKey
                );

                if (showStateKey) {
                  item.stateKeyName = showStateKey;
                }
                if (showMunicipality) {
                  item.municipalityName = showMunicipality;
                }
                if (item.physicalState) {
                  if (item.physicalState == 1) {
                    item.physicalState = 'BUENO';
                    return item;
                  } else if (item.physicalState == 2) {
                    item.physicalState = 'MALO';
                    return item;
                  }
                } else {
                  return item;
                }
              });
              Promise.all(goodsFilter).then((goodsFilter: any) => {
                //goodsFilter = goodsFilter.filter(item => item);
                this.estatesList.load(goodsFilter);
                this.goodsProgCopy = goodsFilter;
                this.loadingGoods = false;
                this.totalItems = response.count;
                //this.filterGoodsProgramming(goodsFilter);
              });
            }
          },
          error: error => (this.loadingGoods = false),
        });
    }

    if (this.transferentId == 903 || this.dataProgramming.tranferId == 903) {
      const type = this.performForm.get('aptoCilcular').value;

      const filterColumns: Object = {
        regionalDelegation: Number(
          this.dataProgramming.regionalDelegationNumber
        ),
        transferent: tranferent,
        relevantType: typeRelevant,
        statusGood: 'APROBADO',
        val25: type,
      };

      this.loadingGoods = true;

      this.goodsQueryService
        .postGoodsProgramming(this.params.getValue(), filterColumns)
        .subscribe({
          next: response => {
            let goodsFilter = response.data.map(async item => {
              const showMunicipality: any = await this.showMunicipality(
                new ListParams(),
                item.townshipKey,
                item.stateKey
              );

              const showStateKey: any = await this.showStateOfRepublic(
                item.stateKey
              );
              if (showStateKey) {
                item.stateKeyName = showStateKey;
              }

              if (showMunicipality) {
                item.municipalityName = showMunicipality;
              }
              if (item.physicalState) {
                if (item.physicalState == 1) {
                  item.physicalState = 'BUENO';
                  return item;
                } else if (item.physicalState == 2) {
                  item.physicalState = 'MALO';
                  return item;
                }
              } else {
                return item;
              }
            });
            Promise.all(goodsFilter).then((goodsFilter: any) => {
              //goodsFilter = goodsFilter.filter(item => item);
              this.estatesList.load(goodsFilter);
              this.goodsProgCopy = goodsFilter;
              this.loadingGoods = false;
              this.totalItems = response.count;
              //this.filterGoodsProgramming(goodsFilter);
            });
          },
          error: error => {
            this.alert('warning', 'Advertencia', 'No se econtraron bienes');
            this.loadingGoods = false;
            this.estatesList = new LocalDataSource();
          },
        });
    }
  }

  getProgGoodsSearch(filterData: Object) {
    this.loadingGoods = true;

    this.goodsQueryService
      .postGoodsProgramming(this.params.getValue(), filterData)
      .subscribe({
        next: response => {
          if (response.data.length == 0) {
            this.loadingGoods = false;
            this.alert('warning', 'Advertencia', 'No se econtraron bienes');
            this.estatesList = new LocalDataSource();
          } else {
            let goodsFilter = response.data.map(async item => {
              const showMunicipality: any = await this.showMunicipality(
                new ListParams(),
                item.townshipKey,
                item.stateKey
              );

              if (showMunicipality) {
                item.municipalityName = showMunicipality;
              }

              const showStateKey: any = await this.showStateOfRepublic(
                item.stateKey
              );
              if (showStateKey) {
                item.stateKeyName = showStateKey;
              }
              if (item.physicalState) {
                if (item.physicalState == 1) {
                  item.physicalState = 'BUENO';
                  return item;
                } else if (item.physicalState == 2) {
                  item.physicalState = 'MALO';
                  return item;
                }
              } else {
                return item;
              }
            });
            Promise.all(goodsFilter).then((goodsFilter: any) => {
              //goodsFilter = goodsFilter.filter(item => item);
              this.estatesList.load(goodsFilter);
              this.goodsProgCopy = goodsFilter;
              this.loadingGoods = false;
              this.totalItems = response.count;
              //this.filterGoodsProgramming(goodsFilter);
            });
          }
        },
        error: error => {
          this.alert('warning', 'Advertencia', 'No se econtraron bienes');
          this.loadingGoods = false;
          this.estatesList = new LocalDataSource();
        },
      });
  }

  showMunicipality(
    params: ListParams,
    townshipKey?: number,
    stateKey?: number
  ) {
    return new Promise((resolve, reject) => {
      params['filter.municipalityKey'] = townshipKey;
      params.limit = 50;
      this.goodsinvService.getAllMunipalitiesByFilter(params).subscribe({
        next: resp => {
          resolve(resp.data[0]?.municipality);
        },
      });
    });
  }

  showStateOfRepublic(stateKey: number) {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.id'] = stateKey;
      this.statesService.getAll(params.getValue()).subscribe({
        next: response => {
          resolve(response.data[0].descCondition);
        },
      });
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
            _good => _good?.goodId == good?.goodNumber
          );
          return index >= 0 ? false : true;
        });

        if (filter.length > 0) {
          this.estatesList.load(filter);
          this.loadingGoods = false;
          //this.estatesList.load(filter);
        } else {
          this.alert(
            'warning',
            'Advertencia',
            'No hay bienes disponibles para programar'
          );
          this.estatesList.load([]);
          this.loadingGoods = false;
        }
      });
  }

  //bienes ya programados
  GoodsProgramming(goodsFilter: any) {
    this.estatesList.load(goodsFilter);
    this.totalItems = this.estatesList.count();
  }

  sendTransportable() {
    if (!this.selectMasiveGood) {
      if (this.goodSelect.length) {
        this.alertQuestion(
          'warning',
          'Acción',
          'Los Bienes seleccionados serán enviados a transportable'
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
                  //const _showGoods = await this.showGoodsTransportable(showGoods);

                  /*this.params
                  .pipe(takeUntil(this.$unSubscribe))
                  .subscribe(() => this.getProgGoods()); */

                  this.params
                    .pipe(takeUntil(this.$unSubscribe))
                    .subscribe(() => this.getProgGoods());
                  this.paramsTransportableGoods
                    .pipe(takeUntil(this.$unSubscribe))
                    .subscribe(() => this.showTrans());
                  this.goodSelect = [];
                  /*if (_showGoods) {
                } */
                }
              }
            }
          }
        });
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'Se necesita tener un bien seleccionado'
        );
      }
    } else {
      this.alertQuestion(
        'warning',
        'Acción',
        'Todos los bienes serán enviados a transportable'
      ).then(question => {
        if (question.isConfirmed) {
          let tranferent: number = 0;
          let typeRelevant: number = 0;
          if (this.transferentId) {
            tranferent = this.transferentId;
          } else if (this.dataProgramming.tranferId)
            tranferent = this.dataProgramming.tranferId;

          if (this.idTypeRelevant) {
            typeRelevant = this.idTypeRelevant;
          } else if (this.dataProgramming.typeRelevantId) {
            typeRelevant = this.dataProgramming.typeRelevantId;
          }

          const formData = {
            regionalDelegation: Number(
              this.dataProgramming.regionalDelegationNumber
            ),
            transferent: tranferent,
            relevantType: typeRelevant,
            statusGood: 'APROBADO',
            programmingId: this.idProgramming,
            creationUser: 'Sigebi admon',
            modificationUser: 'Sigebi admon',
            version: '1',
            status: 'EN_TRANSPORTABLE',
          };

          this.massiveGoodService.createProgGoodMassive(formData).subscribe({
            next: response => {
              this.params
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getProgGoods());
              this.paramsTransportableGoods
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.showTrans());

              this.alert(
                'success',
                'Acción Correcta',
                'Bienes agregados a transportable correctamente'
              );
            },
            error: error => {},
          });
        }
      });
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
          status: 'VXP',
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
                //this.goodsTranportables.load(showTransportable);
                //this.totalItemsTransportableGoods =
                //this.goodsTranportables.count();

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
    if (this.selectMasiveGood) {
      this.alertQuestion(
        'warning',
        'Acción',
        'Todos los Bienes serán enviados a resguardo'
      ).then(question => {
        if (question.isConfirmed) {
          let config = {
            ...MODAL_CONFIG,
            class: 'modal-lg modal-dialog-centered',
          };
          config.initialState = {
            typeTransportable: 'guard',
            typeTrans: 'massive',
            delegation: this.delegationId,
            idTransferent: this.dataProgramming.tranferId,
            callback: async (_data: any) => {
              if (_data) {
                let tranferent: number = 0;
                let typeRelevant: number = 0;
                if (this.transferentId) {
                  tranferent = this.transferentId;
                } else if (this.dataProgramming.tranferId)
                  tranferent = this.dataProgramming.tranferId;

                if (this.idTypeRelevant) {
                  typeRelevant = this.idTypeRelevant;
                } else if (this.dataProgramming.typeRelevantId) {
                  typeRelevant = this.dataProgramming.typeRelevantId;
                }

                const formData = {
                  regionalDelegation: Number(
                    this.dataProgramming.regionalDelegationNumber
                  ),
                  transferent: tranferent,
                  relevantType: typeRelevant,
                  statusGood: 'APROBADO',
                  programmingId: this.idProgramming,
                  creationUser: 'Sigebi admon',
                  modificationUser: 'Sigebi admon',
                  version: '1',
                  status: 'EN_RESGUARDO_TMP',
                };

                this.massiveGoodService
                  .createProgGoodMassive(formData)
                  .subscribe({
                    next: response => {
                      const data = {
                        programmingId: this.idProgramming,
                        status: 'EN_RESGUARDO_TMP',
                        storeNumber: _data,
                      };
                      this.goodProcessService
                        .updateMassiveStore(data)
                        .subscribe({
                          next: response => {},
                          error: error => {},
                        });
                      this.params
                        .pipe(takeUntil(this.$unSubscribe))
                        .subscribe(() => this.getProgGoods());
                      this.paramsTransportableGoods
                        .pipe(takeUntil(this.$unSubscribe))
                        .subscribe(() => this.showGuard());

                      this.alert(
                        'success',
                        'Acción Correcta',
                        'Bienes agregados a almacén correctamente'
                      );
                    },
                    error: error => {},
                  });
              }
            },
          };

          this.modalService.show(WarehouseSelectFormComponent, config);
        }
      });
    } else {
      if (this.goodSelect.length) {
        this.alertQuestion(
          'warning',
          'Acción',
          'Los Bienes seleccionados serán enviados a resguardo'
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
                    if (!this.selectMasiveGood) {
                      const createProgGood = await this.addGoodsGuards();

                      if (createProgGood) {
                        const updateGood: any =
                          await this.changeStatusGoodGuard(data);

                        if (updateGood) {
                          this.params
                            .pipe(takeUntil(this.$unSubscribe))
                            .subscribe(() => this.getProgGoods());
                          this.paramsGuardGoods
                            .pipe(takeUntil(this.$unSubscribe))
                            .subscribe(() => this.showGuard());
                          this.goodSelect = [];
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
        this.alert(
          'warning',
          'Acción Invalida',
          'Se necesita tener un bien seleccionado'
        );
      }
    }
  }

  updateWarehouseGuard(store: number) {
    return new Promise((resolve, reject) => {
      const data = {
        programmingId: this.idProgramming,
        status: 'EN_RESGUARDO_TMP',
        storeNumber: store,
      };
      this.goodProcessService.updateMassiveStore(data).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(true);
        },
      });
      /*this.goodsTranportables.getElements().then(data => {
        if (data.length > 0) {
          data.map((good: IGood) => {
            const object = {
              id: good.id,
              goodId: good.goodId,
              storeId: this.warehouseId,
            };
            this.goodService.updateByBody(object).subscribe({
              next: response => {
                resolve(true);
              },
              error: error => {},
            });
          });
        } else {
          resolve(true);
        }
      }); */
    });
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
  changeStatusGoodGuard(warehouse: number) {
    return new Promise(async (resolve, reject) => {
      this.goodSelect.map(item => {
        const formData: Object = {
          id: Number(item.goodNumber),
          goodId: item.googId,
          goodStatus: 'EN_RESGUARDO_TMP',
          programmationStatus: 'EN_RESGUARDO_TMP',
          storeId: warehouse,
          status: 'VXP',
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
              //this.headingGuard = `Resguardo (${this.goodsGuards.count()})`;
              resolve(true);
            });
          },
        });
      });
    });
  }

  /* Enviar datos a almacén */
  sendWarehouse() {
    if (this.selectMasiveGood) {
      this.alertQuestion(
        'warning',
        'Acción',
        'Todos los Bienes serán enviados a almacén'
      ).then(question => {
        if (question.isConfirmed) {
          let config = {
            ...MODAL_CONFIG,
            class: 'modal-lg modal-dialog-centered',
          };
          config.initialState = {
            typeTransportable: 'warehouse',
            typeTrans: 'massive',
            delegation: this.delegationId,
            callback: async (_data: any) => {
              if (_data) {
                let tranferent: number = 0;
                let typeRelevant: number = 0;
                if (this.transferentId) {
                  tranferent = this.transferentId;
                } else if (this.dataProgramming.tranferId)
                  tranferent = this.dataProgramming.tranferId;

                if (this.idTypeRelevant) {
                  typeRelevant = this.idTypeRelevant;
                } else if (this.dataProgramming.typeRelevantId) {
                  typeRelevant = this.dataProgramming.typeRelevantId;
                }

                const formData = {
                  regionalDelegation: Number(
                    this.dataProgramming.regionalDelegationNumber
                  ),
                  transferent: tranferent,
                  relevantType: typeRelevant,
                  statusGood: 'APROBADO',
                  programmingId: this.idProgramming,
                  creationUser: 'Sigebi admon',
                  modificationUser: 'Sigebi admon',
                  version: '1',
                  status: 'EN_ALMACEN_TMP',
                };

                this.massiveGoodService
                  .createProgGoodMassive(formData)
                  .subscribe({
                    next: response => {
                      const data = {
                        programmingId: this.idProgramming,
                        status: 'EN_ALMACEN_TMP',
                        storeNumber: _data,
                      };
                      this.goodProcessService
                        .updateMassiveStore(data)
                        .subscribe({
                          next: response => {},
                          error: error => {},
                        });
                      this.params
                        .pipe(takeUntil(this.$unSubscribe))
                        .subscribe(() => this.getProgGoods());
                      this.paramsWarehouseGoods
                        .pipe(takeUntil(this.$unSubscribe))
                        .subscribe(() => this.showWarehouseGoods());
                      this.goodSelect = [];

                      this.alert(
                        'success',
                        'Acción Correcta',
                        'Bienes agregados a almacén correctamente'
                      );
                    },
                    error: error => {},
                  });
              }
            },
          };

          this.modalService.show(WarehouseSelectFormComponent, config);
        }
      });
      /*
      this.alertQuestion(
        'warning',
        'Acción',
        'Todos los Bienes serán enviados a Almacén'
      ).then(question => {
        if (question.isConfirmed) {
          let tranferent: number = 0;
          let typeRelevant: number = 0;
          if (this.transferentId) {
            tranferent = this.transferentId;
          } else if (this.dataProgramming.tranferId)
            tranferent = this.dataProgramming.tranferId;

          if (this.idTypeRelevant) {
            typeRelevant = this.idTypeRelevant;
          } else if (this.dataProgramming.typeRelevantId) {
            typeRelevant = this.dataProgramming.typeRelevantId;
          }

          const formData = {
            regionalDelegation: Number(
              this.dataProgramming.regionalDelegationNumber
            ),
            transferent: tranferent,
            relevantType: typeRelevant,
            statusGood: 'APROBADO',
            programmingId: this.idProgramming,
            creationUser: 'Sigebi admon',
            modificationUser: 'Sigebi admon',
            version: '1',
            status: 'EN_ALMACEN_TMP',
          };

          this.massiveGoodService.createProgGoodMassive(formData).subscribe({
            next: response => {
              console.log('response', response);
              const data = {
                programmingId: this.idProgramming,
                status: 'EN_ALMACEN_TMP',
                storeNumber: this.warehouseId,
              };
              this.goodProcessService.updateMassiveStore(data).subscribe({
                next: response => {},
                error: error => {},
              });
              this.params
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getProgGoods());
              this.paramsTransportableGoods
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.showWarehouseGoods());

              this.alert(
                'success',
                'Acción Correcta',
                'Bienes agregados a almacén correctamente'
              );
            },
            error: error => {
              console.log('error', error);
            },
          });
        }
      }); */
    } else {
      if (this.goodSelect.length) {
        this.alertQuestion(
          'warning',
          'Acción',
          'Los Bienes seleccionados serán enviados a Almacén'
        ).then(question => {
          if (question.isConfirmed) {
            let config = {
              ...MODAL_CONFIG,
              class: 'modal-lg modal-dialog-centered',
            };
            const idTransferent = this.transferentId;
            config.initialState = {
              idTransferent,
              delegation: this.delegationId,
              typeTransportable: 'warehouse',
              callback: async (warehouse: number) => {
                if (warehouse) {
                  const createProgGood = await this.addGoodsWarehouse();
                  if (createProgGood) {
                    const updateGood: any =
                      await this.changeStatusGoodWarehouse(warehouse);
                    if (updateGood) {
                      /*const showGoods: any = await this.getFilterGood(
                      'EN_ALMACEN_TMP'
                    ); */

                      /*const _showGoods = await this.showGoodsWarehouse(
                        showGoods
                      ); */
                      this.params
                        .pipe(takeUntil(this.$unSubscribe))
                        .subscribe(() => this.getProgGoods());
                      this.paramsWarehouseGoods
                        .pipe(takeUntil(this.$unSubscribe))
                        .subscribe(() => this.showWarehouseGoods());
                      this.goodSelect = [];
                    }
                  }
                }
              },
            };

            this.modalService.show(WarehouseSelectFormComponent, config);
          }
        });
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'Se necesita tener un bien seleccionado'
        );
      }
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
          status: 'VXP',
        };
        this.goodService.updateByBody(formData).subscribe({
          next: response => {
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
              //this.headingWarehouse = `Almacén INDEP (${this.goodsWarehouse.count()})`;
              resolve(true);
            });
          },
        });
      });
    });
  }

  // Visualizar información del bien //
  showGood(item: IGoodProgrammingSelect) {
    let config = { ...MODAL_CONFIG, class: 'modal-xl modal-dialog-centered' };
    config.initialState = {
      item,
      callback: () => {},
    };
    this.modalService.show(DetailGoodProgrammingFormComponent, config);
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

  showGoodWarehouse(item: IGoodProgrammingSelect) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      item,
      callback: () => {},
    };
    this.modalService.show(DomicileFormComponent, config);
  }

  removeGoodTrans(item: IGood) {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea Eliminar el Bien de transportable?'
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
                'El Bien se elimino de la sección de transportable'
              );
              const deleteGood = this.goodsTranportables.count();
              this.headingTransportable = `Transportable(${deleteGood})`;
              this.params
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getProgGoods());
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
      'question',
      'Confirmación',
      '¿Desea Eliminar el Bien de resguardo?'
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
                'El bien se elimino de la sección de resguardo'
              );
              const deleteGood = this.goodsGuards.count();
              this.headingGuard = `Resguardo(${deleteGood})`;

              this.params
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getProgGoods());
            });
        }
      }
    });
  }

  removeGoodWarehouse(item: IGood) {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea Eliminar el Bien de almacén?'
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
                'El bien se elimino de la sección de almacén'
              );
              const deleteGood = this.goodsWarehouse.count();
              this.headingWarehouse = `Almacén INDEP(${deleteGood})`;

              this.params
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getProgGoods());
            });
        }
      }
    });
  }

  //Actualizar programación con información de la programación
  confirm() {
    if (!this.showTypeValor) this.performForm.removeControl('aptoCilcular');
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea guardar la información de la programación?'
    ).then(async question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.performForm
          .get('regionalDelegationNumber')
          .setValue(this.delegationId);

        this.performForm.get('delregAttentionId').setValue(this.delegationId);
        if (this.transferentId)
          this.performForm.get('tranferId').setValue(this.transferentId);
        if (this.stationId)
          this.performForm.get('stationId').setValue(this.stationId);
        if (this.autorityId) {
          this.performForm.get('autorityId').setValue(this.autorityId);
        }

        if (this.warehouseId > 0)
          this.performForm.get('storeId').setValue(this.warehouseId);

        if (this.dataProgramming?.folio)
          this.performForm.get('folio').setValue(this.dataProgramming?.folio);

        const startDate = moment(
          this.performForm.get('startDate').value,
          'DD/MM/YYYY HH:mm:ss'
        ).toDate();

        const endDate = moment(
          this.performForm.get('endDate').value,
          'DD/MM/YYYY HH:mm:ss'
        ).toDate();

        this.performForm.get('startDate').setValue(startDate);
        this.performForm.get('endDate').setValue(endDate);
        console.log('this.performForm', this.performForm.value);

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
                if (this.warehouseId > 0) {
                  const updateWarehouseGood = await this.updateWarehouseGood();
                  if (updateWarehouseGood) {
                    this.getProgrammingData();
                    this.formLoading = false;
                    this.newTransferent = false;
                  }
                } else {
                  this.getProgrammingData();
                  this.formLoading = false;
                  this.newTransferent = false;
                }
              },
              error: error => {},
            });
        }
      }
    });

    /*if (
      this.dataProgramming.startDate &&
      this.dataProgramming.endDate &&
      this.dataProgramming.address &&
      this.dataProgramming.stateKey &&
      this.dataProgramming.tranferId &&
      this.dataProgramming.autorityId
    ) {
      if (this.transferentId)
        this.performForm.get('tranferId').setValue(this.transferentId);
      if (this.stationId)
        this.performForm.get('stationId').setValue(this.stationId);
      if (this.autorityId) {
        this.performForm.get('autorityId').setValue(this.autorityId);
      }

      if (this.warehouseId > 0)
        this.performForm.get('storeId').setValue(this.warehouseId);

      const data = {
        emailTransfer: this.performForm.get('emailTransfer').value,
        address: this.performForm.get('address').value,
        city: this.performForm.get('city').value,
        observation: this.performForm.get('observation').value,
        regionalDelegationNumber: this.delegationId,
        stateKey: this.performForm.get('stateKey').value,
        tranferId: this.performForm.get('tranferId').value,
        stationId: this.performForm.get('stationId').value,
        autorityId: this.performForm.get('autorityId').value,
        typeRelevantId: this.performForm.get('typeRelevantId').value,
        storeId: this.performForm.get('storeId').value,
      };

      this.performForm.get('delregAttentionId').setValue(this.delegationId);
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea guardar la información de la programación?'
      ).then(async question => {
        if (question.isConfirmed) {
          this.loading = true;
          this.formLoading = true;
          const folio: any = await this.generateFolio(this.performForm.value);
          this.performForm.get('folio').setValue(folio);
          if (this.warehouseId > 0)
            this.performForm.get('storeId').setValue(this.warehouseId);
          const task = JSON.parse(localStorage.getItem('Task'));

          const updateTask = await this.updateTask(folio, task.id);
          if (updateTask) {
            this.programmingGoodService
              .updateProgramming(this.idProgramming, data)
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
                  if (this.warehouseId > 0) {
                    const updateWarehouseGood =
                      await this.updateWarehouseGood();
                    if (updateWarehouseGood) {
                      this.getProgrammingData();
                      this.formLoading = false;
                      this.newTransferent = false;
                    }
                  } else {
                    this.getProgrammingData();
                    this.formLoading = false;
                    this.newTransferent = false;
                  }
                },
                error: error => {},
              });
          }
        }
      });
    } else {
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
        'question',
        'Confirmación',
        '¿Desea guardar la información de la programación?'
      ).then(async question => {
        if (question.isConfirmed) {
          this.loading = true;
          this.formLoading = true;
          const folio: any = await this.generateFolio(this.performForm.value);
          this.performForm.get('folio').setValue(folio);
          if (this.warehouseId > 0)
            this.performForm.get('storeId').setValue(this.warehouseId);
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
                  if (this.warehouseId > 0) {
                    const updateWarehouseGood =
                      await this.updateWarehouseGood();
                    if (updateWarehouseGood) {
                      this.getProgrammingData();
                      this.formLoading = false;
                      this.newTransferent = false;
                    }
                  } else {
                    this.getProgrammingData();
                    this.formLoading = false;
                    this.newTransferent = false;
                  }
                },
                error: error => {},
              });
          }
        }
      });
    } */
  }

  updateWarehouseGood() {
    return new Promise((resolve, reject) => {
      const data = {
        programmingId: this.idProgramming,
        status: 'EN_TRANSPORTABLE',
        storeNumber: this.warehouseId,
      };
      this.goodProcessService.updateMassiveStore(data).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(true);
        },
      });
      /*this.goodsTranportables.getElements().then(data => {
        if (data.length > 0) {
          data.map((good: IGood) => {
            const object = {
              id: good.id,
              goodId: good.goodId,
              storeId: this.warehouseId,
            };
            this.goodService.updateByBody(object).subscribe({
              next: response => {
                resolve(true);
              },
              error: error => {},
            });
          });
        } else {
          resolve(true);
        }
      }); */
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
    this.performForm.removeControl('aptoCilcular');
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
      this.alert('warning', 'Advertencia', `${message}`);
    } else if (error == 0) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea guardar la información de la programación?'
      ).then(async question => {
        if (question.isConfirmed) {
          if (this.transferentId)
            this.performForm.get('tranferId').setValue(this.transferentId);
          if (this.stationId)
            this.performForm.get('stationId').setValue(this.stationId);
          if (this.autorityId) {
            this.performForm.get('autorityId').setValue(this.autorityId);
          }
          this.loading = true;
          this.formLoading = true;
          const folio: any = await this.generateFolio(this.performForm.value);
          this.performForm.get('folio').setValue(folio);

          const task = JSON.parse(localStorage.getItem('Task'));

          const updateTask = await this.updateTask(folio, task.id);
          if (updateTask) {
            const _startDate = moment(
              startDate,
              'DD/MM/YYYY HH:mm:ss'
            ).toDate();
            const _endDate = moment(endDate, 'DD/MM/YYYY HH:mm:ss').toDate();
            const data = {
              emailTransfer: this.performForm.get('emailTransfer').value,
              address: this.performForm.get('address').value,
              city: this.performForm.get('city').value,
              observation: this.performForm.get('observation').value,
              regionalDelegationNumber: this.delegationId,
              stateKey: this.performForm.get('stateKey').value,
              tranferId: this.performForm.get('tranferId').value,
              startDate: _startDate,
              endDate: _endDate,
              stationId: this.performForm.get('stationId').value,
              autorityId: this.performForm.get('autorityId').value,
              typeRelevantId: this.performForm.get('typeRelevantId').value,
              storeId: this.performForm.get('storeId').value,
            };

            console.log('guardar', data);
            this.programmingGoodService
              .updateProgramming(this.idProgramming, data)
              .subscribe({
                next: async () => {
                  this.performForm
                    .get('regionalDelegationNumber')
                    .setValue(this.delegation);

                  if (this.warehouseId > 0) {
                    const updateWarehouseGood =
                      await this.updateWarehouseGood();
                    if (updateWarehouseGood) {
                      this.generateTaskAceptProgramming(folio);
                      this.loading = false;
                      this.formLoading = false;
                    }
                  } else {
                    this.generateTaskAceptProgramming(folio);
                    this.loading = false;
                    this.formLoading = false;
                  }
                },
                error: error => {},
              });
          }
        }
      });
      /*
      if (
        this.dataProgramming.startDate &&
        this.dataProgramming.endDate &&
        this.dataProgramming.address &&
        this.dataProgramming.stateKey &&
        this.dataProgramming.tranferId &&
        this.dataProgramming.autorityId
      ) {
        if (this.transferentId)
          this.performForm.get('tranferId').setValue(this.transferentId);
        if (this.stationId)
          this.performForm.get('stationId').setValue(this.stationId);
        if (this.autorityId) {
          this.performForm.get('autorityId').setValue(this.autorityId);
        }

        if (this.warehouseId > 0)
          this.performForm.get('storeId').setValue(this.warehouseId);

        const data = {
          emailTransfer: this.performForm.get('emailTransfer').value,
          address: this.performForm.get('address').value,
          city: this.performForm.get('city').value,
          observation: this.performForm.get('observation').value,
          regionalDelegationNumber: this.delegationId,
          stateKey: this.performForm.get('stateKey').value,
          tranferId: this.performForm.get('tranferId').value,
          stationId: this.performForm.get('stationId').value,
          autorityId: this.performForm.get('autorityId').value,
          typeRelevantId: this.performForm.get('typeRelevantId').value,
          storeId: this.performForm.get('storeId').value,
        };

        this.performForm.get('delregAttentionId').setValue(this.delegationId);
        this.alertQuestion(
          'question',
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
                .updateProgramming(this.idProgramming, data)
                .subscribe({
                  next: async () => {
                    this.performForm
                      .get('regionalDelegationNumber')
                      .setValue(this.delegation);

                    if (this.warehouseId > 0) {
                      const updateWarehouseGood =
                        await this.updateWarehouseGood();
                      if (updateWarehouseGood) {
                        this.generateTaskAceptProgramming(folio);
                        this.loading = false;
                      }
                    } else {
                      this.generateTaskAceptProgramming(folio);
                      this.loading = false;
                    }
                  },
                  error: error => {},
                });
            }
          }
        });
      } else {
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

        this.performForm.get('tranferId').setValue(this.transferentId);
        this.performForm.get('stationId').setValue(this.stationId);
        this.performForm.get('storeId').setValue(this.warehouseId);
        this.performForm.get('autorityId').setValue(this.autorityId);
        this.performForm
          .get('regionalDelegationNumber')
          .setValue(this.delegationId);
        this.performForm.get('delregAttentionId').setValue(this.delegationId);
        this.alertQuestion(
          'question',
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

                    if (this.warehouseId > 0) {
                      const updateWarehouseGood =
                        await this.updateWarehouseGood();
                      if (updateWarehouseGood) {
                        this.generateTaskAceptProgramming(folio);
                        this.loading = false;
                      }
                    } else {
                      this.generateTaskAceptProgramming(folio);
                      this.loading = false;
                    }
                  },
                  error: error => {},
                });
            }
          }
        });
      } */
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
    task['idAuthority'] = this.autorityId;
    task['nbAuthority'] = this.authorityName;
    task['idTransferee'] = this.transferentId;
    task['nbTransferee'] = this.transferentName;
    task['idStore'] = this.warehouseId;
    task['urlNb'] = 'pages/request/programming-request/acept-programming';
    task['processName'] = 'SolicitudProgramacion';
    task['taskDefinitionId'] = _task.id;
    body['task'] = task;

    const taskResult = await this.createTaskOrderService(body);

    this.loading = false;
    if (taskResult) {
      this.msgGuardado(
        'success',
        'Creación de tarea correcta',
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
      'question',
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
            this.alert('success', 'Correcto', 'Usuario eliminado');
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
          this.totalItemsUsers = 0;
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
          this.alert('warning', 'Advertencia', 'Error al generar reporte');
        },
      });
  }

  downloadExcel(excel: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excel}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.download = 'Bienes_Programables.xlsx';
    downloadLink.click();
    this.alert('success', 'Acción Correcta', 'Archivo generado');
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
          moment(new Date(this.dataProgramming.startDate)).format(
            'DD/MM/YYYY HH:mm:ss'
          )
        );
      this.performForm
        .get('endDate')
        .setValue(
          moment(new Date(this.dataProgramming.endDate)).format(
            'DD/MM/YYYY HH:mm:ss'
          )
        );

      this.transferentId = this.dataProgramming.tranferId;

      this.stationId = this.dataProgramming.stationId;
      this.autorityId = this.dataProgramming.autorityId;

      this.delegationId = this.dataProgramming.regionalDelegationNumber;
      this.dataProg = true;

      this.paramsGuardGoods
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.showGuard());

      this.paramsTransportableGoods
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.showTrans());

      this.paramsWarehouseGoods
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.showWarehouseGoods());
      /*const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.programmingId'] = this.idProgramming;
      this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
        next: async data => {
         this.paramsTransportableGoods
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.showTransportable(data.data, data.count)); 

          this.showGuard(data.data, data.count);
        },
        error: error => {},
      }); */

      if (this.dataProgramming.storeId > 0) {
        console.log('storeId', this.dataProgramming.storeId);
        const params = new BehaviorSubject<ListParams>(new ListParams());
        params.getValue()['filter.organizationCode'] =
          this.dataProgramming.storeId;
        this.goodsQueryService.getCatStoresView(params.getValue()).subscribe({
          next: response => {
            console.log('almacenes', response);
            this.performForm.get('storeId').setValue(response.data[0].name);
            this.warehouseId = response.data[0].organizationCode;
            this.warehouseUbication = response.data[0].address1;
          },
          error: error => {},
        });
        /*this.warehouseService.getById(this.dataProgramming.storeId).subscribe({
          next: response => {
            this.performForm.get('storeId').setValue(response.description);
            this.warehouseId = response?.idWarehouse;
            this.warehouseUbication = response.ubication;
          },
          error: error => {},
        }); */
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
      this.paramsAuthority.getValue()['filter.idAuthority'] = this.autorityId;
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

  showTrans() {
    this.formLoadingTransportable = true;

    this.paramsTransportableGoods.getValue()['filter.programmingId'] =
      this.idProgramming;
    this.paramsTransportableGoods.getValue()['filter.status'] =
      'EN_TRANSPORTABLE';
    this.programmingService
      .getGoodsProgramming(this.paramsTransportableGoods.getValue())
      .subscribe({
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
                    if (item.physicalStatus == 2)
                      item['physicalStatus'] = 'MALO';
                    showTransportable.push(item);

                    this.goodsTranportables.load(showTransportable);
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

    /*console.log('goodsProg', goodsProg);
    console.log('count', count);
    this.formLoadingGuard = true;
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
              this.totalItemsTransportableGuard = count;
              this.headingGuard = `Resguardo(${count})`;
              this.formLoadingGuard = false;
            });
          },
        });
    }); */
  }

  showGuard() {
    this.formLoadingGuard = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.idProgramming;
    params.getValue()['filter.status'] = 'EN_RESGUARDO_TMP';
    this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
      next: async data => {
        this.totalItemsTransportableGuard = data.count;
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

    /*console.log('goodsProg', goodsProg);
    console.log('count', count);
    this.formLoadingGuard = true;
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
              this.totalItemsTransportableGuard = count;
              this.headingGuard = `Resguardo(${count})`;
              this.formLoadingGuard = false;
            });
          },
        });
    }); */
  }

  goodsSelect(data: any) {
    this.goodSelect = data;
  }

  showWarehouseGoods() {
    this.formLoadingWarehouse = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.idProgramming;
    params.getValue()['filter.status'] = 'EN_ALMACEN_TMP';

    this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
      next: async data => {
        this.totalItemsTransportableWarehouse = data.count;
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
    /*this.formLoadingWarehouse = true;
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
            this.totalItemsTransportableWarehouse = count;
            this.headingWarehouse = `Almacén INDEP(${count})`;
            this.formLoadingWarehouse = false;
          });
        },
      });
    }); */
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
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
      }
    });
  }

  checkInfoDate(startDate: Date) {
    const _startDate = moment(this.performForm.get('startDate').value).format(
      'DD/MM/YYYY'
    );
    const _endDateFormat = moment(this.performForm.get('endDate').value).format(
      'DD/MM/YYYY'
    );

    if (this.transferentId != 903) {
      const date = moment(new Date()).format('YYYY/MM/DD');
      const formData = {
        days: 5,
        hours: 0,
        minutes: 0,
        date: date,
      };
      this.programmingService.getDateProgramming(formData).subscribe({
        next: (response: any) => {
          const correctDate = moment(response).format('DD/MM/YYYY');
          if (correctDate > _startDate || correctDate > _endDateFormat) {
            this.performForm
              .get('startDate')
              .addValidators([minDate(new Date(response))]);
            this.performForm
              .get('startDate')
              .setErrors({ minDate: { min: new Date(response) } });
            this.performForm.markAllAsTouched();

            this.performForm
              .get('endDate')
              .addValidators([minDate(new Date(response))]);
            this.performForm
              .get('endDate')
              .setErrors({ minDate: { min: new Date(response) } });
            this.performForm.markAllAsTouched();
          }
        },
        error: error => {},
      });
    }

    /*
    const _endDateFormat = moment(this.performForm.get('endDate').value).format(
      'DD/MM/YYYY'
    );

    const date = moment(new Date()).format('YYYY/MM/DD');
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const formData = {
      days: 5,
      hours: hour,
      minutes: minute,
      date: date,
    };

    this.programmingService.getDateProgramming(formData).subscribe({
      next: (response: any) => {
        const correctDate = moment(response).format('DD/MM/YYYY');

        if (correctDate > _startDateFormat || correctDate > _endDateFormat) {
          this.performForm
            .get('startDate')
            .addValidators([minDate(new Date(response))]);
          this.performForm
            .get('startDate')
            .setErrors({ minDate: { min: new Date(response) } });
          this.performForm.markAllAsTouched();

          this.performForm
            .get('endDate')
            .addValidators([minDate(new Date(response))]);
          this.performForm
            .get('endDate')
            .setErrors({ minDate: { min: new Date(response) } });
          this.performForm.markAllAsTouched();
        }
      },
    }); */
    /*

    const _endDateFormat = moment(this.performForm.get('endDate').value).format(
      'YYYY/MM/DD HH:mm:ss'
    );
    const date = moment(new Date()).format('YYYY/MM/DD');
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const formData = {
      days: 5,
      hours: hour,
      minutes: minute,
      date: date,
    };

    this.programmingService.getDateProgramming(formData).subscribe({
      next: (response: any) => {
        const correctDate = moment(response).format('DD/MM/YYYY');
        if (correctDate > _startDateFormat || correctDate > _endDateFormat) {
          this.performForm
            .get('startDate')
            .addValidators([minDate(new Date(response))]);
          this.performForm
            .get('startDate')
            .setErrors({ minDate: { min: new Date(response) } });
          this.performForm.markAllAsTouched();
          //this.performForm.reset();
          this.performForm
            .get('endDate')
            .addValidators([minDate(new Date(response))]);
          this.performForm
            .get('endDate')
            .setErrors({ minDate: { min: new Date(response) } });
          this.performForm.markAllAsTouched();
          //this.performForm.reset();
          const endDate = this.performForm.get('endDate').value;
          const _endDateFormat = moment(endDate).format('DD/MM/YYYY, HH:mm:ss');
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
          }
        }
      },
      error: error => {},
    }); */
  }

  checkInfoEndDate(endDate: Date) {
    const _endDateFormat = moment(this.performForm.get('endDate').value).format(
      'DD/MM/YYYY'
    );
    const _startDateFormat = moment(
      this.performForm.get('startDate').value
    ).format('DD/MM/YYYY');

    if (_startDateFormat > _endDateFormat) {
      const correctDate = moment(
        this.performForm.get('startDate').value
      ).format('DD/MM/YYYY HH:mm:ss');
      this.performForm
        .get('endDate')
        .addValidators([minDate(new Date(correctDate))]);
      this.performForm
        .get('endDate')
        .setErrors({ minDate: { min: new Date(correctDate) } });
      this.performForm.markAllAsTouched();
    }
  }

  selectAllGoods() {
    this.selectMasiveGood = true;
  }

  removeSelectGoods() {
    this.selectMasiveGood = false;
  }

  deleteMassiveGoodTransportable() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea eliminar todos los Bienes de transportable?'
    ).then(question => {
      if (question.isConfirmed) {
        const data = {
          schedulesId: this.idProgramming,
          status: 'EN_TRANSPORTABLE',
        };

        this.programmingService.deleteGoodsMassive(data).subscribe({
          next: response => {
            this.alert(
              'success',
              'Acción Correcta',
              'Bienes eliminados de transportable correctamente'
            );
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getProgGoods());
            this.paramsTransportableGoods
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.showTrans());

            this.goodsTranportables = new LocalDataSource();
            const deleteGood = this.goodsTranportables.count();
            this.headingTransportable = `Transportable(${deleteGood})`;
            this.totalItemsTransportableGoods = deleteGood;
          },
          error: error => {},
        });
      }
    });
  }
  deleteMassiveGoodGuard() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea eliminar todos los Bienes de resguardo?'
    ).then(question => {
      if (question.isConfirmed) {
        const data = {
          schedulesId: this.idProgramming,
          status: 'EN_RESGUARDO_TMP',
        };

        this.programmingService.deleteGoodsMassive(data).subscribe({
          next: response => {
            this.alert(
              'success',
              'Acción Correcta',
              'Bienes eliminados de resguardo correctamente'
            );
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getProgGoods());
            this.paramsGuardGoods
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.showGuard());

            this.goodsGuards = new LocalDataSource();
            const deleteGood = this.goodsGuards.count();
            this.headingGuard = `Resguardo(${deleteGood})`;
            this.totalItemsTransportableGuard = deleteGood;
          },
          error: error => {},
        });
      }
    });
  }

  deleteMassiveGoodWarehouse() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea eliminar todos los Bienes de almacén?'
    ).then(question => {
      if (question.isConfirmed) {
        const data = {
          schedulesId: this.idProgramming,
          status: 'EN_ALMACEN_TMP',
        };

        this.programmingService.deleteGoodsMassive(data).subscribe({
          next: response => {
            this.alert(
              'success',
              'Acción Correcta',
              'Bienes eliminados de almacén correctamente'
            );
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getProgGoods());
            this.paramsWarehouseGoods
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.showWarehouseGoods());
            this.goodSelect = [];

            this.goodsWarehouse = new LocalDataSource();
            const deleteGood = this.goodsWarehouse.count();
            this.headingWarehouse = `Almacén INDEP(${deleteGood})`;
            this.totalItemsTransportableWarehouse = deleteGood;
          },
          error: error => {},
        });
      }
    });
  }
}
