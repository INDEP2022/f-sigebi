import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addDays } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { minDate } from 'src/app/common/validations/date.validators';
import { IAuthority } from 'src/app/core/models/catalogs/authority.model';
import { IDelegationState } from 'src/app/core/models/catalogs/delegation-state.model';
import { IRegionalDelegation } from 'src/app/core/models/catalogs/regional-delegation.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { IStation } from 'src/app/core/models/catalogs/station.model';
import { ITransferente } from 'src/app/core/models/catalogs/transferente.model';
import { ITypeRelevant } from 'src/app/core/models/catalogs/type-relevant.model';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { WarehouseFormComponent } from '../../../shared-request/warehouse-form/warehouse-form.component';
import { ESTATE_COLUMNS } from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS } from '../../acept-programming/columns/users-columns';
import { SearchUserFormComponent } from '../../schedule-reception/search-user-form/search-user-form.component';
import { userData } from '../../schedule-reception/search-user-form/users-data';
import { ProgrammingGoodService } from '../../service/programming-good.service';
import { ProgrammingRequestService } from '../../service/programming-request.service';
import { EstateSearchFormComponent } from '../estate-search-form/estate-search-form.component';
import { IEstateSearch } from '../estate-search-form/estate-search.interface';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-perform-programming-form',
  templateUrl: './perform-programming-form.component.html',
  styles: [],
})
export class PerformProgrammingFormComponent
  extends BasePage
  implements OnInit
{
  settingUser = {
    ...this.settings,
    actions: {
      columnTitle: 'Acciones',
      position: 'right',
      delete: false,
    },
    columns: USER_COLUMNS,
  };

  settingsTransportableGoods = {
    ...this.settings,
    actions: {
      ...this.settings.actions,
      delete: false,
      edit: false,
      columnTitle: 'Acciones',
      position: 'right',
    },
    delete: {
      ...this.settings.delete,
      confirmDelete: true,
    },
    columns: ESTATE_COLUMNS,
  };

  settingGuardGoods = {
    ...this.settings,
    actions: {
      edit: false,
      delete: false,
      columnTitle: 'Acciones',
      position: 'right',
    },
    edit: {
      editButtonContent: '<i class="fa fa-eye"></i>',
    },
    columns: ESTATE_COLUMNS,
  };

  settingWarehouseGoods = {
    ...this.settings,
    actions: {
      edit: false,
      delete: false,
      columnTitle: 'Acciones',
      position: 'right',
    },
    edit: {
      editButtonContent: '<i class="fa fa-eye"></i>',
    },
    columns: ESTATE_COLUMNS,
  };

  estates: any[] = [];
  estatesList: LocalDataSource = new LocalDataSource();
  goodSelect: any[] = [];
  goodsTranportables: any[] = [];
  goodsGuards: any[] = [];
  goodsWarehouse: any[] = [];

  usersData: any[] = [];
  dataSearch: IEstateSearch;
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
  headingWarehouse: string = `Almacén SAT(0)`;
  idAuthority: string = '';
  idState: string = '';
  idTrans: number = 0;
  idStation: number = 0;
  idTypeRelevant: number = 0;
  showForm: boolean = true;
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
  paramsGuardGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsGuardGoods: number = 0;
  paramsWarehouseGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsWarehouseGoods: number = 0;
  paramsUsers = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsUsers: number = 0;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private programmingRequestService: ProgrammingRequestService,
    private programmingGoodService: ProgrammingGoodService,
    private stationService: StationService,
    private regionalDelegationService: RegionalDelegationService,
    private stateService: DelegationStateService,
    private transferentService: TransferenteService,
    private typeRelevantService: TypeRelevantService,
    private warehouseService: WarehouseService,
    private authorityService: AuthorityService,
    private goodsQueryService: GoodsQueryService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: false,
      columns: ESTATE_COLUMNS,
      selectMode: 'multi',
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getRegionalDelegationSelect(new ListParams());
    this.getTypeRelevantSelect(new ListParams());
  }

  prepareForm() {
    const fiveDays = addDays(new Date(), 5);
    this.performForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      city: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      startDate: [null, [Validators.required, minDate(new Date())]],
      endDate: [null, [Validators.required, minDate(new Date(fiveDays))]],
      observation: [null, [Validators.pattern(STRING_PATTERN)]],
      regionalDelegation: [null, [Validators.required]],
      state: [null, [Validators.required]],
      transferent: [null, [Validators.required]],
      station: [null, [Validators.required]],
      authority: [null, [Validators.required]],
      typeRelevant: [null, [Validators.required]],
      warehouse: [null],
      userId: [null],
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
    }
  }

  showWarehouse(warehouse: IWarehouse) {
    this.warehouseUbication = warehouse.ubication;
    this.showUbication = true;
  }

  openForm(userData?: any) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      userData,
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const rejectionComment = this.modalService.show(UserFormComponent, config);
  }

  listUsers() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          this.usersData = userData;
        }
      },
    };

    const searchUser = this.modalService.show(SearchUserFormComponent, config);
  }

  newWarehouse() {
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
  }

  estateSearch() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      userData,
      callback: (data: IEstateSearch) => {
        if (data) {
          this.dataSearch = data;
          this.initializeParamsTrans();
        }
      },
    };

    const estateSearch = this.modalService.show(
      EstateSearchFormComponent,
      config
    );
  }

  showGoods() {
    this.initializeParamsTrans();
  }

  getRegionalDelegationSelect(params?: ListParams) {
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
      this.showSelectTransferent = true;
      const type = 'TE';
      const state = Number(this.idState);
      this.transferentService
        .getByTypeUserIdState(params, state, type)
        .subscribe(data => {
          this.transferences = new DefaultSelect(data.data, data.count);
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

  initializeParamsTrans() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getProgGoods());
  }

  getProgGoods() {
    const filterColumns: Object = {
      /*regionalDelegation: Number(this.regionalDelegationUser.id),
      transferent: Number(this.idTrans), */
    };
    this.loadingGoods = true;
    this.goodsQueryService
      .postGoodsProgramming(this.params.getValue(), filterColumns)
      .subscribe({
        next: response => {
          this.estatesList.load(response.data);
          this.totalItems = response.count;
          this.loadingGoods = false;
        },
        error: error => (this.loadingGoods = false),
      });
  }

  goodsSelect(event: any) {
    this.goodSelect = event.selected;
  }

  sendTransportable() {
    if (this.goodSelect.length == 0) {
      this.alert('warning', 'Error', 'Se necesita tener un bien seleccionado');
    } else {
      this.headingTransportable = `Transportables(${this.goodSelect.length})`;
      this.goodsTranportables = this.goodSelect;
    }
  }

  sendGuard() {
    if (this.goodSelect.length == 0) {
      this.alert('warning', 'Error', 'Se necesita tener un bien seleccionado');
    } else {
      this.headingGuard = `Resguardo(${this.goodSelect.length})`;
      this.goodsGuards = this.goodSelect;
    }
  }

  sendWarehouse() {
    if (this.goodSelect.length == 0) {
      this.alert('warning', 'Error', 'Se necesita tener un bien seleccionado');
    } else {
      this.headingWarehouse = `Almacén SAT(${this.goodSelect.length})`;
      this.goodsWarehouse = this.goodSelect;
    }
  }

  showGood() {}

  removeGood(event: any) {
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Eliminado', '');
  }

  onDeleteConfirm(event: any) {
    console.log('Evento', event);
    event.confirm.resolve();
    this.onLoadToast('success', 'Elemento Eliminado', '');
  }

  confirm() {}

  delete(user: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecuta el servicio//
        this.onLoadToast('success', 'Usuario eliminado correctamente', '');
      }
    });
  }

  close() {
    this.modalService.hide();
  }
}
