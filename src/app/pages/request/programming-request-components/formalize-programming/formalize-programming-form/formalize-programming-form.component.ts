import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodProgramming } from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IGood } from 'src/app/core/models/good/good.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ESTATE_COLUMNS_VIEW } from '../../acept-programming/columns/estate-columns';
import {
  RECEIPT_COLUMNS,
  RECEIPT_GUARD_COLUMNS,
} from '../../execute-reception/execute-reception-form/columns/minute-columns';
import { TRANSPORTABLE_GOODS_FORMALIZE } from '../../execute-reception/execute-reception-form/columns/transportable-goods-columns';
import { MINUTES_COLUMNS } from '../columns/minutes-columns';

@Component({
  selector: 'app-formalize-programming-form',
  templateUrl: './formalize-programming-form.component.html',
  styles: [],
})
export class FormalizeProgrammingFormComponent
  extends BasePage
  implements OnInit
{
  isDropup = true;
  goods: any[] = [];
  // receiptGuards: IReception[] = [];
  // goodsGuard: IGood[] = [];
  // goodsRepro: IGood[] = [];
  // goodsWareh: IGood[] = [];
  // goodsSelect: IGood[] = [];
  // stateConservation: IStateConservation[] = [];
  // statusPhysical: IPhysicalStatus[] = [];
  // measureUnits: IMeasureUnit[] = [];
  executeForm: FormGroup = new FormGroup({});
  receptionForm: FormGroup = new FormGroup({});
  goodsGuardForm: FormGroup = new FormGroup({});
  goodsWarehouseForm: FormGroup = new FormGroup({});
  goodsReprogForm: FormGroup = new FormGroup({});
  goodsCancelationForm: FormGroup = new FormGroup({});
  buildForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsgeneric = new BehaviorSubject<ListParams>(new ListParams());
  paramsReceipts = new BehaviorSubject<ListParams>(new ListParams());
  paramsProceeding = new BehaviorSubject<ListParams>(new ListParams());
  paramsAuthority = new BehaviorSubject<ListParams>(new ListParams());
  paramsStation = new BehaviorSubject<ListParams>(new ListParams());
  paramsReception = new BehaviorSubject<ListParams>(new ListParams());
  paramsGuard = new BehaviorSubject<ListParams>(new ListParams());
  paramsGoodsWarehouse = new BehaviorSubject<ListParams>(new ListParams());
  paramsReprog = new BehaviorSubject<ListParams>(new ListParams());
  paramsCanc = new BehaviorSubject<ListParams>(new ListParams());
  //goodsWarehouse: LocalDataSource = new LocalDataSource();
  paramsTransportableGoods = new BehaviorSubject<ListParams>(new ListParams());

  nameWarehouse: string = '';
  ubicationWarehouse: string = '';
  totalItemsReception: number = 0;
  totalItemsGuard: number = 0;
  totalItemsWarehouse: number = 0;
  totalItemsReceipt: number = 0;
  totalItemsReprog: number = 0;
  totalItemsCanc: number = 0;
  totalItemsProceedings: number = 0;
  selectGood: IGood[] = [];
  selectGoodGuard: IGood[] = [];
  goodIdSelect: any;
  goodIdSelectGuard: string | number;
  programmingId: number = 0;
  idTransferent: any;
  idRegDelegation: any;
  idTypeRelevat: any;
  headingGuard: string = `Resguardo(0)`;
  headingWarehouse: string = `Almacén INDEP(0)`;
  headingReprogramation: string = `Reprogramación(0)`;
  headingCancelation: string = `Cancelación(0)`;
  idStation: any;
  transferentName: string = '';
  stationName: string = '';
  authorityName: string = '';
  typeRelevantName: string = '';
  formLoading: boolean = false;
  goodData: IGood;
  settingsGuardGoods = {
    ...this.settings,
    actions: false,
    columns: ESTATE_COLUMNS_VIEW,
  };

  settingsWarehouseGoods = {
    ...this.settings,
    actions: false,
    columns: ESTATE_COLUMNS_VIEW,
  };

  settingsReceipt = {
    ...this.settings,
    actions: false,
    columns: RECEIPT_COLUMNS,
  };

  settingsReprog = {
    ...this.settings,
    actions: {
      columnTitle: 'Generar recibo',
      position: 'right',
      delete: false,
    },
    columns: ESTATE_COLUMNS_VIEW,
    edit: {
      editButtonContent: '<i class="fa fa-file text-primary mx-2"></i>',
    },
  };

  settingsCancelation = {
    ...this.settings,
    actions: {
      columnTitle: 'Generar recibo',
      position: 'right',
      delete: false,
    },
    columns: ESTATE_COLUMNS_VIEW,
    edit: {
      editButtonContent: '<i class="fa fa-file text-primary mx-2"></i>',
    },
  };

  settingsReceiptsGuards = {
    ...this.settings,
    actions: {
      delete: true,
      edit: true,
      columnTitle: 'Generar recibo resguardo',
      position: 'right',
    },

    edit: {
      editButtonContent:
        '<i class="fa fa-book" text-warning aria-hidden="true"></i> Ver bienes',
    },

    delete: {
      deleteButtonContent:
        '<i class="fa fa-file ml-4" text-primary aria-hidden="true"></i> Generar recibo',
    },

    columns: RECEIPT_GUARD_COLUMNS,
  };

  usersData: LocalDataSource = new LocalDataSource();
  //Cambiar a modelos//
  guardGoods: LocalDataSource = new LocalDataSource();

  receipts: LocalDataSource = new LocalDataSource();
  proceedings: LocalDataSource = new LocalDataSource();
  search: FormControl = new FormControl({});
  programming: Iprogramming;

  settingsMinutes = {
    ...this.settings,
    columns: MINUTES_COLUMNS,
    edit: { editButtonContent: '<i class="fa fa-book text-warning mx-2"></i>' },
    actions: { columnTitle: 'Generar / cerrar acta', position: 'right' },
  };

  settingsRecepGoods = {
    ...this.settings,
    columns: TRANSPORTABLE_GOODS_FORMALIZE,
    actions: false,
  };
  nameTransferent: string = '';
  nameStation: string = '';
  goodsRecepcion: LocalDataSource = new LocalDataSource();
  goodsGuards: LocalDataSource = new LocalDataSource();
  goodsWarehouse: LocalDataSource = new LocalDataSource();
  goodsReprog: LocalDataSource = new LocalDataSource();
  goodsCancel: LocalDataSource = new LocalDataSource();
  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private programmingService: ProgrammingRequestService,
    private regionalDelegationService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private stationService: StationService,
    private authorityService: AuthorityService,
    private typeRelevantService: TypeRelevantService,
    private warehouseService: WarehouseService,
    private fb: FormBuilder,
    private goodService: GoodService,
    private programmingGoodService: ProgrammingGoodService,
    private receptionGoodService: ReceptionGoodService,
    private proceedingService: ProceedingsService,
    // private router: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.settings.columns = TRANSPORTABLE_GOODS_FORMALIZE;

    // this.settings = {
    //   ...this.settings,
    //   actions: false,
    //   columns: USER_COLUMNS_SHOW,
    // };
    this.programmingId = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    this.formLoading = true;
    this.getProgrammingData();

    this.paramsReceipts
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getReceipts());

    this.paramsProceeding
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getProccedings());

    /*
    this.getInfoGoodsProgramming();
    this.router.navigate(
      [
        '/pages/request/programming-request/formalize-programming',
        this.programmingId,
      ],
      { queryParams: { programingId: this.programmingId } }
    ); */
  }

  getReceipts() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    this.receptionGoodService.getReceipt(params.getValue()).subscribe({
      next: response => {
        console.log('recibos', response);
        this.receipts.load(response.data);
      },
      error: error => {
        this.receipts = new LocalDataSource();
      },
    });
  }

  getProccedings() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.idPrograming'] = this.programmingId;
    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: response => {
        console.log('response', response);
        this.proceedings.load(response.data);
        this.totalItemsProceedings = response.count;
      },
      error: error => {
        console.log('error actas', error);
      },
    });
  }

  getProgrammingData() {
    this.programmingService
      .getProgrammingId(this.programmingId)
      .subscribe(data => {
        this.programming = data;
        this.idRegDelegation = data.regionalDelegationNumber;
        this.idTypeRelevat = data.typeRelevantId;
        this.idTransferent = data.tranferId;
        this.idStation = data.stationId;
        this.getRegionalDelegation(data);
        this.getTransferent(data);
        this.getStation(data);
        this.getAuthority();
        this.getTypeRelevant();
        this.getwarehouse();
        //this.getUsersProgramming();
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getInfoGoodsProgramming());
      });
  }

  getRegionalDelegation(data: Iprogramming) {
    this.regionalDelegationService
      .getById(data.regionalDelegationNumber)
      .subscribe(data => {
        this.programming.regionalDelegationName = data.description;
      });
  }
  getTransferent(data: Iprogramming) {
    this.transferentService.getById(data.tranferId).subscribe(data => {
      this.transferentName = data.nameTransferent;
    });
  }
  getStation(data: Iprogramming) {
    this.paramsStation.getValue()['filter.id'] = data.stationId;
    this.paramsStation.getValue()['filter.idTransferent'] = data.tranferId;
    this.stationService
      .getAll(this.paramsStation.getValue())
      .subscribe(data => {
        this.stationName = data.data[0].stationName;
      });
  }
  getAuthority() {
    this.paramsAuthority.getValue()['filter.idAuthority'] =
      this.programming.autorityId;
    this.paramsAuthority.getValue()['filter.idTransferer'] = this.idTransferent;

    return this.authorityService
      .getAll(this.paramsAuthority.getValue())
      .subscribe(data => {
        let authority = data.data.find(res => {
          return res;
        });
        this.authorityName = authority.authorityName;
      });
  }

  getTypeRelevant() {
    return this.typeRelevantService
      .getById(this.programming.typeRelevantId)
      .subscribe(data => {
        this.typeRelevantName = data.description;
      });
  }

  getwarehouse() {
    return this.warehouseService
      .getById(this.programming.storeId)
      .subscribe(data => {
        this.nameWarehouse = data.description;
        this.ubicationWarehouse = data.ubication;
        this.formLoading = false;
      });
  }
  /*getUsersProgramming() {
    this.loading = true;
    this.params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getUsersProgramming(this.params.getValue())
      .subscribe({
        next: response => {
          const userData = response.data.map(items => {
            items.userCharge = items.charge?.description;
            return items;
          });

          this.usersData.load(userData);
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  } */

  getInfoGoodsProgramming() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getGoodsProgramming(params.getValue())
      .subscribe(data => {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.filterStatusReception(data.data));

        this.paramsGuard
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.filterStatusGuard(data.data));

        this.paramsGoodsWarehouse
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.filterStatusWarehouse(data.data));

        this.paramsReprog
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.filterStatusReprog(data.data));

        this.filterStatusCancel(data.data);
        /*
         */
      });
  }

  filterStatusReception(data: IGoodProgramming[]) {
    const goodsInfoRecep: any[] = [];
    const goodsRecep = data.filter(items => {
      return items.status == 'EN_RECEPCION';
    });

    goodsRecep.map(items => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén //

          goodsInfoRecep.push(response);
          this.goodsRecepcion.load(goodsInfoRecep);
          this.totalItemsReception = this.goodsRecepcion.count();
          //this.headingGuard = `Resguardo(${this.goodsGuards.count()})`;
        },
      });
    });
  }
  filterStatusGuard(data: IGoodProgramming[]) {
    const goodsInfoGuard: any[] = [];
    const goodsTrans = data.filter(items => {
      return items.status == 'EN_RESGUARDO';
    });

    goodsTrans.map(items => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén //

          goodsInfoGuard.push(response);
          this.goodsGuards.load(goodsInfoGuard);
          this.totalItemsGuard = this.goodsGuards.count();
          this.headingGuard = `Resguardo(${this.goodsGuards.count()})`;
        },
      });
    });
  }

  filterStatusWarehouse(data: IGoodProgramming[]) {
    const goodsInfoWarehouse: any[] = [];
    const goodswarehouse = data.filter(items => {
      return items.status == 'EN_ALMACEN';
    });

    goodswarehouse.map(items => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén //
          goodsInfoWarehouse.push(response);
          this.goodsWarehouse.load(goodsInfoWarehouse);
          this.totalItemsWarehouse = this.goodsWarehouse.count();
          this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.count()})`;
        },
      });
    });
  }

  filterStatusReprog(data: IGoodProgramming[]) {
    const goodsInfoReprog: any[] = [];
    const goodsReprog = data.filter(items => {
      return items.status == 'EN_PROGRAMACION';
    });

    goodsReprog.map(items => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén //
          goodsInfoReprog.push(response);
          this.goodsReprog.load(goodsInfoReprog);
          this.totalItemsReprog = this.goodsReprog.count();
          this.headingReprogramation = `Reprogramación(${this.goodsReprog.count()})`;
        },
      });
    });
  }

  filterStatusCancel(data: IGoodProgramming[]) {
    const goodsInfoCancel: any[] = [];
    const goodsCancel = data.filter(items => {
      return items.status == 'CANCELADO';
    });

    goodsCancel.map(items => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: response => {
          if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén //
          goodsInfoCancel.push(response);
          this.goodsCancel.load(goodsInfoCancel);
          //this.totalItemsWarehouse = this.goodsWarehouse.count();
          this.headingCancelation = `Cancelación(${this.goodsCancel.count()})`;
        },
      });
    });
  }

  close() {}
  confirm() {}
  /*----------Show info goods programming ---------
  
  getInfoGoodsProgramming() {
    // const params = new BehaviorSubject<ListParams>(new ListParams());
    console.log('params2', this.params);
    // this.goodsTransportable.reset();
    this.params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getGoodsProgramming(this.params.getValue())
      .subscribe(data => {
        this.filterStatusTrans(data.data);
        this.filterStatusWarehouse(data.data);
        this.filterStatusGuard(data.data);
        this.filterStatusReprog(data.data);
        this.filterStatusCancelation(data.data);
      });
  }
  formDataTrans(good: IGood[]) {
    console.log('goodsTrans', good);
  }

  filterStatusReception(data: IGoodProgramming[]) {
    const filterData = data.filter(item => {
      return item.status == 'EN_RECEPCION_TMP';
    });
    console.log('data', this.goodService);
    filterData.forEach(items => {
      this.paramsReceipts.getValue()['filter.id'] = items.goodId;
      this.goodService.getAll(this.paramsReceipts.getValue()).subscribe({
        next: response => {
          // this.paramsReceipts.load(response.data);
          // this.goodsReception.clear();
        },

        error: error => {
          // this.paramsReceipts = new LocalDataSource();
        },
      });
    });
  }

  filterStatusTrans(data: IGoodProgramming[]) {
    // console.log('bienes1',data)
    // const goodsTrans = data.filter(items => {
    //   return items.status == 'EN_TRANSPORTABLE';
    // });
    // const goodInfo = goodsTrans.map(good => {
    //   console.log('bienes',data)
    //   this.params.getValue()['filter.id'] = good.goodId;
    //   this.goodService.getAll(this.params.getValue()).subscribe({
    //     next: response => {
    //     this.paramsTransportableGoods.load(response.data);
    //   },
    //         error: error => {
    //     this.paramsTransportableGoods = new LocalDataSource();
    //   },
    // });
    // });
  }

  filterStatusGuard(data: IGoodProgramming[]) {
    console.log('resguardo', data);
    const goodRes = data.filter(items => {
      return items.status == 'EN_RESGUARDO';
    });

    goodRes.map(items => {
      this.params.getValue()['filter.id'] = items.goodId;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: data => {
          data.data.map(response => {
            // this.goodsGuards.clear();
            this.goodData = response;
            // this.headingGuard = `En Resguardo(${this.goodsGuards.length})`;
          });
        },
        error: error => {
          this.formLoading = false;
        },
      });
    });
  }

  filterStatusWarehouse(data: IGoodProgramming[]) {
    const goodWarehouse = data.filter(items => {
      return items.status == 'EN_ALMACEN_TMP';
    });

    goodWarehouse.map(items => {
      this.params.getValue()['filter.id'] = items.goodId;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: data => {
          data.data.map(response => {
            // this.goodsWarehouse.clear();
            this.goodData = response;
            // this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.length})`;
          });
        },
        error: error => {
          this.formLoading = false;
        },
      });
    });
  }

  filterStatusReprog(data: IGoodProgramming[]) {
    const goodsReprog = data.filter(items => {
      return items.status == 'EN_PROGRAMACION_TMP';
    });

    goodsReprog.map(items => {
      this.params.getValue()['filter.id'] = items.goodId;
      this.goodService.getStatusAll(this.params.getValue()).subscribe({
        next: data => {
          data.data.map(response => {
            // this.goodsReprog.clear();
            this.goodData = response;
            // this.headingReprogramation = `Reprogramación(${this.goodsReprog.length})`;
          });
        },
        error: error => {
          this.formLoading = false;
        },
      });
    });
  }

  filterStatusCancelation(data: IGoodProgramming[]) {
    const goodsCancel = data.filter(items => {
      return items.status == 'CANCELADO_TMP';
    });

    goodsCancel.map(items => {
      this.params.getValue()['filter.id'] = items.goodId;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: data => {
          data.data.map(response => {
            // this.goodsCancelation.clear();
            this.goodData = response;
            // this.goodsCancelation;
            this.formLoading = false;
            // this.headingCancelation = `Cancelación(${this.goodsCancelation.length})`;
          });
        },
        error: error => {
          this.formLoading = false;
        },
      });
    });
  }

  goodSelect(good: IGood) {
    this.goodIdSelect = good.id;
    this.selectGood.push(good);
  }
  uploadDocuments() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const uploadDocumentos = this.modalService.show(
      DocumentsListComponent,
      config
    );
  }
  uploadPicture() {
    if (this.goodIdSelect) {
      let config = {
        ...MODAL_CONFIG,
        class: 'modalSizeXL modal-dialog-centered table-responsive',
      };
      config.initialState = {
        good: this.goodIdSelect,
        programming: this.programming,
        callback: (next: boolean) => {
          if (next) {
          }
        },
      };
      this.modalService.show(PhotographyFormComponent, config);
    } else {
      this.onLoadToast(
        'info',
        'Acción invalida',
        'Necesitas tener un bien seleccionado'
      );
    }
  }

  generateMinute() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        console.log('data111', data);
        if (data) {
        }
      },
    };

    const generateMinute = this.modalService.show(
      InformationRecordComponent,
      config
    );
  }

  showGood(data: IGood) {
    let report = '/showReport?nombreReporte=Etiqueta_TDR.jasper&CID_BIEN=';
    report += [data.goodId];
  }

  confirm() {}

  close() {}
  //Bienes seleccionados//
  // goodsSelects(data: any) {
  //   this.goodsSelect = data;
  // }
  // assingMinute() {
  //   if (this.goodsSelect.length > 0) {
  //     this.alertQuestion(
  //       'warning',
  //       '¿Seguro que quiere asignar los bienes  a una acta (cambio irreversible)?',
  //       '',
  //       'Aceptar'
  //     ).then(question => {
  //       if (question.isConfirmed) {
  //         this.getInfoGoodsProgramming();
  //       }
  //     });
  //   } else {
  //     this.onLoadToast('warning', 'Se necesita tener un bien seleccionado', '');
  //   }
  // }
  changeStatusGoodCancelation(good: IGood) {
    return new Promise(async (resolve, reject) => {
      // this.goodsCancelation.clear();
      this.selectGood.map((item: any) => {
        const formData: Object = {
          id: Number(item.id),
          goodId: Number(item.goodId),
          goodStatus: 'EN_TRANSPORTABLE',
        };

        this.goodService.updateByBody(formData).subscribe({
          next: () => {},
        });
      });
      const showGoods: any = await this.getFilterGood('EN_TRANSPORTABLE');
      if (showGoods) {
        this.getInfoGoodsProgramming();
        this.goodIdSelect = null;
        // this.headingCancelation = `Cancelación(${this.goodsCancelation.length})`;
      }
    });
  }
  //Bienes asociados a recibo
  showGoodsReceipt(receipt: IReceipt) {
    const receiptId = receipt.id;
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      receiptId,
      callBack: (data: boolean) => {},
    };

    this.modalService.show(GoodsReceiptsFormComponent, config);
  }
  //Generar recibo//
  generateReceiptGuard(receipt: IReceipt) {
    const receiptId = receipt.id;
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      receiptId,
      callBack: (data: boolean) => {},
    };

    this.modalService.show(GenerateReceiptGuardFormComponent, config);
  }
  getFilterGood(type: string) {
    return new Promise((resolve, reject) => {
      this.paramsTransportableGoods.getValue()['filter.programmingId'] =
        this.programmingId;

      this.programmingService
        .getGoodsProgramming(this.paramsTransportableGoods.getValue())
        .subscribe(data => {
          const filterGood = data.data.filter(item => {
            return item.status == type;
          });
          resolve(filterGood);
          
        });
    });
  }
  delete() {}

  deleteGoodGuard() {
    if (this.goodIdSelect > 0) {
      this.selectGood.map((item: any) => {
        const formData: Object = {
          programmingId: this.programmingId,
          goodId: item.id,
          status: 'EN_TRANSPORTABLE',
        };
        this.programmingGoodService.updateGoodProgramming(formData).subscribe({
          next: async response => {
            await this.changeStatusGoodTran(item);
          },
          error: error => {
            console.log('error actualizar progr', error);
          },
        });
      });
    } else {
      this.onLoadToast(
        'info',
        'Acción invalida',
        'Se debe seleccionar un bien'
      );
    }
  }
  deleteGoodWarehouse() {
    if (this.goodIdSelect > 0) {
      this.selectGood.map((item: any) => {
        const formData: Object = {
          programmingId: this.programmingId,
          goodId: item.id,
          status: 'EN_TRANSPORTABLE',
        };
        this.programmingGoodService.updateGoodProgramming(formData).subscribe({
          next: async response => {
            await this.changeStatusGoodWarehouse(item);
          },
          error: error => {
            console.log('error actualizar progr', error);
          },
        });
      });
    } else {
      this.onLoadToast(
        'info',
        'Acción invalida',
        'Se debe seleccionar un bien'
      );
    }
  }
  deleteGoodRep() {
    if (this.goodIdSelect > 0) {
      this.selectGood.map((item: any) => {
        const formData: Object = {
          programmingId: this.programmingId,
          goodId: item.id,
          status: 'EN_TRANSPORTABLE',
        };
        this.programmingGoodService.updateGoodProgramming(formData).subscribe({
          next: async response => {
            await this.changeStatusGoodTran(item);
          },
          error: error => {},
        });
      });
    } else {
      this.onLoadToast(
        'info',
        'Acción invalida',
        'Se debe seleccionar un bien'
      );
    }
  }
  changeStatusGoodTran(good: IGood) {
    return new Promise(async (resolve, reject) => {
      // this.goodsGuards.clear();
      this.selectGood.map((item: any) => {
        const formData: Object = {
          id: Number(item.id),
          goodId: Number(item.goodId),
          goodStatus: 'EN_TRANSPORTABLE',
        };

        this.goodService.updateByBody(formData).subscribe({
          next: () => {},
        });
      });
      const showGoods: any = await this.getFilterGood('EN_TRANSPORTABLE');
      if (showGoods) {
        this.getInfoGoodsProgramming();
        this.goodIdSelect = null;
        this.headingReprogramation = `Reprogramación(${this.goodsReprog.length})`;
      }
    });
  }
  deleteGoodCancelation() {
    if (this.goodIdSelect > 0) {
      this.selectGood.map((item: any) => {
        const formData: Object = {
          programmingId: this.programmingId,
          goodId: item.id,
          status: 'EN_TRANSPORTABLE',
        };
        this.programmingGoodService.updateGoodProgramming(formData).subscribe({
          next: async response => {
            await this.changeStatusGoodCancelation(item);
          },
          error: error => {
            console.log('error actualizar progr', error);
          },
        });
      });
    } else {
      this.onLoadToast(
        'info',
        'Acción invalida',
        'Se debe seleccionar un bien'
      );
    }
  }

  changeStatusGoodWarehouse(good: IGood) {
    return new Promise(async (resolve, reject) => {
      // this.goodsCancelation.clear();
      this.selectGood.map((item: any) => {
        const formData: Object = {
          id: Number(item.id),
          goodId: Number(item.goodId),
          goodStatus: 'EN_TRANSPORTABLE',
        };

        this.goodService.updateByBody(formData).subscribe({
          next: () => {},
        });
      });
      const showGoods: any = await this.getFilterGood('EN_TRANSPORTABLE');
      if (showGoods) {
        this.getInfoGoodsProgramming();
        this.goodIdSelect = null;
         this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.length})`;
      }
    });
  }
  changeStatusGoodTransportable(good: IGood) {
    return new Promise(async (resolve, reject) => {
      this.selectGood.map((item: any) => {
        const formData = {
          id: item.id,
          goodId: item.goodId,
          status: 'EN_TRANSPORTABLE',
        };
        this.goodService.updateByBody(formData).subscribe({
          next: () => {
            this.getInfoGoodsProgramming();
          },
        });
      });
    });
  }
  cancelGood() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      goodSelect: this.selectGood,
      programming: this.programming,
      callback: (next: boolean) => {
        if (next) {
          this.getInfoGoodsProgramming();
        }
      },
    };
    this.modalService.show(CancelationGoodFormComponent, config);
  }
  */
}
