import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import {
  IMeasureUnit,
  IPhysicalStatus,
  IStateConservation,
} from 'src/app/core/models/catalogs/generic.model';
import { IGoodProgramming } from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IGood } from 'src/app/core/models/good/good.model';
import { IReception } from 'src/app/core/models/ms-reception-good/reception-good.model';
import { IReceipt } from 'src/app/core/models/receipt/receipt.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { AssignReceiptFormComponent } from '../../../shared-request/assign-receipt-form/assign-receipt-form.component';
import { ShowDocumentsGoodComponent } from '../../../shared-request/expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { GenerateReceiptFormComponent } from '../../../shared-request/generate-receipt-form/generate-receipt-form.component';
import { PhotographyFormComponent } from '../../../shared-request/photography-form/photography-form.component';
import { ESTATE_COLUMNS_VIEW } from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS_SHOW } from '../../acept-programming/columns/users-columns';
import { GenerateReceiptGuardFormComponent } from '../../shared-components-programming/generate-receipt-guard-form/generate-receipt-guard-form.component';
import { GoodsReceiptsFormComponent } from '../../shared-components-programming/goods-receipts-form/goods-receipts-form.component';
import { CancelationGoodFormComponent } from '../cancelation-good-form/cancelation-good-form.component';
import { EditGoodFormComponent } from '../edit-good-form/edit-good-form.component';
import { ReschedulingFormComponent } from '../rescheduling-form/rescheduling-form.component';
import {
  RECEIPT_COLUMNS,
  RECEIPT_GUARD_COLUMNS,
} from './columns/minute-columns';
import { tranGoods } from './execute-reception-data';

@Component({
  selector: 'app-execute-reception-form',
  templateUrl: './execute-reception-form.component.html',
  styleUrls: ['./execute-reception.scss'],
})
export class ExecuteReceptionFormComponent extends BasePage implements OnInit {
  isDropup = true;
  goods: any[] = [];
  receiptGuards: IReception[] = [];
  goodsGuard: IGood[] = [];
  goodsWareh: IGood[] = [];
  goodsSelect: IGood[] = [];
  stateConservation: IStateConservation[] = [];
  statusPhysical: IPhysicalStatus[] = [];
  measureUnits: IMeasureUnit[] = [];
  executeForm: FormGroup = new FormGroup({});
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
  //goodsWarehouse: LocalDataSource = new LocalDataSource();
  paramsTransportableGoods = new BehaviorSubject<ListParams>(new ListParams());

