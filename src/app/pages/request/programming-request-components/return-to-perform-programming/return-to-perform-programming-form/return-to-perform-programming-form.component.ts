import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { addDays } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, takeUntil, throwError } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { minDate } from 'src/app/common/validations/date.validators';
import { ILocality } from 'src/app/core/models/catalogs/locality.model';
import { IMunicipality } from 'src/app/core/models/catalogs/municipality.model';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { IUser } from 'src/app/core/models/catalogs/user.model';
import { IWarehouse } from 'src/app/core/models/catalogs/warehouse.model';
import {
  IGoodProgramming,
  IGoodProgrammingSelect,
} from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { LocalityService } from 'src/app/core/services/catalogs/locality.service';
import { MunicipalityService } from 'src/app/core/services/catalogs/municipality.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
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
import { ESTATE_COLUMNS } from '../../acept-programming/columns/estate-columns';
import { IEstateSearch } from '../../perform-programming/estate-search-form/estate-search.interface';
import {
  settingGuard,
  settingTransGoods,
  SettingUserTable,
  settingWarehouse,
} from '../../perform-programming/perform-programming-form/settings-tables';
import { UserFormComponent } from '../../perform-programming/user-form/user-form.component';
import { WarehouseSelectFormComponent } from '../../perform-programming/warehouse-select-form/warehouse-select-form.component';
import { SearchUserFormComponent } from '../../schedule-reception/search-user-form/search-user-form.component';
import { DetailGoodProgrammingFormComponent } from '../../shared-components-programming/detail-good-programming-form/detail-good-programming-form.component';

