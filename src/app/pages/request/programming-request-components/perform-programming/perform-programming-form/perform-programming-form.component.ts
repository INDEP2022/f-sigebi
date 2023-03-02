import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import {
  IGoodProgramming,
  IGoodProgrammingSelect,
} from 'src/app/core/models/good-programming/good-programming';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DelegationStateService } from 'src/app/core/services/catalogs/delegation-state.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
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
  estatesList: LocalDataSource = new LocalDataSource();
  goodSelect: IGoodProgrammingSelect[] = [];
  goodsTranportables: LocalDataSource = new LocalDataSource();
  goodsGuards: LocalDataSource = new LocalDataSource();
  goodsWarehouse: LocalDataSource = new LocalDataSource();
  usersToProgramming: LocalDataSource = new LocalDataSource();
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
  paramsGuardGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsGuardGoods: number = 0;
  paramsWarehouseGoods = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsWarehouseGoods: number = 0;
  paramsUsers = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsUsers: number = 0;
  loadGoods: boolean = false;
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
    private goodService: GoodService
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
          position: 'right',
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
    this.prepareForm();
    this.getRegionalDelegationSelect(new ListParams());
    this.getTypeRelevantSelect(new ListParams());
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
      console.log('fdgfdg', this.goodSelect);
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
        [Validators.required, Validators.pattern(EMAIL_PATTERN)],
      ],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      city: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      startDate: [null, [Validators.required, minDate(new Date())]],
      endDate: [null, [Validators.required, minDate(new Date(fiveDays))]],
      observation: [null, [Validators.pattern(STRING_PATTERN)]],
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
      callback: (data: IUser, create: boolean) => {
        if (data && create) {
          this.usersToProgramming.getElements().then(item => {
            item.push(data);
            this.usersToProgramming.load(item);
          });
        } else {
          this.usersToProgramming.find(userData).then((item: IUser) => {
            this.usersToProgramming.update(item, data);
          });
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
        'Para crear un almacén necesitas seleccionar una delegación regional'
      );
    }
  }

  listUsers() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    const usersSelected = this.usersToProgramming;
    config.initialState = {
      usersSelected,
      callback: (data: any) => {
        if (data && this.usersToProgramming.count() == 0) {
          this.usersToProgramming.load(data);
          this.onLoadToast(
            'success',
            'Correcto',
            'Úsuario(s) agregado(s) correctamente'
          );
        } else if (data && this.usersToProgramming.count() >= 0) {
          this.concatUsers(data);
        }
      },
    };

    const searchUser = this.modalService.show(SearchUserFormComponent, config);
  }

  concatUsers(users: IUser[]) {
    this.usersToProgramming.getElements().then(items => {
      users.map(item => {
        items.push(item);
        this.usersToProgramming.load(items);
        this.onLoadToast(
          'success',
          'Correcto',
          'Úsuario(s) agregado(s) correctamente'
        );
      });
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
      const type = 'TLP';
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

  getProgGoods() {
    this.loadingGoods = true;
    const filterColumns: Object = {
      regionalDelegation: Number(this.regionalDelegationUser.id),
      transferent: Number(this.idTrans),
      relevantType: Number(this.idTypeRelevant),
      statusGood: 'APROBADO',
    };

    this.goodsQueryService
      .postGoodsProgramming(this.params.getValue(), filterColumns)
      .subscribe({
        next: response => {
          const filterData = response.data.map(items => {
            if (items.physicalState == 1) {
              items.physicalState = 'BUENO';
              return items;
            } else if (items.physicalState == 2) {
              items.physicalState = 'MALO';
              return items;
            }
          });

          console.log(filterData);
          this.estatesList.load(filterData);
          this.totalItems = response.count;
          this.loadingGoods = false;
        },
        error: error => (this.loadingGoods = false),
      });
    /*if (!this.dataSearch) {
      console.log('fddd', filterColumns);
    } else {
      console.log('filtros', this.dataSearch);
      const filterColumns: Object = {
        regionalDelegation: Number(this.regionalDelegationUser.id),
        transferent: Number(this.idTrans),
        station: Number(this.idStation),
        authority: Number(this.idAuthority),
        relevantType: Number(this.idTypeRelevant),
        stateKey: Number(this.dataSearch.state),
        municipality: 'Municipio',
        locality: 'CVE Localidad',
        aliasWarehouse: 'Alias Almacen',
      };

      this.goodsQueryService
        .postGoodsProgramming(this.params.getValue(), filterColumns)
        .subscribe({
          next: response => {
            console.log(response.data);
            const filterData = response.data.map(items => {
              if (items.physicalState == 1) {
                items.physicalState = 'BUENO';
                return items;
              } else if (items.physicalState == 2) {
                items.physicalState = 'MALO';
                return items;
              }
            });

            this.estatesList.load(filterData);
            this.totalItems = response.count;
            this.loadingGoods = false;
            this.loadGoods = true;
          },
          error: error => (this.loadingGoods = false),
        });
    } */
  }

  sendTransportable() {
    if (this.goodSelect.length) {
      this.goodSelect.map((item: any) => {
        const formData: Object = {
          programmingId: this.idProgramming,
          creationUser: 'aigebi admon',
          creationDate: new Date(),
          modificationUser: 'aigebi admon',
          modificationDate: new Date(),
          goodId: item.googId,
          version: '1',
          status: 'EN_TRANSPORTABLE',
        };
      });

      this.getGoodsProgTrans();
      this.changeStatusGoodTrans();
      /*if (this.goodsTranportables.count() == 0) {
        this.goodsTranportables.load(this.goodSelect);
        this.headingTransportable = `Transportables(${this.goodSelect.length})`;
        this.onLoadToast(
          'success',
          'Correcto',
          'Bienes movidos a transportable'
        );
        this.removeGoodsSelected(this.goodSelect);
      } else {
        this.goodsTranportables.getElements().then(data => {
          this.goodSelect.map(items => {
            data.push(items);
            this.goodsTranportables.load(data);
            this.headingTransportable = `Transportables(${this.goodsTranportables.count()})`;
            this.onLoadToast(
              'success',
              'Correcto',
              'Bienes movidos a transportable'
            );
            this.removeGoodsSelected(this.goodSelect);
          });
        });
      } */
    } else {
      this.alert('warning', 'Error', 'Se necesita tener un bien seleccionado');
    }
  }

  /*------------Change status good ------------------*/
  changeStatusGoodTrans() {
    console.log('cambiar status good', this.goodSelect);
    this.goodSelect.map((item: any) => {
      console.log('goodNumber', item.goodNumber);
      console.log('idgood', item.googId);
      const formData: Object = {
        id: Number(item.goodNumber),
        goodId: item.googId,
        programmationStatus: 'EN_TRANSPORTABLE',
      };
      console.log('data', formData);
    });
  }

  /*------------Show goods programming ---------------*/
  getGoodsProgTrans() {
    this.paramsTransportableGoods.getValue()['filter.programmingId'] =
      this.idProgramming;
    this.programmingService
      .getGoodsProgramming(this.paramsTransportableGoods.getValue())
      .subscribe(data => {
        this.goodsTranportables.load(data.data);
        this.getGoodsTransportable(data.data);
      });
  }

  /*-------------filter goods by transferent--------------*/

  getGoodsTransportable(data: IGoodProgramming[]) {
    const filter = data.filter(item => {
      return item.status == 'EN_TRANSPORTABLE';
    });

    const infoGood = filter.map(goods => {
      return goods.view;
    });
    this.goodsTranportables.load(infoGood);
    this.headingTransportable = `Transportable(${this.goodsTranportables.count()})`;
    this.removeGoodsProgTrans();
  }

  /*-------------Remove goods tranportable in show goods programming------------------*/
  removeGoodsProgTrans() {
    console.log('goodsAddressView', this.estatesList);
    console.log('goods transportables', this.goodsTranportables);
  }

  sendGuard() {
    if (this.goodSelect.length) {
      let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
      const idTransferent = this.idTrans;
      config.initialState = {
        idTransferent,
        callback: (data: any) => {
          if (data) this.addGoodsGuards();
        },
      };

      this.modalService.show(WarehouseSelectFormComponent, config);
    } else {
      this.alert('warning', 'Error', 'Se necesita tener un bien seleccionado');
    }
  }

  addGoodsGuards() {
    if (this.goodsGuards.count() == 0) {
      this.headingGuard = `Resguardo(${this.goodSelect.length})`;
      this.goodsGuards.load(this.goodSelect);
      this.onLoadToast('success', 'Correcto', 'Bien movido a resguardo');
      this.removeGoodsSelected(this.goodSelect);
    } else {
      this.goodsGuards.getElements().then(data => {
        this.goodSelect.map(items => {
          data.push(items);
          this.goodsGuards.load(data);
          this.headingGuard = `Resguardo(${this.goodsGuards.count()})`;
          this.onLoadToast('success', 'Correcto', 'Bienes movidos a Resguardo');
          this.removeGoodsSelected(this.goodSelect);
        });
      });
    }
  }

  sendWarehouse() {
    if (this.goodSelect.length) {
      let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
      const idTransferent = this.idTrans;
      config.initialState = {
        idTransferent,
        callback: (data: any) => {
          if (data) this.addGoodsWarehouse();
        },
      };

      this.modalService.show(WarehouseSelectFormComponent, config);
    } else {
      this.alert('warning', 'Error', 'Se necesita tener un bien seleccionado');
    }
  }

  addGoodsWarehouse() {
    if (this.goodsWarehouse.count() == 0) {
      this.headingWarehouse = `Almacén SAT(${this.goodSelect.length})`;
      this.goodsWarehouse.load(this.goodSelect);
      this.onLoadToast('success', 'Correcto', 'Bien movido a almacén SAT');
      this.removeGoodsSelected(this.goodSelect);
    } else {
      this.goodsWarehouse.getElements().then(data => {
        this.goodSelect.map(items => {
          data.push(items);
          this.goodsWarehouse.load(data);
          this.headingWarehouse = `Almacén SAT(${this.goodsWarehouse.count()})`;
          this.onLoadToast(
            'success',
            'Correcto',
            'Bienes movidos a almacén SAT'
          );
          this.removeGoodsSelected(this.goodSelect);
        });
      });
    }
  }

  removeGoodsSelected(items: IGoodProgrammingSelect[]) {
    this.totalItems = this.totalItems - items.length;
    items.map(items => {
      this.estatesList.remove(items).then(data => {});
    });
  }

  showGood(item: IGoodProgrammingSelect) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      item,
      callback: () => {},
    };
    this.modalService.show(DetailGoodProgrammingFormComponent, config);
  }

  removeGoodTrans(item: IGoodProgrammingSelect) {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea remover el bien?'
    ).then(question => {
      if (question.isConfirmed) {
        this.goodsTranportables.remove(item);
        this.estatesList.getElements().then(items => {
          items.push(item);
          this.estatesList.load(items);
          this.headingTransportable = `Transportables(${this.goodsTranportables.count()})`;
          this.totalItems = this.totalItems + 1;
          this.onLoadToast('success', 'Bien removido correctamente', '');
        });
      }
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
        this.usersToProgramming.remove(user).then(() => {
          this.usersToProgramming.refresh();
          this.onLoadToast('success', 'Usuario eliminado correctamente', '');
        });
      }
    });
  }

  close() {
    this.modalService.hide();
  }
}
/*status aprobado
dr
trans
type

programaciones bienes */