  nameWarehouse: string = '';
  ubicationWarehouse: string = '';
  totalItems: number = 0;
  totalItemsGuard: number = 0;
  totalItemsWarehouse: number = 0;
  totalItemsReceipt: number = 0;
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
    selectMode: 'multi',
    columns: ESTATE_COLUMNS_VIEW,
  };

  settingsWarehouseGoods = {
    ...this.settings,
    actions: false,
    selectMode: 'multi',
    columns: ESTATE_COLUMNS_VIEW,
  };

  settingsReceipt = {
    ...this.settings,
    actions: {
      columnTitle: 'Generar recibo',
      position: 'right',
      delete: false,
    },
    columns: RECEIPT_COLUMNS,
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
  tranGoods = tranGoods;
  receipts: LocalDataSource = new LocalDataSource();
  search: FormControl = new FormControl({});
  programming: Iprogramming;
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private programmingService: ProgrammingRequestService,
    private regDelegationService: RegionalDelegationService,
    private transferentService: TransferenteService,
    private stationService: StationService,
    private authorityService: AuthorityService,
    private typeRelevantService: TypeRelevantService,
    private warehouseService: WarehouseService,
    private goodsQueryService: GoodsQueryService,
    private goodService: GoodService,
    private proccedingService: ProceedingsService,
    private showHideErrorInterceptorService: showHideErrorInterceptorService,
    private receptionService: ReceptionGoodService,
    private genericService: GenericService,
    private programmingGoodService: ProgrammingGoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: USER_COLUMNS_SHOW,
    };

    this.programmingId = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareGuardForm();
    this.prepareWarehouseForm();
    this.prepareReprogForm();
    this.prepareCancelForm();
    this.showDataProgramming();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInfoGoodsProgramming());

    this.getConcervationState();
    this.getUnitMeasure();
    this.getPhysicalStatus();
  }

  prepareForm() {
    this.executeForm = this.fb.group({
      goodsTransportable: this.fb.array([]),
      descriptionGoodSae: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      quantitySae: [
        null,
        [Validators.maxLength(50), Validators.pattern(NUMBERS_PATTERN)],
      ],
      saeMeasureUnit: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      selectColumn: [null],
    });
  }

  prepareGuardForm() {
    this.goodsGuardForm = this.fb.group({
      goodsGuard: this.fb.array([]),
      descriptionGoodSae: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      quantitySae: [
        null,
        [Validators.maxLength(50), Validators.pattern(NUMBERS_PATTERN)],
      ],
      saeMeasureUnit: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      selectColumn: [null],
    });
  }

  prepareWarehouseForm() {
    this.goodsWarehouseForm = this.fb.group({
      goodsWarehouse: this.fb.array([]),
      descriptionGoodSae: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      quantitySae: [
        null,
        [Validators.maxLength(50), Validators.pattern(NUMBERS_PATTERN)],
      ],
      saeMeasureUnit: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      selectColumn: [null],
    });
  }

  prepareReprogForm() {
    this.goodsReprogForm = this.fb.group({
      goodsReprog: this.fb.array([]),
      descriptionGoodSae: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      quantitySae: [
        null,
        [Validators.maxLength(50), Validators.pattern(NUMBERS_PATTERN)],
      ],
      saeMeasureUnit: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      selectColumn: [null],
    });
  }

  prepareCancelForm() {
    this.goodsCancelationForm = this.fb.group({
      goodsCancelation: this.fb.array([]),
      descriptionGoodSae: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      quantitySae: [
        null,
        [Validators.maxLength(50), Validators.pattern(NUMBERS_PATTERN)],
      ],
      saeMeasureUnit: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      selectColumn: [null],
    });
  }

  get goodsTransportable() {
    return this.executeForm.get('goodsTransportable') as FormArray;
  }

  get goodsGuards() {
    return this.goodsGuardForm.get('goodsGuard') as FormArray;
  }

  get goodsWarehouse() {
    return this.goodsWarehouseForm.get('goodsWarehouse') as FormArray;
  }

  get goodsReprog() {
    return this.goodsReprogForm.get('goodsReprog') as FormArray;
  }

  get goodsCancelation() {
    return this.goodsCancelationForm.get('goodsCancelation') as FormArray;
  }

  showDataProgramming() {
    this.programmingService
      .getProgrammingId(this.programmingId)
      .subscribe(data => {
        this.programming = data;
        this.idRegDelegation = data.regionalDelegationNumber;
        this.idTypeRelevat = data.typeRelevantId;
        this.idTransferent = data.tranferId;
        this.idStation = data.stationId;
        this.getDataRegionalDelegation(data);
        this.getTransferent(data);
        this.getStation(data);
        this.getAuthority();
        this.getTypeRelevant();
        this.getwarehouse();
        this.getUsersProgramming();

        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getInfoGoodsProgramming());
      });
  }

  getDataRegionalDelegation(data: Iprogramming) {
    this.regDelegationService
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
    this.paramsAuthority.getValue()['filter.idStation'] = this.idStation;

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
      });
  }

  /*----------Show info goods programming --------- */
  getInfoGoodsProgramming() {
    const params = new BehaviorSubject<ListParams>(new ListParams());

    this.goodsTransportable.reset();
    params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getGoodsProgramming(params.getValue())
      .subscribe(data => {
        this.filterStatusTrans(data.data);
        this.filterStatusWarehouse(data.data);
        this.filterStatusGuard(data.data);
        this.filterStatusReprog(data.data);
        this.filterStatusCancelation(data.data);
      });
  }

  filterStatusTrans(data: IGoodProgramming[]) {
    const goodsTrans = data.filter(items => {
      return items.status == 'EN_TRANSPORTABLE';
    });

    const goodInfo = goodsTrans.map(good => {
      this.params.getValue()['filter.id'] = good.goodId;
      this.goodService.getAll(this.params.getValue()).subscribe(response => {
        this.formDataTrans(response.data);
        return response.data;
      });
    });

    /*const formData = goodsTrans.map(items => {
      this.params.getValue()['filter.id'] = items.goodId;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: response => {
          const info = response.data.map(item => {
            if (item.physicalStatus == 1) {
              item.physicalStatusName = 'BUENO';
            } else if (item.physicalStatus == 2) {
              item.physicalStatusName = 'MALO';
            }
            if (item.stateConservation == 1) {
              item.stateConservationName = 'BUENO';
            } else if (item.stateConservation == 2) {
              item.stateConservationName = 'MALO';
            }
            this.goodsTransportable.clear();
            this.goodData = item;

            const form = this.fb.group({
              id: [item?.id],
              goodId: [item?.goodId],
              uniqueKey: [item?.uniqueKey],
              fileNumber: [item?.fileNumber],
              goodDescription: [item?.goodDescription],
              quantity: [item?.quantity],
              unitMeasure: [item?.unitMeasure],
              descriptionGoodSae: [item?.descriptionGoodSae],
              quantitySae: [item?.quantitySae],
              saeMeasureUnit: [item?.saeMeasureUnit],
              physicalStatus: [item?.physicalStatus],
              physicalStatusName: [item?.physicalStatusName],
              saePhysicalState: [item?.saePhysicalState],
              stateConservation: [item?.stateConservation],
              stateConservationName: [item?.stateConservationName],
              stateConservationSae: [item?.stateConservationSae],
              regionalDelegationNumber: [item?.regionalDelegationNumber],
            });

            return form;
          });
          console.log('dataForm', info);
        },
        error: error => {
          this.formLoading = false;
        },
      });
    });

    this.goodsTransportable.push(form);
          this.goodsTransportable.updateValueAndValidity();
            this.formLoading = false; */
  }

  formDataTrans(good: IGood[]) {
    console.log('goodsTrans', good);
  }

  filterStatusGuard(data: IGoodProgramming[]) {
    const goodRes = data.filter(items => {
      return items.status == 'EN_RESGUARDO_TMP';
    });

    goodRes.map(items => {
      this.params.getValue()['filter.id'] = items.goodId;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: data => {
          data.data.map(response => {
            if (response.physicalStatus == 1) {
              response.physicalStatusName = 'BUENO';
            } else if (response.physicalStatus == 2) {
              response.physicalStatusName = 'MALO';
            }
            if (response.stateConservation == 1) {
              response.stateConservationName = 'BUENO';
            } else if (response.stateConservation == 2) {
              response.stateConservationName = 'MALO';
            }
            this.goodsGuards.clear();
            this.goodData = response;

            const form = this.fb.group({
              id: [response?.id],
              goodId: [response?.goodId],
              uniqueKey: [response?.uniqueKey],
              fileNumber: [response?.fileNumber],
              goodDescription: [response?.goodDescription],
              quantity: [response?.quantity],
              unitMeasure: [response?.unitMeasure],
              descriptionGoodSae: [response?.descriptionGoodSae],
              quantitySae: [response?.quantitySae],
              saeMeasureUnit: [response?.saeMeasureUnit],
              physicalStatus: [response?.physicalStatus],
              physicalStatusName: [response?.physicalStatusName],
              saePhysicalState: [response?.saePhysicalState],
              stateConservation: [response?.stateConservation],
              stateConservationName: [response?.stateConservationName],
              stateConservationSae: [response?.stateConservationSae],
              regionalDelegationNumber: [response?.regionalDelegationNumber],
            });
            this.goodsGuards.push(form);
            this.goodsGuards.updateValueAndValidity();
            this.formLoading = false;
            this.headingGuard = `En Resguardo(${this.goodsGuards.length})`;
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
      return items.status == 'EN_ALMACEN';
    });

    goodWarehouse.map(items => {
      this.params.getValue()['filter.id'] = items.goodId;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: data => {
          data.data.map(response => {
            if (response.physicalStatus == 1) {
              response.physicalStatusName = 'BUENO';
            } else if (response.physicalStatus == 2) {
              response.physicalStatusName = 'MALO';
            }
            if (response.stateConservation == 1) {
              response.stateConservationName = 'BUENO';
            } else if (response.stateConservation == 2) {
              response.stateConservationName = 'MALO';
            }
            this.goodsWarehouse.clear();
            this.goodData = response;

            const form = this.fb.group({
              id: [response?.id],
              goodId: [response?.goodId],
              uniqueKey: [response?.uniqueKey],
              fileNumber: [response?.fileNumber],
              goodDescription: [response?.goodDescription],
              quantity: [response?.quantity],
              unitMeasure: [response?.unitMeasure],
              descriptionGoodSae: [response?.descriptionGoodSae],
              quantitySae: [response?.quantitySae],
              saeMeasureUnit: [response?.saeMeasureUnit],
              physicalStatus: [response?.physicalStatus],
              physicalStatusName: [response?.physicalStatusName],
              saePhysicalState: [response?.saePhysicalState],
              stateConservation: [response?.stateConservation],
              stateConservationName: [response?.stateConservationName],
              stateConservationSae: [response?.stateConservationSae],
              regionalDelegationNumber: [response?.regionalDelegationNumber],
            });
            this.goodsWarehouse.push(form);
            this.goodsWarehouse.updateValueAndValidity();
            this.formLoading = false;
            this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.length})`;
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
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: data => {
          data.data.map(response => {
            if (response.physicalStatus == 1) {
              response.physicalStatusName = 'BUENO';
            } else if (response.physicalStatus == 2) {
              response.physicalStatusName = 'MALO';
            }
            if (response.stateConservation == 1) {
              response.stateConservationName = 'BUENO';
            } else if (response.stateConservation == 2) {
              response.stateConservationName = 'MALO';
            }
            this.goodsReprog.clear();
            this.goodData = response;

            const form = this.fb.group({
              id: [response?.id],
              goodId: [response?.goodId],
              uniqueKey: [response?.uniqueKey],
              fileNumber: [response?.fileNumber],
              goodDescription: [response?.goodDescription],
              quantity: [response?.quantity],
              unitMeasure: [response?.unitMeasure],
              descriptionGoodSae: [response?.descriptionGoodSae],
              quantitySae: [response?.quantitySae],
              saeMeasureUnit: [response?.saeMeasureUnit],
              physicalStatus: [response?.physicalStatus],
              physicalStatusName: [response?.physicalStatusName],
              saePhysicalState: [response?.saePhysicalState],
              stateConservation: [response?.stateConservation],
              stateConservationName: [response?.stateConservationName],
              stateConservationSae: [response?.stateConservationSae],
              regionalDelegationNumber: [response?.regionalDelegationNumber],
            });
            this.goodsReprog.push(form);
            this.goodsReprog.updateValueAndValidity();
            this.formLoading = false;
            this.headingReprogramation = `Reprogramación(${this.goodsReprog.length})`;
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
            if (response.physicalStatus == 1) {
              response.physicalStatusName = 'BUENO';
            } else if (response.physicalStatus == 2) {
              response.physicalStatusName = 'MALO';
            }
            if (response.stateConservation == 1) {
              response.stateConservationName = 'BUENO';
            } else if (response.stateConservation == 2) {
              response.stateConservationName = 'MALO';
            }
            this.goodsCancelation.clear();
            this.goodData = response;

            const form = this.fb.group({
              id: [response?.id],
              goodId: [response?.goodId],
              uniqueKey: [response?.uniqueKey],
              fileNumber: [response?.fileNumber],
              goodDescription: [response?.goodDescription],
              quantity: [response?.quantity],
              unitMeasure: [response?.unitMeasure],
              descriptionGoodSae: [response?.descriptionGoodSae],
              quantitySae: [response?.quantitySae],
              saeMeasureUnit: [response?.saeMeasureUnit],
              physicalStatus: [response?.physicalStatus],
              physicalStatusName: [response?.physicalStatusName],
              saePhysicalState: [response?.saePhysicalState],
              stateConservation: [response?.stateConservation],
              stateConservationName: [response?.stateConservationName],
              stateConservationSae: [response?.stateConservationSae],
              regionalDelegationNumber: [response?.regionalDelegationNumber],
            });
            this.goodsCancelation;
            this.goodsCancelation.push(form);
            this.goodsCancelation.updateValueAndValidity();
            this.formLoading = false;
            this.headingCancelation = `Cancelación(${this.goodsCancelation.length})`;
          });
        },
        error: error => {
          this.formLoading = false;
        },
      });
    });
  }

  getUnitMeasure() {
    this.params.getValue()['filter.measureTlUnit'] = `$ilike:${
      this.params.getValue().text
    }`;
    this.params.getValue().limit = 20;
    this.goodsQueryService
      .getCatMeasureUnitView(this.params.getValue())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          this.measureUnits = resp.data;
        },
        error: error => {},
      });
  }

  getConcervationState() {
    this.params.getValue()['filter.name'] = '$eq:Estado Conservacion';
    this.genericService
      .getAll(this.params.getValue())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          this.stateConservation = data.data;
        },
        error: error => {},
      });
  }

  getPhysicalStatus() {
    this.params.getValue()['filter.name'] = '$eq:Estado Fisico';
    this.genericService
      .getAll(this.params.getValue())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          this.statusPhysical = data.data;
        },
      });
  }
  goodSelect(good: IGood) {
    this.goodIdSelect = good.id;
    this.selectGood.push(good);
  }
  goodSelectGuard(good: IGood) {
    this.goodIdSelectGuard = good.id;
    this.selectGoodGuard.push(good);
  }

  infoGoods() {
    this.goods.forEach(items => {
      this.executeForm.get('quantitySae').setValue(items.quantitySae);
    });
  }

  // Actualizar la información del bien //
  updateInfoGood(goodNumber: number, goodId: number) {
    const GoodData: Object = {
      id: Number(goodNumber),
      goodId: Number(goodId),
      quantitySae: this.executeForm.get('quantitySae').value,
      //descriptionGoodSae: this.executeForm.get('descriptionGoodSae').value
      /*
      saeMeasureUnit: this.executeForm.get('saeMeasureUnit').value,
      saePhysicalState: this.executeForm.get('saePhysicalState').value,
      stateConservationSae: this.executeForm.get('stateConservationSae').value,¨*/
    };
    this.alertQuestion(
      'warning',
      '¿Desea actualizar el bien?',
      '',
      'Actualizar'
    ).then(question => {
      if (question.isConfirmed) {
        this.goodService.updateByBody(GoodData).subscribe(() => {
          this.onLoadToast('success', 'Bien actualizado correctamente', '');
          //this.getReportGoods();
        });
      }
    });
  }

  editGood(good: IGood) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      good,
      callback: (next: boolean) => {
        if (next) this.getInfoGoodsProgramming();
      },
    };

    this.modalService.show(EditGoodFormComponent, config);
  }

  updateInfo(data: IGood) {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea editar el bien?'
    ).then(question => {
      if (question.isConfirmed) {
        this.goodService.updateByBody(data).subscribe({
          next: () => {
            this.getInfoGoodsProgramming();
          },
          error: error => {
            console.log('error bien', error);
          },
        });
      }
    });
  }

  //Bienes seleccionados//
  goodsSelects(data: any) {
    this.goodsSelect = data;
  }

  //Asignar acta a los bienes seleccionados//
  assingMinute() {
    if (this.goodsSelect.length > 0) {
      this.alertQuestion(
        'warning',
        '¿Seguro que quiere asignar los bienes  a una acta (cambio irreversible)?',
        '',
        'Aceptar'
      ).then(question => {
        if (question.isConfirmed) {
          this.getInfoGoodsProgramming();
        }
      });
    } else {
      this.onLoadToast('warning', 'Se necesita tener un bien seleccionado', '');
    }
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

  getUsersProgramming() {
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
  }

  uploadDocuments() {
    if (this.goodIdSelect) {
      let config: ModalOptions = {
        initialState: {
          idGood: this.goodIdSelect,
          programming: this.programming,
          process: 'programming',
          parameter: '',
          typeDoc: 'request-assets',
          callback: (next: boolean) => {
            //if(next) this.getExample();
          },
        },
        class: `modalSizeXL modal-dialog-centered`,
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowDocumentsGoodComponent, config);
    } else {
      this.onLoadToast(
        'info',
        'Acción invalida',
        'Necesitas tener un bien seleccionado'
      );
    }
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

  createReceipt() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const createReceipt = this.modalService.show(
      GenerateReceiptFormComponent,
      config
    );
  }

  assignReceipt() {
    if (this.selectGood) {
      let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
      config.initialState = {
        programming: this.programming,
        selectGoods: this.selectGood,
        callback: (data: boolean) => {
          if (data) {
            this.sendGoodTransportable();
          }
        },
      };

      this.modalService.show(AssignReceiptFormComponent, config);
    } else {
      this.onLoadToast(
        'info',
        'Acción no permitida',
        'Se necesita tener un bien seleccionado'
      );
    }
  }

  sendGoodTransportable() {
    this.selectGood.map((item: any) => {
      this.goodsTransportable.clear();
      const formData: Object = {
        programmingId: this.programmingId,
        goodId: item.id,
        status: 'EN_TRANSPORTABLE',
      };
      this.programmingGoodService.updateGoodProgramming(formData).subscribe({
        next: async response => {
          const changeStatusGuard = await this.changeStatusGoodTran(item);
        },
        error: error => {},
      });
    });
  }

  sendGoodGuard() {
    if (this.selectGood) {
      this.selectGood.map((item: any) => {
        this.goodsTransportable.clear();
        const formData: Object = {
          programmingId: this.programmingId,
          goodId: item.id,
          status: 'EN_RESGUARDO',
        };
        this.programmingGoodService.updateGoodProgramming(formData).subscribe({
          next: async response => {
            const changeStatusGuard = await this.changeStatusGoodTran(item);
          },
          error: error => {},
        });
      });
    } else {
      this.onLoadToast(
        'info',
        'Acción no permitida',
        'Se necesita tener un bien seleccionado'
      );
    }
  }

  sendWarehouse() {
    if (this.selectGood) {
      this.selectGood.map((item: any) => {
        this.goodsTransportable.clear();
        const formData: Object = {
          programmingId: this.programmingId,
          goodId: item.id,
          status: 'EN_ALMACEN',
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
        'Acción no permitida',
        'Se necesita tener un bien seleccionado'
      );
    }
  }

  changeStatusGoodTran(good: IGood) {
    return new Promise(async (resolve, reject) => {
      this.goodsGuards.clear();
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

  changeStatusGoodWarehouse(good: IGood) {
    return new Promise(async (resolve, reject) => {
      this.goodsCancelation.clear();
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

  changeStatusGoodCancelation(good: IGood) {
    return new Promise(async (resolve, reject) => {
      this.goodsCancelation.clear();
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
        this.headingCancelation = `Cancelación(${this.goodsCancelation.length})`;
      }
    });
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
          //
        });
    });
  }

  rescheduling() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      goodSelect: this.selectGood,
      programming: this.programming,
      callback: (next: boolean) => {
        if (next) {
          this.goodsTransportable.clear();
          this.getInfoGoodsProgramming();
        }
      },
    };

    this.modalService.show(ReschedulingFormComponent, config);
  }

  showGood(data: IGood) {
    let report = '/showReport?nombreReporte=Etiqueta_TDR.jasper&CID_BIEN=';
    report += [data.goodId];
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
          this.goodsTransportable.clear();
          this.getInfoGoodsProgramming();
        }
      },
    };
    this.modalService.show(CancelationGoodFormComponent, config);
  }
}