@Component({
  selector: 'app-return-to-perform-programming-form',
  templateUrl: './return-to-perform-programming-form.component.html',
  styles: [],
})
export class ReturnToPerformProgrammingFormComponent
  extends BasePage
  implements OnInit
{
  goodsInfoTrans: any[] = [];
  goodsInfoGuard: any[] = [];
  goodsInfoWarehouse: any[] = [];
  paramsGoodsProg = new BehaviorSubject<ListParams>(new ListParams());
  usersToProgramming: LocalDataSource = new LocalDataSource();
  estatesList: LocalDataSource = new LocalDataSource();
  goodsTranportables: LocalDataSource = new LocalDataSource();
  goodsGuards: LocalDataSource = new LocalDataSource();
  goodsWarehouse: LocalDataSource = new LocalDataSource();
  goodSelect: IGoodProgrammingSelect[] = [];
  ubicationWarehouse: string = '';
  idStateOfRepublic: string = '';
  idMunicipality: string = '';
  programming: Iprogramming;
  idTransferent: any;
  idStation: any;
  idAuthority: any;
  idTypeRelevant: any;
  idRegionalDelegation: any;
  warehouse = new DefaultSelect<IWarehouse>();
  form: FormGroup = new FormGroup({});
  formGoods: FormGroup = new FormGroup({});
  settingUser = { ...this.settings, ...SettingUserTable };
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
  paramsAuthority = new BehaviorSubject<ListParams>(new ListParams());
  programmingId: number = 0;
  totalItems: number = 0;
  totalItemsUsers: number = 0;
  idTrans: number = 0;
  dataSearch: IEstateSearch;
  headingTransportable: string = `Transportables(0)`;
  headingGuard: string = `Resguardo(0)`;
  headingWarehouse: string = `Almacén SAT(0)`;

  akaWarehouse = new DefaultSelect<IWarehouse>();
  states = new DefaultSelect<IStateOfRepublic>();
  municipalities = new DefaultSelect<IMunicipality>();
  localities = new DefaultSelect<ILocality>();
  loadingGoods: boolean = false;

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
    private activatedRoute: ActivatedRoute,
    private programmingService: ProgrammingRequestService,
    private regionalDelegationService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private stationService: StationService,
    private authorityService: AuthorityService,
    private typeRelevantService: TypeRelevantService,
    private warehouseService: WarehouseService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private stateOfRepublicService: StateOfRepublicService,
    private municipalityService: MunicipalityService,
    private localityService: LocalityService,
    private goodsQueryService: GoodsQueryService,
    private goodService: GoodService
  ) {
    super();
    this.programmingId = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;

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

  ngOnInit(): void {
    this.prepareForm();
    this.prepareFormGoods();
    this.getProgramming();
    this.getAkaWarehouseSelect(new ListParams());
    this.getStateSelect(new ListParams());

    this.paramsGoods
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsProgramming());
  }

  getProgramming() {
    this.programmingService
      .getProgrammingId(this.programmingId)
      .subscribe(data => {
        this.programming = data;
        this.idRegionalDelegation = data.regionalDelegationNumber;
        this.idTransferent = data.tranferId;
        this.idStation = data.stationId;
        this.idAuthority = data.autorityId;
        this.idTypeRelevant = data.typeRelevantId;
        this.showDataProgramming();
        this.getRegionalDelegation();
        this.gettransferent();
        this.getStation();
        this.getAuthority();
        this.getTypeRelevant();
        this.getWarehouse();
        this.getUsersProgramming();
      });
  }

  prepareForm() {
    const fiveDays = addDays(new Date(), 5);
    this.form = this.fb.group({
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      startDate: [null, [Validators.required, minDate(new Date())]],
      endDate: [null, [Validators.required, minDate(new Date(fiveDays))]],
      email: [null, [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      city: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      observation: [null, [Validators.pattern(STRING_PATTERN)]],
      warehouse: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  prepareFormGoods() {
    this.formGoods = this.fb.group({
      warehouse: [null],
      state: [null],
      municipality: [null],
      locality: [null],
      cp: [null],
    });
  }

  showDataProgramming() {
    this.form.get('startDate').setValue(this.programming.startDate);
    this.form.get('endDate').setValue(this.programming.endDate);
    this.form.get('email').setValue(this.programming.emailTransfer);
    this.form.get('city').setValue(this.programming.city);
    this.form.get('observation').setValue(this.programming.observation);
    this.form.get('address').setValue(this.programming.address);
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
    this.paramsAuthority.getValue()['filter.idAuthority'] =
      this.programming.autorityId;
    this.paramsAuthority.getValue()['filter.idTransferer'] = this.idTransferent;
    this.paramsAuthority.getValue()['filter.idStation'] = this.idStation;

    this.authorityService.getAll(this.paramsAuthority.getValue()).subscribe({
      next: response => {
        let authority = response.data.find(res => {
          return res;
        });
        this.programming.autorityId = authority.authorityName;
      },
    });
  }

  getTypeRelevant() {
    return this.typeRelevantService
      .getById(this.programming.typeRelevantId)
      .subscribe(data => {
        this.programming.typeRelevantId = data.description;
      });
  }

  getWarehouse() {
    this.warehouseService.getById(this.programming.storeId).subscribe(data => {
      this.form.get('warehouse').setValue(data.description);
      this.ubicationWarehouse = data.description;
      this.getWarehouseSelect(new ListParams());
    });
  }

  getWarehouseSelect(params: ListParams) {
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

  warehouseSelect(item: IWarehouse) {
    this.ubicationWarehouse = item.ubication;
  }

  getUsersProgramming() {
    this.loading = true;
    this.params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getUsersProgramming(this.params.getValue())
      .subscribe({
        next: response => {
          const usersData = response.data.map(items => {
            items.userCharge = items.charge.description;
            return items;
          });

          this.usersToProgramming.load(usersData);
          this.totalItems = this.usersToProgramming.count();
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
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

  openForm(userData?: any) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    const idProgramming = this.programmingId;
    config.initialState = {
      userData,
      idProgramming,
      callback: (data: boolean, create: boolean) => {
        if (data && create) {
          this.onLoadToast('success', 'Usuario creado correctamente', '');
          this.getUsersProgramming();
        } else if (data) {
          this.onLoadToast('success', 'Usuario modificado correctamente', '');
          this.getUsersProgramming();
        }
      },
    };

    const rejectionComment = this.modalService.show(UserFormComponent, config);
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
  /* select goods part */
  getAkaWarehouseSelect(params: ListParams) {
    this.warehouseService.getAll(params).subscribe(data => {
      this.akaWarehouse = new DefaultSelect(data.data, data.count);
    });
  }

  getStateSelect(params: ListParams) {
    if (params.text) {
      /*this.stateOfRepublicService.search(params).subscribe(data => {
        this.states = new DefaultSelect(data.data, data.count);
      }); */
    } else {
      this.stateOfRepublicService.getAll(params).subscribe(data => {
        this.states = new DefaultSelect(data.data, data.count);
      });
    }
  }

  stateSelect(item: IStateOfRepublic) {
    this.idStateOfRepublic = item.id;
    this.getMunicipalitySelect(new ListParams());
  }

  getMunicipalitySelect(params: ListParams) {
    params['stateKey'] = this.idStateOfRepublic;
    this.municipalityService.getAll(params).subscribe(data => {
      this.municipalities = new DefaultSelect(data.data, data.count);
    });
  }

  municipalitySelect(item: IMunicipality) {
    this.idMunicipality = item.idMunicipality;
    this.getLocalitySelect(new ListParams());
  }

  getLocalitySelect(params: ListParams) {
    params['stateKey'] = this.idStateOfRepublic;
    params['municipalityId'] = this.idMunicipality;
    this.localityService.getAll(params).subscribe(data => {
      this.localities = new DefaultSelect(data.data, data.count);
    });
  }

  searchGoods() {
    this.loadingGoods = true;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getProgGoods());
  }

  getProgGoods() {
    this.loadingGoods = true;
    const filterColumns: Object = {
      regionalDelegation: Number(this.idRegionalDelegation),
      transferent: Number(this.idTransferent),
      relevantType: Number(this.idTypeRelevant),
      statusGood: 'APROBADO',
    };

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
          console.log(goodsFilter);
          this.filterGoodsProgramming(goodsFilter);
          this.loadingGoods = false;
        },
        error: error => (this.loadingGoods = false),
      });
  }

  filterGoodsProgramming(goods: any[]) {
    this.paramsGoodsProg.getValue()['filter.programmingId'] =
      this.programmingId;
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
    this.totalItems = goodsFilter.count;
  }

  clear() {
    this.formGoods.reset();
  }
  /*----------show goods transportable, guard and warehouse-------------*/

  getGoodsProgramming() {
    this.paramsGoods.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getGoodsProgramming(this.paramsGoods.getValue())
      .subscribe(data => {
        this.getGoodsTransportable(data.data);
        this.getGoodsGuards(data.data);
        this.getGoodsWarehouse(data.data);
      });
  }

  /*-----------------Goods in tranportable---------------------------*/

  getGoodsTransportable(data: IGoodProgramming[]) {
    const filter = data.filter(item => {
      return item.status == 'EN_TRANSPORTABLE';
    });

    filter.map(items => {
      this.goodService.getById(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén //

          this.goodsInfoTrans.push(response);

          this.goodsTranportables.load(this.goodsInfoTrans);
          this.headingTransportable = `Transportables(${this.goodsTranportables.count()})`;
        },
      });
    });
  }

  /*------------------ Goods in guard ---------------------------*/
  getGoodsGuards(data: IGoodProgramming[]) {
    const filter = data.filter(item => {
      return item.status == 'EN_RESGUARDO';
    });

    filter.map(items => {
      this.goodService.getById(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén //

          this.goodsInfoGuard.push(response);

          this.goodsGuards.load(this.goodsInfoGuard);
          this.headingGuard = `Resguardo(${this.goodsGuards.count()})`;
        },
      });
    });
  }

  /*-----------------Goods in warehouse---------------------------*/
  getGoodsWarehouse(data: IGoodProgramming[]) {
    const filter = data.filter(item => {
      return item.status == 'EN_ALMACEN';
    });

    filter.map(items => {
      this.goodService.getById(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén //

          this.goodsInfoWarehouse.push(response);

          this.goodsWarehouse.load(this.goodsInfoWarehouse);
          this.headingWarehouse = `Almacén(${this.goodsWarehouse.count()})`;
        },
      });
    });
  }

  /*--------selected Goods ------------*/
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

  sendTransportable() {
    if (this.goodSelect.length) {
      console.log('Estos son los que se mandan', this.goodSelect);

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

  removeGoodsSelected(items: IGoodProgrammingSelect[]) {
    this.totalItems = this.totalItems - items.length;
    items.map(items => {
      this.estatesList.remove(items).then(data => {});
    });
    this.goodSelect = [];
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
}
