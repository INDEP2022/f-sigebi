import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IMeasureUnit,
  IPhysicalStatus,
  IStateConservation,
} from 'src/app/core/models/catalogs/generic.model';
import { IGoodProgramming } from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IGood } from 'src/app/core/models/good/good.model';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { ITask } from 'src/app/core/models/ms-task/task-model';
import {
  IReceipt,
  IRecepitGuard,
} from 'src/app/core/models/receipt/receipt.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { DomicileService } from 'src/app/core/services/catalogs/domicile.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { AssignReceiptFormComponent } from '../../../shared-request/assign-receipt-form/assign-receipt-form.component';
import { ShowDocumentsGoodComponent } from '../../../shared-request/expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { GenerateReceiptFormComponent } from '../../../shared-request/generate-receipt-form/generate-receipt-form.component';
import { PhotographyFormComponent } from '../../../shared-request/photography-form/photography-form.component';
import { ESTATE_COLUMNS_VIEW } from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS_SHOW } from '../../acept-programming/columns/users-columns';
import { settingTransGoodsExecute } from '../../perform-programming/perform-programming-form/settings-tables';
import { GenerateReceiptGuardFormComponent } from '../../shared-components-programming/generate-receipt-guard-form/generate-receipt-guard-form.component';
import { GoodsReceiptsFormComponent } from '../../shared-components-programming/goods-receipts-form/goods-receipts-form.component';
import { CancelationGoodFormComponent } from '../cancelation-good-form/cancelation-good-form.component';
import { EditGoodFormComponent } from '../edit-good-form/edit-good-form.component';
import { ReschedulingFormComponent } from '../rescheduling-form/rescheduling-form.component';
import { ShowReceiptCloseComponent } from '../show-receipt-close/show-receipt-close.component';
import { ShowReceiptGuardCloseComponent } from '../show-receipt-guard-close/show-receipt-guard-close.component';
import { ShowReportComponentComponent } from '../show-report-component/show-report-component.component';
import { UploadReportReceiptComponent } from '../upload-report-receipt/upload-report-receipt.component';
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
  receiptGuards: LocalDataSource = new LocalDataSource();
  receiptWarehouse: LocalDataSource = new LocalDataSource();
  goodsGuard: IGood[] = [];
  goodsWareh: IGood[] = [];
  goodsSelect: IGood[] = [];
  goodsProgramming: IGoodProgramming[] = [];
  stateConservation: IStateConservation[] = [];
  statusPhysical: IPhysicalStatus[] = [];
  measureUnits: IMeasureUnit[] = [];
  executeForm: FormGroup = new FormGroup({});
  receptionForm: FormGroup = new FormGroup({});
  goodsGuardForm: FormGroup = new FormGroup({});
  goodsWarehouseForm: FormGroup = new FormGroup({});
  goodsReprogForm: FormGroup = new FormGroup({});
  goodsCancelationForm: FormGroup = new FormGroup({});
  searchGoodForm: FormGroup = new FormGroup({});
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
  paramsGuardGoods = new BehaviorSubject<ListParams>(new ListParams());
  paramsTransportableGoods = new BehaviorSubject<ListParams>(new ListParams());
  paramsCancelGoods = new BehaviorSubject<ListParams>(new ListParams());
  paramsReprogGoods = new BehaviorSubject<ListParams>(new ListParams());
  nameWarehouse: string = '';
  ubicationWarehouse: string = '';
  totalItems: number = 0;
  totalItemsGuard: number = 0;
  totalItemsWarehouse: number = 0;
  totalItemsReprog: number = 0;
  totalItemsReceipt: number = 0;
  totalItemsCancelation: number = 0;
  totalItemsReception: number = 0;
  totalItemsTransportableGoods: number = 0;
  selectGood: IGood[] = [];
  infoGood: IGood[] = [];
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
  tranType: string = '';
  stationName: string = '';
  stateName: string = '';
  authorityName: string = '';
  typeRelevantName: string = '';
  idTypeRelevant: number = 0;
  formLoading: boolean = false;
  formLoadingReceipt: boolean = false;
  formLoadingProceeding: boolean = false;
  formLoadingReprog: boolean = false;
  formLoadingTrans: boolean = false;
  formLoadingGuard: boolean = false;
  formLoadingWarehouse: boolean = false;
  showReception: boolean = false;
  showTransportable: boolean = false;
  showGuard: boolean = false;
  showWarehouse: boolean = false;
  showReprog: boolean = false;
  showCancel: boolean = false;
  formLoadingTransportable: boolean = false;
  //receiptGuardGood: IRecepitGuard;
  receiptGuardGood: IRecepitGuard;
  receiptWarehouseGood: IRecepitGuard;
  paramsShowTransportable = new BehaviorSubject<ListParams>(new ListParams());
  receiptData: IReceipt;
  goodData: IGood;
  transfersDestinity: any[] = [];
  count: number = 0;
  delegationDes: string = '';
  keyTransferent: string = '';

  settingsTransportableGoods = {
    ...this.settings,
    ...settingTransGoodsExecute,
  };

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
      columnTitle: 'Generar Recibo',
      position: 'right',
      delete: true,
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
      columnTitle: 'Generar Recibo Resguardo',
      position: 'right',
    },

    edit: {
      editButtonContent: '<i class="fa fa-eye text-primary mx-2" > </i>',
    },

    delete: {
      deleteButtonContent: '<i class="fa fa-file text-info mx-2"> </i>',
    },

    columns: RECEIPT_GUARD_COLUMNS,
  };

  settingsReceiptsGuardsClose = {
    ...this.settings,
    actions: {
      delete: true,
      edit: true,
      columnTitle: 'Acciones',
      position: 'right',
    },

    edit: {
      editButtonContent: '<i class="fa fa-eye text-primary mx-2" > </i>',
    },

    delete: {
      deleteButtonContent: '<i class="fa fa-file text-info mx-2"> </i>',
    },

    columns: RECEIPT_GUARD_COLUMNS,
  };

  settingsReceiptWarehouse = {
    ...this.settings,
    actions: {
      delete: true,
      edit: true,
      columnTitle: 'Generar recibo Alamcén',
      position: 'right',
    },

    edit: {
      editButtonContent:
        '<i class="fa fa-book" text-warning aria-hidden="true"></i>',
    },

    delete: {
      deleteButtonContent:
        '<i class="fa fa-file ml-4" text-primary aria-hidden="true"></i> ',
    },

    columns: RECEIPT_GUARD_COLUMNS,
  };

  settingsReceiptWarehouseClose = {
    ...this.settings,
    actions: {
      delete: true,
      edit: true,
      columnTitle: 'Acciones',
      position: 'right',
    },

    edit: {
      editButtonContent:
        '<i class="fa fa-book" text-warning aria-hidden="true"></i>',
    },

    delete: {
      deleteButtonContent:
        '<i class="fa fa-eye ml-4" text-primary aria-hidden="true"></i>',
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
  proceedingOpen: IProceedings[] = [];
  proceedingOpenId: number = 0;
  task: ITask;
  goodId: string = '';
  goodsTranportables: LocalDataSource = new LocalDataSource();
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
    private genericService: GenericService,
    private programmingGoodService: ProgrammingGoodService,
    private receptionGoodService: ReceptionGoodService,
    private proceedingService: ProceedingsService,
    private programminGoodService: ProgrammingGoodService,
    private wcontentService: WContentService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService,
    private taskService: TaskService,
    private typeTransferentService: TransferenteService,
    private regionalDelegationService: RegionalDelegationService,
    private stateService: StateOfRepublicService,
    private domicilieService: DomicileService
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
    this.prepareSearchForm();
    this.prepareReceptionForm();
    this.prepareGuardForm();
    this.prepareWarehouseForm();
    this.prepareReprogForm();
    this.prepareCancelForm();
    this.showDataProgramming();
    this.getConcervationState();
    this.getUnitMeasure();
    this.getPhysicalStatus();
    this.getReceipts();
    this.getReceiptsGuard();
    this.getTypeTransferent();
    this.getTask();
    this.getDestinyIndep();
    this.getOpenProceeding();
  }

  getTask() {
    const task = JSON.parse(localStorage.getItem('Task'));
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = task.id;
    this.taskService.getAll(params.getValue()).subscribe({
      next: response => {
        this.task = response.data[0];
      },
      error: error => {},
    });
  }

  getOpenProceeding() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.idPrograming'] = this.programmingId;
    params.getValue()['filter.statusProceeedings'] = 'ABIERTO';
    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: response => {
        this.proceedingOpen = response.data;
      },
      error: error => {},
    });
  }

  prepareForm() {
    this.executeForm = this.fb.group({
      goodsTransportable: this.fb.array([]),
      descriptionGoodSae: [
        null,
        [Validators.maxLength(5000), Validators.pattern(STRING_PATTERN)],
      ],
      quantitySae: [null, [Validators.maxLength(50)]],
      saeMeasureUnit: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      destiny: [null],
      selectColumn: [null],
      observations: [null],
      transferentDestiny: [null],
    });
  }

  prepareSearchForm() {
    this.searchGoodForm = this.fb.group({
      goodId: [null],
    });
  }

  getTypeTransferent() {}

  prepareReceptionForm() {
    this.receptionForm = this.fb.group({
      goodsReception: this.fb.array([]),
      descriptionGoodSae: [
        null,
        [Validators.maxLength(5000), Validators.pattern(STRING_PATTERN)],
      ],
      quantitySae: [
        null,
        [Validators.maxLength(50), Validators.pattern(EMAIL_PATTERN)],
      ],
      saeMeasureUnit: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      observations: [null],
      selectColumn: [null],
      transferentDestiny: [null],
      destiny: [null],
    });
  }

  prepareGuardForm() {
    this.goodsGuardForm = this.fb.group({
      goodsGuard: this.fb.array([]),
      descriptionGoodSae: [
        null,
        [Validators.maxLength(5000), Validators.pattern(STRING_PATTERN)],
      ],
      quantitySae: [
        null,
        [Validators.maxLength(50), Validators.pattern(NUMBERS_PATTERN)],
      ],
      saeMeasureUnit: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      selectColumn: [null],
      transferentDestiny: [null],
    });
  }

  prepareWarehouseForm() {
    this.goodsWarehouseForm = this.fb.group({
      goodsWarehouse: this.fb.array([]),
      descriptionGoodSae: [
        null,
        [Validators.maxLength(5000), Validators.pattern(STRING_PATTERN)],
      ],
      quantitySae: [
        null,
        [Validators.maxLength(50), Validators.pattern(NUMBERS_PATTERN)],
      ],
      saeMeasureUnit: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      selectColumn: [null],
      transferentDestiny: [null],
    });
  }

  prepareReprogForm() {
    this.goodsReprogForm = this.fb.group({
      goodsReprog: this.fb.array([]),
      descriptionGoodSae: [
        null,
        [Validators.maxLength(5000), Validators.pattern(STRING_PATTERN)],
      ],
      quantitySae: [
        null,
        [Validators.maxLength(50), Validators.pattern(NUMBERS_PATTERN)],
      ],
      saeMeasureUnit: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      selectColumn: [null],
      transferentDestiny: [null],
    });
  }

  prepareCancelForm() {
    this.goodsCancelationForm = this.fb.group({
      goodsCancelation: this.fb.array([]),
      descriptionGoodSae: [
        null,
        [Validators.maxLength(5000), Validators.pattern(STRING_PATTERN)],
      ],
      quantitySae: [
        null,
        [Validators.maxLength(50), Validators.pattern(NUMBERS_PATTERN)],
      ],
      saeMeasureUnit: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      selectColumn: [null],
      transferentDestiny: [null],
    });
  }

  getReceipts() {
    this.formLoadingReceipt = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    this.receptionGoodService.getReceipt(params.getValue()).subscribe({
      next: response => {
        const receiptOpen = response.data.filter((receipt: IReceipt) => {
          return receipt.statusReceipt == 'ABIERTO';
        });

        this.receiptData = receiptOpen[0];
        this.receipts.load(receiptOpen);
        this.totalItemsReceipt = this.receipts.count();
        this.formLoadingReceipt = false;
      },
      error: error => {
        this.formLoadingReceipt = false;
        this.totalItemsReceipt = 0;
        this.receipts = new LocalDataSource();
      },
    });
  }

  getReceiptsGuard() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    params.getValue()['filter.statusReceiptGuard'] = 'ABIERTO';
    this.receptionGoodService.getReceptions(params.getValue()).subscribe({
      next: response => {
        //this.receiptGuardGood = response.data[0];

        const filterWarehouse = response.data.map((item: any) => {
          if (item.typeReceipt == 'ALMACEN') return item;
        });

        const infoWarehouse = filterWarehouse.filter((item: IRecepitGuard) => {
          return item;
        });

        this.receiptWarehouseGood = infoWarehouse[0];

        if (infoWarehouse.length > 0) {
          infoWarehouse[0].receiptDate = moment(
            infoWarehouse[0]?.receiptDate
          ).format('DD/MM/YYYY');
          this.receiptWarehouse.load(infoWarehouse);
        }

        const filterGuard = response.data.map((item: any) => {
          if (item.typeReceipt == 'RESGUARDO') return item;
        });
        if (filterGuard) {
          const infoGuard = filterGuard.filter((item: IRecepitGuard) => {
            return item;
          });
          this.receiptGuardGood = infoGuard[0];

          if (infoGuard.length > 0) {
            infoGuard[0].receiptDate = moment(infoGuard[0]?.receiptDate).format(
              'DD/MM/YYYY'
            );
            this.receiptGuards.load(infoGuard);
          }
        }
      },
      error: error => {},
    });
  }

  get goodsTransportable() {
    return this.executeForm.get('goodsTransportable') as FormArray;
  }

  get goodsReception() {
    return this.receptionForm.get('goodsReception') as FormArray;
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
        this.typeTransferent();
        this.getState();
        this.getUsersProgramming();

        this.paramsTransportableGoods
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getInfoGoodsTransportable());

        this.paramsReception
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getInfoReception());

        this.paramsGuardGoods
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getInfoGoodsGuard());

        this.paramsGoodsWarehouse
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getInfoWarehouse());

        this.paramsReprogGoods
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getInfoReprog());

        this.paramsCancelGoods
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getInfoCancel());
      });
  }

  typeTransferent() {
    this.transferentService
      .getById(this.programming.tranferId)
      .subscribe(data => {
        this.tranType = data.typeTransferent;
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

    return this.authorityService
      .getAll(this.paramsAuthority.getValue())
      .subscribe(data => {
        let authority = data.data.find(res => {
          return res;
        });
        this.authorityName = authority.authorityName;
      });
  }

  getState() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.programming.stateKey;
    this.stateService.getAll(params.getValue()).subscribe({
      next: response => {
        this.stateName = response.data[0].descCondition;
      },
      error: error => {},
    });
  }

  getTypeRelevant() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.programming.typeRelevantId;
    this.typeRelevantService.getAll(params.getValue()).subscribe(data => {
      this.idTypeRelevant = data.data[0].id;
      this.typeRelevantName = data.data[0].description;
    });
  }

  getwarehouse() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.idWarehouse'] = this.programming.storeId;
    this.warehouseService.getAll(params.getValue()).subscribe(data => {
      this.nameWarehouse = data.data[0].description;

      this.ubicationWarehouse = data.data[0].ubication;
    });
  }

  /*----------Show info goods programming --------- */
  /*showDataProgramming() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    this.goodsTransportable.reset();
    params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getGoodsProgramming(params.getValue())
      .subscribe(data => {
        //this.filterStatusTrans(data.data);
        //this.filterStatusReception(data.data);
        //this.filterStatusGuard(data.data);
        //this.filterStatusWarehouse(data.data);
        //this.filterStatusReprog(data.data);
        //this.filterStatusCancelation(data.data);
      });
  } */

  getInfoGoodsTransportable() {
    this.formLoadingTrans = true;
    const _data: any[] = [];

    this.paramsTransportableGoods.getValue()['filter.programmingId'] =
      this.programmingId;
    this.paramsTransportableGoods.getValue()['filter.status'] =
      'EN_TRANSPORTABLE';

    this.programmingService
      .getGoodsProgramming(this.paramsTransportableGoods.getValue())
      .subscribe({
        next: async data => {
          this.totalItemsTransportableGoods = data.count;
          data.data.map((item: IGoodProgramming) => {
            this.paramsShowTransportable.getValue()['filter.id'] = item.goodId;
            this.goodService
              .getAll(this.paramsShowTransportable.getValue())
              .subscribe({
                next: async data => {
                  _data.push(data.data[0]);

                  this.goodsTransportable.clear();
                  _data.forEach(async item => {
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
                      regionalDelegationNumber: [
                        item?.regionalDelegationNumber,
                      ],
                      destiny: [item?.destiny],
                      transferentDestiny: [item?.saeDestiny],
                      observations: [item?.observations],
                    });

                    this.goodsTransportable.push(form);
                    this.formLoadingTrans = false;
                    this.showTransportable = true;
                  });
                },
                error: error => {
                  this.formLoadingTrans = false;
                },
              });
          });
          /*
        //
        const showTransportable: any = [];
         */
        },
        error: error => {
          this.formLoadingTrans = false;
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

  /*filterStatusTrans(data: IGoodProgramming[]) {
    const _data: any[] = [];
    const filterData = data.filter(item => {
      return item.status == 'EN_TRANSPORTABLE';
    });

    if (filterData.length != 0) {
      filterData.forEach(items => {
        this.params.getValue()['filter.id'] = items.goodId;
        this.goodService.getAll(this.params.getValue()).subscribe({
          next: response => {
            _data.push(response.data[0]);

            this.goodsTransportable.clear();
            _data.forEach(async item => {
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

              await this.getDestinyIndep(item.saeDestiny);

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
                destiny: [item?.destiny],
                transferentDestiny: [item?.saeDestiny],
                observations: [item?.observations],
              });
              this.goodsTransportable.push(form);
              this.formLoadingTrans = false;
              this.showTransportable = true;
            });
          },
          error: error => {
            this.formLoadingTrans = false;
          },
        });
      });
    } else {
      this.formLoadingTrans = false;
    }
  } */

  getDestinyIndep() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.name'] = 'Destino';

    this.genericService.getAll(params.getValue()).subscribe({
      next: response => {
        this.transfersDestinity = response.data;
      },
      error: error => {},
    });
  }

  getInfoGoodsGuard() {
    this.formLoadingGuard = true;
    const _data: any[] = [];
    this.paramsGuardGoods.getValue()['filter.programmingId'] =
      this.programmingId;
    this.paramsGuardGoods.getValue()['filter.status'] = 'EN_RESGUARDO_TMP';
    this.programmingService
      .getGoodsProgramming(this.paramsGuardGoods.getValue())
      .subscribe({
        next: async data => {
          this.totalItemsGuard = data.count;
          data.data.forEach(items => {
            this.params.getValue()['filter.id'] = items.goodId;
            this.goodService.getAll(this.params.getValue()).subscribe({
              next: response => {
                _data.push(response.data[0]);

                this.goodsGuards.clear();
                _data.forEach(async item => {
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
                    transferentDestiny: [item?.saeDestiny],
                    observations: [item?.observations],
                    regionalDelegationNumber: [item?.regionalDelegationNumber],
                  });
                  this.goodsGuards.push(form);
                  this.headingGuard = `Resguardo(${data.count})`;
                  this.showGuard = true;
                  this.formLoadingGuard = false;
                });
              },
              error: error => {
                this.goodsGuards.clear();
                this.formLoadingGuard = false;
              },
            });
          });
        },
        error: error => {
          this.formLoadingGuard = false;
        },
      });
  }

  getInfoReception() {
    const _data: any[] = [];
    this.formLoadingReceipt = true;
    this.paramsReception.getValue()['filter.programmingId'] =
      this.programmingId;
    this.paramsReception.getValue()['filter.status'] = 'EN_RECEPCION_TMP';

    this.programmingService
      .getGoodsProgramming(this.paramsReception.getValue())
      .subscribe({
        next: async data => {
          this.totalItemsReception = data.count;
          data.data.forEach(items => {
            this.params.getValue()['filter.id'] = items.goodId;
            this.goodService.getAll(this.params.getValue()).subscribe({
              next: response => {
                _data.push(response.data[0]);

                this.goodsReception.clear();
                _data.forEach(async item => {
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
                    observations: [item?.observations],
                    destiny: [item?.destiny],
                    transferentDestiny: [item?.saeDestiny],
                  });

                  this.goodsReception.push(form);
                  this.showReception = true;
                  this.formLoadingReceipt = false;
                });
              },
              error: error => {
                this.goodsReception.clear();
                this.formLoadingReceipt = false;
              },
            });
          });
        },
        error: error => {
          this.formLoadingReceipt = false;
        },
      });
  }

  /*filterStatusReception(data: IGoodProgramming[]) {
    const _data: any[] = [];
    const filterData = data.filter(item => {
      return item.status == 'EN_RECEPCION_TMP';
    });

    
  } */

  formGoooTrans() {}
  /*filterStatusGuard(data: IGoodProgramming[]) {
    const _data: any[] = [];
    const filterData = data.filter(item => {
      return item.status == 'EN_RESGUARDO_TMP';
    });

    filterData.forEach(items => {
      this.params.getValue()['filter.id'] = items.goodId;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: response => {
          _data.push(response.data[0]);

          this.goodsGuards.clear();
          _data.forEach(async item => {
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
            await this.getDestinyIndep(item.saeDestiny);
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
              transferentDestiny: [item?.saeDestiny],
              regionalDelegationNumber: [item?.regionalDelegationNumber],
            });
            this.goodsGuards.push(form);
            this.headingGuard = `En Resguardo(${this.goodsGuards.length})`;
            this.showGuard = true;
          });
        },
        error: error => {
          this.goodsGuards.clear();
          this.formLoading = false;
        },
      });
    });
  } */

  getInfoWarehouse() {
    this.formLoadingWarehouse = true;
    const _data: any[] = [];
    this.paramsGoodsWarehouse.getValue()['filter.programmingId'] =
      this.programmingId;
    this.paramsGoodsWarehouse.getValue()['filter.status'] = 'EN_ALMACEN_TMP';
    this.programmingService
      .getGoodsProgramming(this.paramsGoodsWarehouse.getValue())
      .subscribe({
        next: async data => {
          this.totalItemsWarehouse = data.count;
          data.data.forEach(items => {
            this.params.getValue()['filter.id'] = items.goodId;
            this.goodService.getAll(this.params.getValue()).subscribe({
              next: response => {
                _data.push(response.data[0]);
                this.goodsWarehouse.clear();
                _data.forEach(async item => {
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
                    observations: [item?.observations],
                    transferentDestiny: [item?.saeDestiny],
                  });
                  this.goodsWarehouse.push(form);
                  this.formLoading = false;
                  this.headingWarehouse = `Almacén INDEP(${data.count})`;
                  this.showWarehouse = true;
                  this.formLoadingWarehouse = false;
                });
              },
              error: error => {
                this.formLoading = false;
                this.goodsWarehouse.clear();
                this.formLoadingWarehouse = false;
              },
            });
          });
        },
        error: error => {
          this.formLoadingWarehouse = false;
        },
      });
  }
  /*filterStatusWarehouse(data: IGoodProgramming[]) {
    const _data: any[] = [];
    const goodWarehouse = data.filter(items => {
      return items.status == 'EN_ALMACEN_TMP';
    });

    goodWarehouse.forEach(items => {
      this.params.getValue()['filter.id'] = items.goodId;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: response => {
          _data.push(response.data[0]);
          this.goodsWarehouse.clear();
          _data.forEach(async item => {
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
            await this.getDestinyIndep(item.saeDestiny);
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
            this.goodsWarehouse.push(form);
            this.formLoading = false;
            this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.length})`;
            this.showWarehouse = true;
          });
        },
        error: error => {
          this.formLoading = false;
          this.goodsWarehouse.clear();
        },
      });
    });
  } */

  getInfoReprog() {
    const _data: any[] = [];
    this.paramsReprogGoods.getValue()['filter.programmingId'] =
      this.programmingId;
    this.paramsReprogGoods.getValue()['filter.status'] = 'EN_PROGRAMACION_TMP';
    this.programmingService
      .getGoodsProgramming(this.paramsReprogGoods.getValue())
      .subscribe({
        next: async data => {
          this.totalItemsReprog = data.count;
          data.data.forEach(items => {
            this.params.getValue()['filter.id'] = items.goodId;
            this.goodService.getAll(this.params.getValue()).subscribe({
              next: response => {
                _data.push(response.data[0]);

                this.goodsReprog.clear();
                _data.forEach(async item => {
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
                    observations: [item?.observations],
                    regionalDelegationNumber: [item?.regionalDelegationNumber],
                  });
                  this.goodsReprog.push(form);
                  this.goodsReprog.updateValueAndValidity();
                  this.formLoading = false;
                  this.headingReprogramation = `Reprogramación(${this.goodsReprog.length})`;
                  this.formLoadingReprog = false;
                  this.formLoadingTrans = false;
                  this.showReprog = true;
                });
              },
              error: error => {
                this.formLoading = false;
                this.formLoadingReprog = false;
                this.formLoadingTrans = false;
                this.goodsReprog.clear();
              },
            });
          });
        },
        error: error => {},
      });
  }
  /*filterStatusReprog(data: IGoodProgramming[]) {
    const _data: any[] = [];
    const goodsReprog = data.filter(items => {
      return items.status == 'EN_PROGRAMACION_TMP';
    });

    goodsReprog.forEach(items => {
      this.params.getValue()['filter.id'] = items.goodId;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: response => {
          _data.push(response.data[0]);

          this.goodsReprog.clear();
          _data.forEach(async item => {
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
            await this.getDestinyIndep(item.saeDestiny);
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
            this.goodsReprog.push(form);
            this.goodsReprog.updateValueAndValidity();
            this.formLoading = false;
            this.headingReprogramation = `Reprogramación(${this.goodsReprog.length})`;
            this.formLoadingReprog = false;
            this.formLoadingTrans = false;
            this.showReprog = true;
          });
        },
        error: error => {
          this.formLoading = false;
          this.formLoadingReprog = false;
          this.formLoadingTrans = false;
          this.goodsReprog.clear();
        },
      });
    });
  } */

  getInfoCancel() {
    const _data: any[] = [];
    this.paramsCancelGoods.getValue()['filter.programmingId'] =
      this.programmingId;
    this.paramsCancelGoods.getValue()['filter.status'] = 'CANCELADO_TMP';
    this.programmingService
      .getGoodsProgramming(this.paramsCancelGoods.getValue())
      .subscribe({
        next: async data => {
          this.totalItemsCancelation = data.count;
          this.headingCancelation = `Cancelación(${data.count})`;
          this.goodsCancelation.clear();
          data.data.map(items => {
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
                    observations: [response?.observations],
                    regionalDelegationNumber: [
                      response?.regionalDelegationNumber,
                    ],
                  });
                  this.goodsCancelation;
                  this.goodsCancelation.push(form);
                  //this.goodsCancelation.updateValueAndValidity();
                  this.formLoading = false;

                  this.showCancel = true;
                });
              },
              error: error => {
                this.formLoading = false;
                this.goodsCancelation.clear();
              },
            });
          });
        },
        error: error => {},
      });
  }

  /*filterStatusCancelation(data: IGoodProgramming[]) {
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
            this.showCancel = true;
          });
        },
        error: error => {
          this.formLoading = false;
          this.goodsCancelation.clear();
        },
      });
    });
  } */

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
          this.alert('success', 'Bien actualizado correctamente', '');
          //this.getReportGoods();
        });
      }
    });
  }

  editGood(good: IGood) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      good,
      tranType: this.tranType,
      callback: (next: boolean) => {
        if (next) this.getInfoGoodsTransportable();
      },
    };

    this.modalService.show(EditGoodFormComponent, config);
  }

  editGoodReception(good: IGood) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      good,
      tranType: this.tranType,
      callback: (next: boolean) => {
        if (next) this.getInfoReception();
      },
    };

    this.modalService.show(EditGoodFormComponent, config);
  }

  editGoodGuard(good: IGood) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      good,
      tranType: this.tranType,
      callback: (next: boolean) => {
        if (next) this.getInfoGoodsGuard();
      },
    };

    this.modalService.show(EditGoodFormComponent, config);
  }

  editGoodWarehouse(good: IGood) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      good,
      tranType: this.tranType,
      callback: (next: boolean) => {
        if (next) this.getInfoWarehouse();
      },
    };

    this.modalService.show(EditGoodFormComponent, config);
  }

  editGoodReprog(good: IGood) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      good,
      tranType: this.tranType,
      callback: (next: boolean) => {
        if (next) this.getInfoReprog();
      },
    };

    this.modalService.show(EditGoodFormComponent, config);
  }

  editGoodCancel(good: IGood) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      good,
      tranType: this.tranType,
      callback: (next: boolean) => {
        if (next) this.getInfoCancel();
      },
    };

    this.modalService.show(EditGoodFormComponent, config);
  }

  updateInfo(data: IGood) {
    if (Number(data.quantity) < Number(data.quantitySae)) {
      this.alert(
        'error',
        'Error de captura',
        'La cantidad INDEP es mayor a la cantidad transferente'
      );
      this.count = 0;
    } else if (data.saePhysicalState == null) {
      this.alert(
        'error',
        'Error de captura',
        'Se debe capturar el estado físico INDEP'
      );
      this.count = 0;
    } else if (data.stateConservationSae == null) {
      this.alert(
        'error',
        'Error de captura',
        'Se debe capturar el estado de conservación  INDEP'
      );
      this.count = 0;
    } else {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea editar el bien?'
      ).then(question => {
        if (question.isConfirmed) {
          const info = {
            id: data.id,
            descriptionGoodSae: data.descriptionGoodSae,
            fileNumber: data.fileNumber,
            goodDescription: data.descriptionGood,
            goodId: data.goodId,
            physicalStatus: data.physicalStatus,
            quantity: data.quantity,
            quantitySae: data.quantitySae,
            regionalDelegationNumber: data.delegationNumber,
            saeMeasureUnit: data.saeMeasureUnit,
            saePhysicalState: data.saePhysicalState,
            stateConservation: data.stateConservation,
            stateConservationSae: data.stateConservationSae,
            uniqueKey: data.uniqueKey,
            unitMeasure: data.unitMeasure,
            saeDestiny: data.transferentDestiny,
          };

          this.goodService.updateByBody(info).subscribe({
            next: response => {
              this.alert(
                'success',
                'Correcto',
                'Bien actualizado correctamente'
              );
              //this.getInfoGoodsProgramming();
            },
            error: error => {},
          });
        }
      });
    }
  }

  //Bienes seleccionados//
  goodsSelects(data: any) {
    this.goodsSelect = data;
  }

  //Asignar acta a los bienes seleccionados//
  assingMinute() {
    if (this.selectGood.length > 0) {
      this.count = 0;
      this.selectGood.map((good: IGood) => {
        this.count = this.count + 1;
        if (
          Number(good.quantity) < Number(this.goodsGuards.value[0].quantitySae)
        ) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `La cantidad indep es mayor a la cantidad transferente ${good.goodId}`
            );
          }
        } else if (this.goodsGuards.value[0].saePhysicalState == null) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `Se debe capturar el estado físico indep en el bien ${good.goodId}`
            );
          }
        } else if (this.goodsGuards.value[0].stateConservationSae == null) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `Se debe capturar el estado de conservación indep ${good.goodId}`
            );
          }
        } else {
          if (this.count == 1) {
            this.alertQuestion(
              'warning',
              '¿Seguro que quiere asignar los bienes  a una acta?',
              'Acción irreversible',
              'Aceptar'
            ).then(async question => {
              if (question.isConfirmed) {
                const updateInfoGood = await this.updateInfoGoodAsignAct(good);
                if (updateInfoGood) {
                  this.checkExistAct('resguardo');
                  this.totalItemsGuard = 0;
                }
              }
            });
          }
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Se necesita tener un bien seleccionado'
      );
    }
  }

  updateInfoGoodAsignAct(data: IGood) {
    return new Promise((resolve, reject) => {
      const info = {
        id: data.id,
        descriptionGoodSae: data.descriptionGoodSae,
        fileNumber: data.fileNumber,
        goodDescription: data.descriptionGood,
        goodId: data.goodId,
        physicalStatus: data.physicalStatus,
        quantity: data.quantity,
        quantitySae: data.quantitySae,
        regionalDelegationNumber: data.delegationNumber,
        saeMeasureUnit: data.saeMeasureUnit,
        saePhysicalState: data.saePhysicalState,
        stateConservation: data.stateConservation,
        stateConservationSae: data.stateConservationSae,
        uniqueKey: data.uniqueKey,
        unitMeasure: data.unitMeasure,
        saeDestiny: data.transferentDestiny,
      };

      this.goodService.updateByBody(info).subscribe({
        next: response => {
          resolve(true);
          //this.getInfoGoodsProgramming();
        },
        error: error => {},
      });
    });
  }

  assingMinuteReprogramation() {
    this.count == 0;
    this.goodId = '';
    let saePhysical: boolean = false;
    let stateConservation: boolean = false;
    let _quantitySae: boolean = false;
    const saePhysicalState = this.goodsReprog.value.map((good: any) => {
      if (good.saePhysicalState == null) return good.goodId;
    });

    if (saePhysicalState.length > 0) {
      const filter = saePhysicalState.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `Se requiere capturar el estado físico INDEP en los bienes: ${this.goodId} `
        );
      } else {
        saePhysical = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      saePhysical = true;
    }

    //Validación estado de conservación
    this.count == 0;
    this.goodId = '';
    const stateConservationSae = this.goodsReprog.value.map((good: any) => {
      if (good.stateConservationSae == null) return good.goodId;
    });

    if (stateConservationSae.length > 0) {
      const filter = stateConservationSae.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `Se requiere capturar el estado de conservación INDEP en los bienes: ${this.goodId} `
        );
      } else {
        stateConservation = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      stateConservation = true;
    }

    //Validacion Cantidad//
    this.count == 0;
    this.goodId = '';
    const quantitySae = this.goodsReprog.value.map((good: any) => {
      if (Number(good.quantity) < Number(good.quantitySae)) return good.goodId;
    });
    if (quantitySae.length > 0) {
      const filter = quantitySae.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `La cantidad INDEP es mayor a la cantidad transferente en el Bien: ${this.goodId} `
        );
      } else {
        _quantitySae = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      _quantitySae = true;
    }

    if (saePhysical && stateConservation && _quantitySae) {
      this.count = 0;
      this.goodId = '';
      if (this.goodsReprog.value.length > 0) {
        this.alertQuestion(
          'warning',
          'Confirmación',
          '¿Desea asignar los bienes al acta?',
          'Aceptar'
        ).then(async question => {
          if (question.isConfirmed) {
            const updateGood = await this.updateGoodProgramming(
              'reprogramation'
            );
          }
        });
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'No se encontraron bienes para actualizar'
        );
      }
    }

    /*if (this.selectGood.length > 0) {
      this.count = 0;
      this.selectGood.map((good: IGood) => {
        this.count = this.count + 1;
        if (
          Number(good.quantity) < Number(this.goodsReprog.value[0].quantitySae)
        ) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `La cantidad indep es mayor a la cantidad transferente ${good.goodId}`
            );
          }
        } else if (this.goodsReprog.value[0].saePhysicalState == null) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `Se debe capturar el estado físico indep en el bien ${good.goodId}`
            );
          }
        } else if (this.goodsReprog.value[0].stateConservationSae == null) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `Se debe capturar el estado de conservación indep ${good.goodId}`
            );
          }
        } else if (this.goodsReprog.value[0].quantitySae == null) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `Se debe capturar la cantidad indep ${good.goodId}`
            );
          }
        } else {
          if (this.count == 1) {
            
          }
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Se necesita tener un bien seleccionado'
      );
    } */
  }

  assingMinuteCancelation() {
    if (this.selectGood.length > 0) {
      this.count = 0;
      this.selectGood.map((good: IGood) => {
        this.count = this.count + 1;
        if (
          Number(good.quantity) <
          Number(this.goodsCancelation.value[0].quantitySae)
        ) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `La cantidad indep es mayor a la cantidad transferente ${good.goodId}`
            );
          }
        } else if (this.goodsCancelation.value[0].saePhysicalState == null) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `Se debe capturar el estado físico indep en el bien ${good.goodId}`
            );
          }
        } else if (
          this.goodsCancelation.value[0].stateConservationSae == null
        ) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `Se debe capturar el estado de conservación indep ${good.goodId}`
            );
          }
        } else {
          if (this.count == 1) {
            this.alertQuestion(
              'warning',
              'Confirmación',
              '¿Seguro que quiere asignar los bienes  a una acta?',
              'Aceptar'
            ).then(async question => {
              if (question.isConfirmed) {
                const updateGood = await this.updateGoodProgramming(
                  'cancelalation'
                );
              }
            });
          }
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Se necesita tener un bien seleccionado'
      );
    }
    /*
    if (this.selectGood.length > 0) {
      this.count = 0;
      this.selectGood.map((good: IGood) => {
        this.count = this.count + 1;
        if (
          Number(good.quantity) <
          Number(this.goodsCancelation.value[0].quantitySae)
        ) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `La cantidad indep es mayor a la cantidad transferente ${good.goodId}`
            );
          }
        } else if (this.goodsCancelation.value[0].saePhysicalState == null) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `Se debe capturar el estado físico indep en el bien ${good.goodId}`
            );
          }
        } else if (
          this.goodsCancelation.value[0].stateConservationSae == null
        ) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `Se debe capturar el estado de conservación indep ${good.goodId}`
            );
          }
        } else if (this.goodsCancelation.value[0].quantitySae == null) {
          if (this.count == this.count) {
            this.alert(
              'error',
              'Error de captura',
              `Se debe capturar la cantidad indep ${good.goodId}`
            );
          }
        } else {
          if (this.count == 1) {
            this.alertQuestion(
              'warning',
              'Confirmación',
              '¿Seguro que quiere asignar los bienes  a una acta?',
              'Aceptar'
            ).then(async question => {
              if (question.isConfirmed) {
                const updateGood = await this.updateGoodProgramming(
                  'cancelalation'
                );
              }
            });
          }
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Se necesita tener un bien seleccionado'
      );
    } */
  }

  updateGoodProgramming(type: string) {
    if (type == 'reprogramation') {
      //Acta cerrada//
      if (this.proceedingOpen.length == 0) {
        const formData: IProceedings = {
          minutesId: 1,
          idPrograming: this.programming.id,
          statusProceeedings: 'ABIERTO',
        };
        this.proceedingService.createProceedings(formData).subscribe({
          next: async response => {
            this.proceedingOpenId = response.id;
          },
          error: error => {},
        });
        this.selectGood.map(item => {
          const formData: Object = {
            id: item.id,
            goodId: item.goodId,
            goodStatus: 'EN_PROGRAMACION',
            programmationStatus: 'EN_PROGRAMACION',
            executionStatus: 'EN_PROGRAMACION',
          };

          this.goodService.updateByBody(formData).subscribe({
            next: response => {
              const formData: Object = {
                programmingId: this.programming.id,
                goodId: item.id,
                status: 'EN_PROGRAMACION',
                actaId: this.proceedingOpenId,
              };
              this.programmingGoodService
                .updateGoodProgramming(formData)
                .subscribe({
                  next: response => {
                    this.selectGood = [];
                    this.goodsReprog.clear();

                    this.totalItemsReprog = 0;
                    this.paramsReprogGoods
                      .pipe(takeUntil(this.$unSubscribe))
                      .subscribe(() => this.getInfoReprog());
                    this.getOpenProceeding();
                    this.headingReprogramation = `Reprogramación(${this.goodsReprog.length})`;
                  },
                  error: error => {},
                });
            },
            error: error => {},
          });
        });
      } else {
        this.selectGood.map(item => {
          const formData: Object = {
            id: item.id,
            goodId: item.goodId,
            goodStatus: 'EN_PROGRAMACION',
            programmationStatus: 'EN_PROGRAMACION',
            executionStatus: 'EN_PROGRAMACION',
          };

          this.goodService.updateByBody(formData).subscribe({
            next: response => {
              const formData: Object = {
                programmingId: this.programming.id,
                goodId: item.id,
                status: 'EN_PROGRAMACION',
                actaId: this.proceedingOpen[0].id,
              };
              this.programmingGoodService
                .updateGoodProgramming(formData)
                .subscribe({
                  next: response => {
                    this.selectGood = [];
                    this.goodsReprog.clear();
                    this.paramsReprogGoods
                      .pipe(takeUntil(this.$unSubscribe))
                      .subscribe(() => this.getInfoReprog());
                    this.headingReprogramation = `Reprogramación(${this.goodsReprog.length})`;
                  },
                  error: error => {},
                });
            },
            error: error => {},
          });
        });
      }

      /*this.receipts.getElements().then(item => {
        const actId = item[0].actaId;
        this.selectGood.map(item => {
          const formData: Object = {
            id: item.id,
            goodId: item.goodId,
            goodStatus: 'EN_PROGRAMACION',
            programmationStatus: 'EN_PROGRAMACION',
            executionStatus: 'EN_PROGRAMACION',
          };

          this.goodService.updateByBody(formData).subscribe({
            next: response => {
              const formData: Object = {
                programmingId: this.programming.id,
                goodId: item.id,
                status: 'EN_PROGRAMACION',
                actaId: actId,
              };
              this.programmingGoodService
                .updateGoodProgramming(formData)
                .subscribe({
                  next: response => {
                    this.goodsReprog.clear();
                    this.showDataProgramming();
                    this.headingReprogramation = `Reprogramación(${this.goodsReprog.length})`;
                  },
                  error: error => {},
                });
            },
            error: error => {},
          });
        });
      }); */
    } else if (type == 'cancelalation') {
      //Acta cerrada//
      if (this.proceedingOpen.length == 0) {
        const formData: IProceedings = {
          minutesId: 1,
          idPrograming: this.programming.id,
          statusProceeedings: 'ABIERTO',
        };
        this.proceedingService.createProceedings(formData).subscribe({
          next: async response => {
            this.proceedingOpenId = response.id;
          },
          error: error => {},
        });
        this.selectGood.map(item => {
          const formData: Object = {
            id: item.id,
            goodId: item.goodId,
            goodStatus: 'CANCELADO',
            programmationStatus: 'CANCELADO',
            executionStatus: 'CANCELADO',
          };

          this.goodService.updateByBody(formData).subscribe({
            next: response => {
              const formData: Object = {
                programmingId: this.programming.id,
                goodId: item.id,
                status: 'CANCELADO',
                actaId: this.proceedingOpenId,
              };
              this.programmingGoodService
                .updateGoodProgramming(formData)
                .subscribe({
                  next: response => {
                    this.goodsCancelation.clear();
                    this.selectGood = [];
                    this.paramsCancelGoods
                      .pipe(takeUntil(this.$unSubscribe))
                      .subscribe(() => this.getInfoCancel());
                    this.getOpenProceeding();
                    this.totalItemsCancelation = 0;
                    this.headingCancelation = `Cancelación(${this.goodsCancelation.length})`;
                  },
                  error: error => {},
                });
            },
            error: error => {},
          });
        });
      } else {
        this.selectGood.map(item => {
          const formData: Object = {
            id: item.id,
            goodId: item.goodId,
            goodStatus: 'CANCELADO',
            programmationStatus: 'CANCELADO',
            executionStatus: 'CANCELADO',
          };

          this.goodService.updateByBody(formData).subscribe({
            next: response => {
              const formData: Object = {
                programmingId: this.programming.id,
                goodId: item.id,
                status: 'CANCELADO',
                actaId: this.proceedingOpen[0].id,
              };
              this.programmingGoodService
                .updateGoodProgramming(formData)
                .subscribe({
                  next: response => {
                    this.goodsCancelation.clear();
                    this.paramsCancelGoods
                      .pipe(takeUntil(this.$unSubscribe))
                      .subscribe(() => this.getInfoCancel());
                    this.selectGood = [];
                    this.headingCancelation = `Cancelación(${this.goodsCancelation.length})`;
                  },
                  error: error => {},
                });
            },
            error: error => {},
          });
        });
      }
    }
  }

  assingMinuteWarehouse() {
    if (this.selectGood.length > 0) {
      this.count = 0;
      this.goodId = '';
      this.selectGood.map((good: IGood) => {
        this.count = this.count + 1;
        this.goodId += good.id + ', ';
        if (
          Number(good.quantity) <
          Number(this.goodsWarehouse.value[0].quantitySae)
        ) {
          if (this.count == 1) {
            this.alert(
              'warning',
              'Advertencia',
              `La cantidad INDEP es mayor a la cantidad transferente en el Bien ${this.goodId}`
            );
          }
        } else if (this.goodsWarehouse.value[0].saePhysicalState == null) {
          if (this.count == 1) {
            this.alert(
              'warning',
              'Advertencia',
              `Se debe capturar el estado físico INDEP en el Bien ${this.goodId}`
            );
          }
        } else if (this.goodsWarehouse.value[0].stateConservationSae == null) {
          if (this.count == 1) {
            this.alert(
              'warning',
              'Advertencia',
              `Se debe capturar el estado de conservación INDEP ${this.goodId}`
            );
          }
        } else {
          if (this.count == 1) {
            this.alertQuestion(
              'question',
              '¿Seguro que quiere asignar los Bienes  a una acta?',
              'Acción irreversible',
              'Aceptar'
            ).then(question => {
              if (question.isConfirmed) {
                this.checkExistAct('almacen');
              }
            });
          }
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
      );
    }
    /*
    if (this.selectGood.length > 0) {
      this.count = 0;
      this.goodId = '';
      this.selectGood.map((good: IGood) => {
        this.count = this.count + 1;
        this.goodId += good.id + ', ';
        if (
          Number(good.quantity) <
          Number(this.goodsWarehouse.value[0].quantitySae)
        ) {
          if (this.count == 1) {
            this.alert(
              'warning',
              'Advertencia',
              `La cantidad INDEP es mayor a la cantidad transferente en el Bien ${this.goodId}`
            );
          }
        } else if (this.goodsWarehouse.value[0].saePhysicalState == null) {
          if (this.count == 1) {
            this.alert(
              'warning',
              'Advertencia',
              `Se debe capturar el estado físico INDEP en el Bien ${this.goodId}`
            );
          }
        } else if (this.goodsWarehouse.value[0].stateConservationSae == null) {
          if (this.count == 1) {
            this.alert(
              'warning',
              'Advertencia',
              `Se debe capturar el estado de conservación INDEP ${this.goodId}`
            );
          }
        } else {
          if (this.count == 1) {
            this.alertQuestion(
              'question',
              '¿Seguro que quiere asignar los Bienes  a una acta?',
              'Acción irreversible',
              'Aceptar'
            ).then(question => {
              if (question.isConfirmed) {
                this.checkExistAct('almacen');
              }
            });
          }
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
      );
    }
    */
  }

  async checkExistAct(type: string) {
    if (type == 'resguardo') {
      if (this.proceedingOpen.length == 0) {
        const formData: IProceedings = {
          minutesId: 1,
          idPrograming: this.programming.id,
          statusProceeedings: 'ABIERTO',
        };
        this.proceedingService.createProceedings(formData).subscribe({
          next: async response => {
            const createReceiptGood: any = await this.createReceiptGuard(
              response
            );

            if (createReceiptGood) {
              const createReceiptGoodGuard = await this.createReceiptGoodGuard(
                createReceiptGood
              );
              if (createReceiptGoodGuard) {
                const updateProgrammingGood = await this.updateProgGoodGuard(
                  response
                );
                if (updateProgrammingGood) {
                  const updateGood = await this.updateGoodGuard();
                  if (updateGood) {
                    this.goodsGuards.clear();
                    //this.headingGuard = `Resguardo(${this.goodsGuard.length})`;
                    this.getReceiptsGuard();
                    this.totalItemsGuard = 0;
                    this.paramsGuardGoods
                      .pipe(takeUntil(this.$unSubscribe))
                      .subscribe(() => this.getInfoGoodsGuard());
                    this.getOpenProceeding();
                    this.selectGood = [];
                    this.formLoadingGuard = false;
                  }
                }
              }
            }
          },
          error: error => {},
        });
      } else {
        const createReceiptGood: any = await this.createReceiptGuard(
          this.proceedingOpen[0]
        );

        if (createReceiptGood) {
          const createReceiptGoodGuard = await this.createReceiptGoodGuard(
            createReceiptGood
          );
          if (createReceiptGoodGuard) {
            const updateProgrammingGood = await this.updateProgGoodGuard(
              this.proceedingOpen[0]
            );
            if (updateProgrammingGood) {
              const updateGood = await this.updateGoodGuard();
              if (updateGood) {
                this.goodsGuards.clear();
                this.headingGuard = `Resguardo(${this.goodsGuard.length})`;
                this.getReceiptsGuard();
                this.paramsGuardGoods
                  .pipe(takeUntil(this.$unSubscribe))
                  .subscribe(() => this.getInfoGoodsGuard());
                this.selectGood = [];
                this.formLoadingGuard = false;
              }
            }
          }
        }
      }
    } else if (type == 'almacen') {
      if (this.proceedingOpen.length == 0) {
        const formData: IProceedings = {
          minutesId: 1,
          idPrograming: this.programming.id,
          statusProceeedings: 'ABIERTO',
        };
        this.proceedingService.createProceedings(formData).subscribe({
          next: async response => {
            const createReceiptGood: any = await this.createReceiptWarehouse(
              response
            );

            if (createReceiptGood) {
              const createReceiptGoodWarehouse =
                await this.createReceiptGoodWarehouse(createReceiptGood);
              if (createReceiptGoodWarehouse) {
                const updateProgrammingGood =
                  await this.updateProgGoodWarehouse(response);
                if (updateProgrammingGood) {
                  const updateGood = await this.updateGoodWarehouse();
                  if (updateGood) {
                    this.goodsWarehouse.clear();
                    this.totalItemsWarehouse = 0;
                    this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.length})`;
                    this.selectGood = [];
                    this.paramsGoodsWarehouse
                      .pipe(takeUntil(this.$unSubscribe))
                      .subscribe(() => this.getInfoWarehouse());
                    this.getOpenProceeding();
                    this.getReceiptsGuard();
                  }
                }
              }
            }
          },
          error: error => {},
        });
      } else {
        const createReceiptGood: any = await this.createReceiptWarehouse(
          this.proceedingOpen[0]
        );

        if (createReceiptGood) {
          const createReceiptGoodGuard = await this.createReceiptGoodWarehouse(
            createReceiptGood
          );
          if (createReceiptGoodGuard) {
            const updateProgrammingGood = await this.updateProgGoodWarehouse(
              this.proceedingOpen[0]
            );
            if (updateProgrammingGood) {
              const updateGood = await this.updateGoodWarehouse();
              if (updateGood) {
                this.goodsWarehouse.clear();
                this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.length})`;
                this.selectGood = [];
                this.paramsGoodsWarehouse
                  .pipe(takeUntil(this.$unSubscribe))
                  .subscribe(() => this.getInfoWarehouse());

                this.getReceiptsGuard();
              }
            }
          }
        }
      }
      /* console.log('this.receipts', this.receipts);
      if (this.receipts.count() > 0) {
        this.receipts.getElements().then(async receipt => {
          const createReceiptGood: any = await this.createReceiptWarehouse(
            receipt[0]
          );

          if (createReceiptGood) {
            const createReceiptGoodWarehouse =
              await this.createReceiptGoodWarehouse(createReceiptGood);
            if (createReceiptGoodWarehouse) {
              const updateProgrammingGood = await this.updateProgGoodWarehouse(
                receipt[0]
              );

              if (updateProgrammingGood) {
                const updateGood = await this.updateGoodWarehouse();
                if (updateGood) {
                  this.goodsWarehouse.clear();
                  this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.length})`;
                  this.getReceiptsGuard();
                  this.showDataProgramming();
                }
              }
            }
          }
        });
      } else {
        const formData: IProceedings = {
          minutesId: 1,
          idPrograming: this.programming.id,
          statusProceeedings: 'ABIERTO',
        };
        this.proceedingService.createProceedings(formData).subscribe({
          next: async response => {
            const createKeyAct = await this.createKeyAct(response);

            if (createKeyAct == true) {
              const createReceiptGood: any =
                await this.createReceiptWarehouseNewAct(response);
              if (createReceiptGood) {
                const createReceiptGoodGuard =
                  await this.createReceiptGoodWarehouse(createReceiptGood);

                if (createReceiptGoodGuard) {
                  const updateProgrammingGood =
                    await this.updateProgGoodWarehouseNewAct(response);

                  if (updateProgrammingGood) {
                    const updateGood = await this.updateGoodWarehouse();
                    this.goodsWarehouse.clear();
                    this.headingWarehouse = `Almacén(${this.goodsWarehouse.length})`;
                    this.getReceiptsGuard();
                    this.showDataProgramming();
                    this.formLoadingGuard = false;
                  }
                }
              }
            }
          },
          error: error => {},
        }); 
      } */
    }
  }

  createKeyAct(act: IProceedings) {
    return new Promise((resolve, reject) => {
      this.regionalDelegationService
        .getById(this.programming.regionalDelegationNumber)
        .subscribe(data => {
          this.delegationDes = data.description;

          this.transferentService
            .getById(this.programming.tranferId)
            .subscribe(data => {
              this.keyTransferent = data.keyTransferent;
              const month = moment(new Date()).format('MM');
              const year = moment(new Date()).format('YY');
              const keyProceeding =
                this.delegationDes +
                '-' +
                this.keyTransferent +
                '-' +
                this.programming.id +
                '-' +
                `A${act.id}` +
                '-' +
                year +
                '-' +
                month;

              const receiptform = {
                id: act.id,
                idPrograming: this.programming.id,
                folioProceedings: keyProceeding,
              };

              this.proceedingService.updateProceeding(receiptform).subscribe({
                next: () => {
                  resolve(true);
                },
              });
            });
        });
    });
  }

  createReceiptGuardNewAct(proceeding: IProceedings) {
    return new Promise((resolve, reject) => {
      const formData = {
        programmingId: this.programmingId,
        actId: proceeding.id,
        typeReceipt: 'RESGUARDO',
        statusReceiptGuard: 'ABIERTO',
        receiptDate: new Date(),
      };
      this.receptionGoodService.createReception(formData).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {},
      });
    });
  }

  createReceiptGuard(proceeding: IProceedings) {
    return new Promise((resolve, reject) => {
      const formData = {
        programmingId: this.programmingId,
        actId: proceeding.id,
        typeReceipt: 'RESGUARDO',
        statusReceiptGuard: 'ABIERTO',
        receiptDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ssZ'),
      };

      this.receptionGoodService.createReception(formData).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {},
      });
    });
  }

  createReceiptWarehouse(proceeding: IProceedings) {
    return new Promise((resolve, reject) => {
      const formData = {
        programmingId: this.programmingId,
        actId: proceeding.id,
        typeReceipt: 'ALMACEN',
        statusReceiptGuard: 'ABIERTO',
        receiptDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ssZ'),
      };
      this.receptionGoodService.createReception(formData).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {},
      });
    });
  }

  createReceiptWarehouseNewAct(proceeding: IProceedings) {
    return new Promise((resolve, reject) => {
      const formData = {
        programmingId: this.programmingId,
        actId: proceeding.id,
        typeReceipt: 'ALMACEN',
        statusReceiptGuard: 'ABIERTO',
        receiptDate: new Date(),
      };
      this.receptionGoodService.createReception(formData).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {},
      });
    });
  }

  createReceiptGoodGuard(receiptGuard: any) {
    return new Promise((resolve, reject) => {
      this.selectGood.map(item => {
        const formData = {
          receiptGuardId: receiptGuard.id,
          idGood: item.goodId,
          typeReceipt: 'RESGUARDO',
        };

        this.receptionGoodService.createReceiptGoodGuard(formData).subscribe({
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

  createReceiptGoodWarehouse(receiptGuard: any) {
    return new Promise((resolve, reject) => {
      this.selectGood.map(item => {
        const formData = {
          receiptGuardId: receiptGuard.id,
          idGood: item.goodId,
          typeReceipt: 'ALMACEN',
        };
        this.receptionGoodService.createReceiptGoodGuard(formData).subscribe({
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

  updateProgGoodGuard(proceeding: IProceedings) {
    return new Promise((resolve, reject) => {
      this.selectGood.map(item => {
        const formData: Object = {
          programmingId: this.programming.id,
          actaId: proceeding.id,
          goodId: item.goodId,
          status: 'EN_RESGUARDO',
        };

        this.programminGoodService.updateGoodProgramming(formData).subscribe({
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

  updateProgGoodGuardNewAct(proceeding: IProceedings) {
    return new Promise((resolve, reject) => {
      this.selectGood.map(item => {
        const formData: Object = {
          programmingId: this.programming.id,
          actaId: proceeding.id,
          goodId: item.goodId,
          status: 'EN_RESGUARDO',
        };

        this.programminGoodService.updateGoodProgramming(formData).subscribe({
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

  updateProgGoodWarehouse(proceeding: IProceedings) {
    return new Promise((resolve, reject) => {
      this.selectGood.map(item => {
        const formData: Object = {
          programmingId: this.programming.id,
          actaId: proceeding.id,
          goodId: item.goodId,
          status: 'EN_ALMACEN',
        };

        this.programminGoodService.updateGoodProgramming(formData).subscribe({
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
  updateProgGoodWarehouseNewAct(proceeding: IProceedings) {
    return new Promise((resolve, reject) => {
      this.selectGood.map(item => {
        const formData: Object = {
          programmingId: this.programming.id,
          actaId: proceeding.id,
          goodId: item.goodId,
          status: 'EN_ALMACEN',
        };

        this.programminGoodService.updateGoodProgramming(formData).subscribe({
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

  updateGoodGuard() {
    return new Promise((resolve, reject) => {
      this.selectGood.map(item => {
        const formData: Object = {
          id: item.id,
          goodId: item.goodId,
          goodStatus: 'EN_RESGUARDO',
          programmationStatus: 'EN_RESGUARDO',
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

  updateGoodWarehouse() {
    return new Promise((resolve, reject) => {
      this.selectGood.map(item => {
        const formData: Object = {
          id: item.id,
          goodId: item.goodId,
          goodStatus: 'EN_ALMACEN',
          programmationStatus: 'EN_ALMACEN',
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

  //Bienes asociados a recibo
  showGoodsReceiptGuard(receipt: IReceipt) {
    let config = {
      ...MODAL_CONFIG,
      class: 'modalSizeXL modal-dialog-centered',
    };
    config.initialState = {
      receipt,
      type: 'guard',
      callBack: (data: boolean) => {},
    };

    this.modalService.show(GoodsReceiptsFormComponent, config);
  }

  showGoodsReceiptWarehouse(receipt: IReceipt) {
    let config = {
      ...MODAL_CONFIG,
      class: 'modalSizeXL modal-dialog-centered',
    };
    config.initialState = {
      receipt,
      type: 'warehouse',
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
      receiptGuards: receipt,
      proceess: 'guard',
      programming: this.programming,
      callback: (receiptGuards: any) => {
        this.openReport(receiptGuards, 185);
      },
    };

    this.modalService.show(GenerateReceiptGuardFormComponent, config);
  }

  openReport(receiptGuards: any, typeDoc: number) {
    if (typeDoc == 185) {
      const idTypeDoc = 185;
      let config: ModalOptions = {
        initialState: {
          idTypeDoc,
          programming: this.programming,
          receiptGuards: receiptGuards,
          callback: (next: boolean) => {
            if (next) {
              this.uploadData(receiptGuards, idTypeDoc);
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowReportComponentComponent, config);
    } else if (typeDoc == 186) {
      const idTypeDoc = 186;
      let config: ModalOptions = {
        initialState: {
          idTypeDoc,
          programming: this.programming,
          receiptGuards: receiptGuards,
          guardReception: this.goodsReception,
          callback: (next: boolean) => {
            if (next) {
              this.uploadData(receiptGuards, idTypeDoc);
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowReportComponentComponent, config);
    }
  }

  uploadData(receiptGuards: any, idTypeDoc: number): void {
    if (idTypeDoc == 185) {
      let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
      config.initialState = {
        receiptGuards: receiptGuards,
        guardReception: this.goodsReception,
        typeDoc: 185,
        programming: this.programming,
        callback: (data: boolean) => {
          if (data) {
            this.getReceiptsGuard();
            this.receiptGuards = new LocalDataSource();
          }
        },
      };

      this.modalService.show(UploadReportReceiptComponent, config);
    } else if (idTypeDoc == 186) {
      let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
      config.initialState = {
        receiptGuards: receiptGuards,
        guardReception: this.goodsReception,
        typeDoc: 186,
        programming: this.programming,
        callback: (data: boolean) => {
          if (data) {
            this.getReceiptsGuard();
            this.receiptWarehouse = new LocalDataSource();
          }
        },
      };

      this.modalService.show(UploadReportReceiptComponent, config);
    }
  }

  generateReceiptWarehouse(receipt: IReceipt) {
    const receiptId = receipt.id;
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      receiptId,
      receiptGuards: receipt,
      proceess: 'warehouse',
      programming: this.programming,
      callback: (receiptGuards: any) => {
        this.openReport(receiptGuards, 186);
      },
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
            this.selectGood = [];
          },
        },
        class: `modalSizeXL modal-dialog-centered`,
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowDocumentsGoodComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
      );
    }
  }

  uploadPicture() {
    if (this.goodIdSelect) {
      let config = {
        ...MODAL_CONFIG,
        class: 'modalSizeXL modal-dialog-centered ',
      };
      config.initialState = {
        good: this.goodIdSelect,
        programming: this.programming,
        callback: (next: boolean) => {
          if (next) {
            this.selectGood = [];
          }
        },
      };
      this.modalService.show(PhotographyFormComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
      );
    }
  }

  createReceipt(data: any) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      proceeding: data,
      idProgramming: this.programmingId,
      programming: this.programming,

      callback: (receipt: IProceedings, keyDoc: string, typeFirm: string) => {
        if (receipt && keyDoc) {
          this.openReportReceipt(receipt, keyDoc, typeFirm);
        }
      },
    };

    this.modalService.show(GenerateReceiptFormComponent, config);
  }

  openReportReceipt(_receipt: IProceedings, keyDoc: string, typeFirm: string) {
    const idTypeDoc = 103;
    const idProg = this.programmingId;
    const receiptId = _receipt.id;
    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        idTypeDoc,
        idProg,
        receiptId,
        keyDoc,
        receipt: _receipt,
        programming: this.programming,
        typeFirm,
        guardReception: this.goodsReception,
        callback: (next: boolean) => {
          if (next) {
            this.goodsReception.clear();
            if (typeFirm != 'electronica') {
              this.uplodadReceiptDelivery();
            } else {
              this.getReceipts();
              this.paramsReception
                .pipe(takeUntil(this.$unSubscribe))
                .subscribe(() => this.getInfoReception());
              this.goodsReception.clear();
              this.totalItemsReception = 0;
              this.goodsSelect = [];
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReportComponentComponent, config);
  }

  uplodadReceiptDelivery() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      receiptGuards: this.receiptGuards,
      guardReception: this.goodsReception,
      typeDoc: 103,
      programming: this.programming,
      callback: (data: boolean) => {
        if (data) {
          this.getReceipts();
          this.paramsReception
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getInfoReception());
          this.goodsReception.clear();
          this.totalItemsReception = 0;
          this.goodsSelect = [];
        }
      },
    };

    this.modalService.show(UploadReportReceiptComponent, config);
  }

  assignReceipt() {
    if (this.selectGood.length > 0) {
      this.count = 0;
      this.goodId = '';
      this.selectGood.map((good: IGood) => {
        this.count = this.count + 1;
        this.goodId += good.id + ', ';
        if (
          Number(good.quantity) <
          Number(this.goodsTransportable.value[0].quantitySae)
        ) {
          if (this.count == 1) {
            this.alert(
              'warning',
              'Advertencia',
              `La cantidad INDEP es mayor a la cantidad transferente en el Bien ${this.goodId}`
            );
          }
        } else if (this.goodsTransportable.value[0].saePhysicalState == null) {
          if (this.count == 1) {
            this.alert(
              'warning',
              'Advertencia',
              `Se debe capturar el estado físico INDEP en el Bien ${this.goodId}`
            );
          }
        } else if (
          this.goodsTransportable.value[0].stateConservationSae == null
        ) {
          if (this.count == 1) {
            this.alert(
              'warning',
              'Advertencia',
              `Se debe capturar el estado de conservación INDEP ${this.goodId}`
            );
          }
        } else {
          if (this.count == 1) {
            let config = {
              ...MODAL_CONFIG,
              class: 'modal-lg modal-dialog-centered',
            };
            config.initialState = {
              programming: this.programming,
              selectGoods: this.selectGood,
              callback: (data: boolean) => {
                if (data) {
                  this.selectGood = [];
                  this.goodsTransportable.clear();
                  this.getReceipts();
                  this.getOpenProceeding();
                  this.totalItemsTransportableGoods = 0;
                  this.paramsTransportableGoods
                    .pipe(takeUntil(this.$unSubscribe))
                    .subscribe(() => this.getInfoGoodsTransportable());

                  this.paramsReception
                    .pipe(takeUntil(this.$unSubscribe))
                    .subscribe(() => this.getInfoReception());
                }
              },
            };

            this.modalService.show(AssignReceiptFormComponent, config);
          }
        }
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
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
          await this.changeStatusGoodTran(item);
        },
        error: error => {},
      });
    });
  }

  sendGoodGuard() {
    if (this.selectGood.length > 0) {
      this.selectGood.map((item: any) => {
        this.goodsTransportable.clear();
        const formData: Object = {
          programmingId: this.programmingId,
          goodId: item.id,
          status: 'EN_RESGUARDO_TMP',
        };
        this.programmingGoodService.updateGoodProgramming(formData).subscribe({
          next: async response => {
            await this.changeStatusGoodTran(item);
          },
          error: error => {},
        });
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
      );
    }
  }

  sendWarehouse() {
    if (this.selectGood.length > 0) {
      this.selectGood.map((item: any) => {
        this.goodsTransportable.clear();
        const formData: Object = {
          programmingId: this.programmingId,
          goodId: item.id,
          status: 'EN_ALMACEN_TMP',
        };
        this.programmingGoodService.updateGoodProgramming(formData).subscribe({
          next: async response => {
            await this.changeStatusGoodWarehouse(item);
          },
          error: error => {},
        });
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
      );
    }
  }

  changeStatusGoodReceipt() {
    return new Promise(async (resolve, reject) => {
      this.goodsReception.clear();
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
      const showGoods: any = await this.getFilterGood('EN_RECEPCION_TMP');
      if (showGoods) {
        this.showDataProgramming();
        this.goodIdSelect = null;
        this.selectGood = [];
        this.selectGood = [];
        resolve(true);
      }
    });
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
      const showGoods: any = await this.getFilterGood('EN_RESGUARDO_TMP');
      if (showGoods) {
        this.showDataProgramming();
        this.goodIdSelect = null;
        this.selectGood = [];
        this.headingGuard = `Resguardo(${this.goodsGuards.length})`;
      }
    });
  }

  searchGood() {
    const goodsTransportable = this.goodsTransportable.value;
    const goodsTransportableCopy = this.goodsTransportable.value;

    const filterGood = goodsTransportableCopy.filter((item: any) => {
      return item.id == this.searchGoodForm.get('goodId').value;
    });

    if (filterGood.length > 0) {
      const _data: any[] = [];
      filterGood.forEach((item: IGood) => {
        this.params.getValue()['filter.id'] = item.goodId;
        this.goodService.getAll(this.params.getValue()).subscribe({
          next: response => {
            _data.push(response.data[0]);
            this.goodsTransportable.clear();
            _data.forEach(async item => {
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
                destiny: [item?.destiny],
                transferentDestiny: [item?.saeDestiny],
                observations: [item?.observations],
              });
              this.goodsTransportable.push(form);
              this.formLoadingTrans = false;
              this.showTransportable = true;
            });
          },
          error: error => {
            this.formLoadingTrans = false;
          },
        });
      });
    }
  }

  changeStatusGoodProg(good: IGood) {
    return new Promise(async (resolve, reject) => {
      this.goodsReprog.clear();
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

      const showGoods: any = await this.getFilterGood('EN_PROGRAMACION_TMP');
      if (showGoods) {
        this.showDataProgramming();
        this.goodIdSelect = null;
        this.selectGood = [];
        this.headingReprogramation = `Reprogramación(${this.goodsReprog.length})`;
      }
    });
  }

  cancel() {
    this.goodsTransportable.clear();
    this.searchGoodForm.reset();
    this.showDataProgramming();
  }

  changeStatusGoodWarehouse(good: IGood) {
    return new Promise(async (resolve, reject) => {
      this.goodsWarehouse.clear();
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
      const showGoods: any = await this.getFilterGood('EN_ALMACEN_TMP');
      if (showGoods) {
        this.showDataProgramming();
        this.goodIdSelect = null;
        this.selectGood = [];
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
      const showGoods: any = await this.getFilterGood('EN_CANCELACION_TMP');
      if (showGoods) {
        this.showDataProgramming();
        this.goodIdSelect = null;
        this.selectGood = [];
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
    if (this.selectGood.length > 0) {
      let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

      config.initialState = {
        goodSelect: this.selectGood,
        programming: this.programming,
        callback: (next: boolean) => {
          if (next) {
            this.goodsTransportable.clear();
            this.selectGood = [];
            this.showDataProgramming();
          }
        },
      };

      this.modalService.show(ReschedulingFormComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
      );
    }
  }

  showGood(data: IGood) {
    let config: ModalOptions = {
      initialState: {
        showTDR: true,
        goodId: data.goodId,
        programming: this.programming,
        callback: (next: boolean) => {
          if (next) {
          }
        },
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReportComponentComponent, config);
  }

  delete(receipt: IReceipt) {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea eliminar el recibo?'
    ).then(question => {
      if (question.isConfirmed) {
        const formProce = {
          id: receipt.actId,
        };

        this.proceedingService.deleteProceeding(formProce).subscribe({
          next: response => {
            const formData: Object = {
              id: receipt.id,
              actId: receipt.actId,
              programmingId: receipt.programmingId,
            };
            this.receptionGoodService.deleteReceipt(formData).subscribe({
              next: response => {
                this.getReceipts();
              },
              error: error => {},
            });
          },
        });
      }
    });
  }

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
          error: error => {},
        });
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
      );
    }
  }

  deleteGoodReceipt() {
    if (this.goodIdSelect > 0) {
      this.selectGood.map((item: any) => {
        const formData: Object = {
          programmingId: this.programmingId,
          goodId: item.id,
          actaId: null,
          status: 'EN_TRANSPORTABLE',
        };
        this.programmingGoodService.updateGoodProgramming(formData).subscribe({
          next: async response => {
            await this.changeStatusGoodReceipt();
            await this.deleteReceipt();
            this.selectGood = [];
            this.goodIdSelect = null;
          },
          error: error => {},
        });
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
      );
    }
  }

  deleteReceipt() {
    this.selectGood.map((item: any) => {
      const data = {
        programmationId: this.programmingId,
        goodId: item.goodId,
      };
      this.receptionGoodService.getReceiptGoodByIds(data).subscribe({
        next: response => {
          const deleteObject = {
            receiptId: response.receiptId,
            goodId: response.goodId,
            programmationId: response.programmationId,
            actId: response.actId,
          };

          this.receptionGoodService.deleteReceiptGood(deleteObject).subscribe({
            next: response => {},
          });
        },
      });
    });

    /*
    if (this.goodIdSelect > 0) {
      this.selectGood.map((item: any) => {
        console.log('item', item);
        const formData = {
          receiptId: item.id,
          goodId: item.goodId,
          programmationId: 8450,
          actId: 112,
        };
        //this.receptionGoodService.deleteReceipt()
      });
    } */
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
            await this.changeStatusGoodProg(item);
          },
          error: error => {},
        });
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
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
          error: error => {},
        });
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
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
          error: error => {},
        });
      });
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
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
            this.showDataProgramming();
          },
        });
      });
    });
  }

  showReceipt(receipt: IReceipt) {
    this.wcontentService.obtainFile(receipt.contentId).subscribe({
      next: response => {
        let blob = this.dataURItoBlob(response);
        let file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.openPrevPdf(fileURL);
      },
      error: error => {},
    });
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

  openPrevPdf(pdfUrl: string) {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  cancelGood() {
    if (this.selectGood.length > 0) {
      let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

      config.initialState = {
        goodSelect: this.selectGood,
        programming: this.programming,
        callback: (next: boolean) => {
          if (next) {
            this.goodsTransportable.clear();
            this.selectGood = [];
            this.showDataProgramming();
          }
        },
      };
      this.modalService.show(CancelationGoodFormComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción inválida',
        'Necesitas tener un bien seleccionado'
      );
    }
  }

  aprobateReception() {
    let message: string = '';
    let banError: boolean = false;
    this.receipts.getElements().then(data => {
      data.map((receipt: IReceipt) => {
        if (receipt?.statusReceipt == 'ABIERTO' && !banError) {
          message += 'Es necesario tener todos los recibos cerrados';
          banError = true;
        }
      });
    });

    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
      next: async response => {
        this.goodsProgramming = response.data;
        //Filtramos bienes tranportables
        const goodsTransportable = this.goodsProgramming.filter(good => {
          return good.status == 'EN_TRANSPORTABLE';
        });
        if (goodsTransportable.length > 0 && !banError) {
          message +=
            'Es necesario no tener bienes en el apartado Transportables';
          banError = true;
        }

        const goodsGuard = this.goodsProgramming.filter(good => {
          return good.status == 'EN_RESGUARDO_TMP';
        });

        if (goodsGuard.length > 0 && !banError) {
          message += 'Es necesario tener todos los bienes asignados a una acta';
          banError = true;
        }

        const goodsWarehouse = this.goodsProgramming.filter(good => {
          return good.status == 'EN_ALMACEN_TMP';
        });

        if (goodsWarehouse.length > 0 && !banError) {
          message += 'Es necesario tener todos los bienes asignados a una acta';
          banError = true;
        }

        const goodsReprog = this.goodsProgramming.filter(good => {
          return good.status == 'EN_PROGRAMACION_TMP';
        });

        if (goodsReprog.length > 0 && !banError) {
          message += 'Es necesario tener todos los bienes asignados a una acta';
          banError = true;
        }

        const goodsCancel = this.goodsProgramming.filter(good => {
          return good.status == 'CANCELADO_TMP';
        });

        if (goodsCancel.length > 0 && !banError) {
          message += 'Es necesario tener todos los bienes asignados a una acta';
          banError = true;
        }

        if (banError) {
          this.alert('error', 'Error', `${message}`);
        } else if (!banError) {
          this.alertQuestion(
            'question',
            'Confirmación',
            '¿Desea terminar la ejecución de recepción?'
          ).then(question => {
            if (question.isConfirmed) {
              const formData: Object = {
                termEjecutionDate: new Date(),
              };
              this.programmingService
                .updateProgramming(this.programmingId, formData)
                .subscribe({
                  next: async () => {
                    //Cierra la tarea//
                    const _task = JSON.parse(localStorage.getItem('Task'));
                    const user: any = this.authService.decodeToken();
                    let body: any = {};
                    body['idTask'] = _task.id;
                    body['userProcess'] = user.username;
                    body['type'] = 'SOLICITUD_PROGRAMACION';
                    body['subtype'] = 'Ejecutar_Recepcion';
                    body['ssubtype'] = 'ACCEPT';

                    const closeTask = await this.closeTaskExecuteRecepcion(
                      body
                    );
                    if (closeTask) {
                      this.alert(
                        'success',
                        'Acción correcta',
                        'Se cerro la tarea ejecutar recepción correctamente'
                      );

                      this.router.navigate([
                        'pages/siab-web/sami/consult-tasks',
                      ]);
                    }
                  },
                });
            }
          });
        }
      },
      error: error => {},
    });
  }

  closeTaskExecuteRecepcion(body: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          this.alert('error', 'Error', 'No se pudo crear la tarea');
          reject(false);
        },
      });
    });
  }

  close() {
    this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
  }

  saveInfoGoodReception() {
    this.count = 0;
    this.goodsReception.value.map((good: IGood) => {
      this.count = this.count + 1;
      if (Number(good.quantity) < Number(good.quantitySae)) {
        if (this.count == 1) {
          this.alert(
            'error',
            `Error de captura`,
            `La cantidad indep es mayor a la cantidad transferente en el bien ${good.goodId}`
          );
        }
      } else if (good.saePhysicalState == null) {
        if (this.count == 1) {
          this.alert(
            'error',
            'Error de captura',
            `Se debe capturar el estado físico indep en el bien ${good.goodId}`
          );
        }
      } else if (good.stateConservationSae == null) {
        if (this.count == 1) {
          this.alert(
            'error',
            'Error de captura',
            `Se debe capturar el estado de conservación indep en el bien ${good.goodId}`
          );
        }
      } else {
        this.count = 0;
        if (this.goodsReception.value.length > 0) {
          this.alertQuestion(
            'question',
            'Confirmación',
            '¿Desea editar el bien?'
          ).then(question => {
            if (question.isConfirmed) {
              this.goodsReception.value.map((good: IGood) => {
                this.count = this.count + 1;
                const info = {
                  id: good.id,
                  descriptionGoodSae: good.descriptionGoodSae,
                  fileNumber: good.fileNumber,
                  goodDescription: good.descriptionGood,
                  goodId: good.goodId,
                  physicalStatus: good.physicalStatus,
                  quantity: good.quantity,
                  quantitySae: good.quantitySae,
                  regionalDelegationNumber: good.delegationNumber,
                  saeMeasureUnit: good.saeMeasureUnit,
                  saePhysicalState: good.saePhysicalState,
                  stateConservation: good.stateConservation,
                  stateConservationSae: good.stateConservationSae,
                  uniqueKey: good.uniqueKey,
                  unitMeasure: good.unitMeasure,
                  saeDestiny: good.transferentDestiny,
                };
                if (this.count == 1) {
                  this.alert(
                    'success',
                    'Correcto',
                    'Bien actualizado correctamente'
                  );
                }
                this.goodService.updateByBody(info).subscribe({
                  next: () => {},
                  error: error => {},
                });
              });
            }
          });
        } else {
          this.alert(
            'warning',
            'Acción Invalida',
            'No se encontraron bienes para actualizar'
          );
        }
      }
    });
  }

  saveInfoGoodTransportable() {
    this.count == 0;
    this.goodId = '';
    let saePhysical: boolean = false;
    let stateConservation: boolean = false;
    let _quantitySae: boolean = false;
    const saePhysicalState = this.goodsTransportable.value.map((good: any) => {
      if (good.saePhysicalState == null) return good.goodId;
    });

    if (saePhysicalState.length > 0) {
      const filter = saePhysicalState.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `Se requiere capturar el estado físico INDEP en los bienes: ${this.goodId} `
        );
      } else {
        saePhysical = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      saePhysical = true;
    }

    //Validación estado de conservación
    this.count == 0;
    this.goodId = '';
    const stateConservationSae = this.goodsTransportable.value.map(
      (good: any) => {
        if (good.stateConservationSae == null) return good.goodId;
      }
    );

    if (stateConservationSae.length > 0) {
      const filter = stateConservationSae.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `Se requiere capturar el estado de conservación INDEP en los bienes: ${this.goodId} `
        );
      } else {
        stateConservation = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      stateConservation = true;
    }

    //Validacion Cantidad//
    this.count == 0;
    this.goodId = '';
    const quantitySae = this.goodsTransportable.value.map((good: any) => {
      if (Number(good.quantity) < Number(good.quantitySae)) return good.goodId;
    });
    if (quantitySae.length > 0) {
      const filter = quantitySae.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `La cantidad INDEP es mayor a la cantidad transferente en el Bien: ${this.goodId} `
        );
      } else {
        _quantitySae = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      _quantitySae = true;
      this.count == 0;
      this.goodId = '';
    }

    if (saePhysical && stateConservation && _quantitySae) {
      this.count = 0;
      this.goodId = '';
      if (this.goodsTransportable.value.length > 0) {
        this.alertQuestion(
          'question',
          'Confirmación',
          '¿Desea editar el bien?'
        ).then(question => {
          if (question.isConfirmed) {
            this.goodsTransportable.value.map((good: IGood) => {
              this.count = this.count + 1;
              const info = {
                id: good.id,
                descriptionGoodSae: good.descriptionGoodSae,
                fileNumber: good.fileNumber,
                goodDescription: good.descriptionGood,
                goodId: good.goodId,
                physicalStatus: good.physicalStatus,
                quantity: good.quantity,
                quantitySae: good.quantitySae,
                regionalDelegationNumber: good.delegationNumber,
                saeMeasureUnit: good.saeMeasureUnit,
                saePhysicalState: good.saePhysicalState,
                stateConservation: good.stateConservation,
                stateConservationSae: good.stateConservationSae,
                uniqueKey: good.uniqueKey,
                unitMeasure: good.unitMeasure,
                saeDestiny: good.transferentDestiny,
              };

              if (this.count == 1) {
                this.alert(
                  'success',
                  'Correcto',
                  'Bien actualizado correctamente'
                );
              }
              this.goodService.updateByBody(info).subscribe({
                next: () => {},
                error: error => {},
              });
            });
          }
        });
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'No se encontraron bienes para actualizar'
        );
      }
    }

    /*
    this.count = 0;
    this.goodsTransportable.value.map((good: IGood) => {
      this.count = this.count + 1;
      if (Number(good.quantity) < Number(good.quantitySae)) {
        if (this.count == 1) {
          this.alert(
            'error',
            `Error de captura`,
            `La cantidad indep es mayor a la cantidad transferente en el bien ${good.goodId}`
          );
        }
      } else if (good.saePhysicalState == null) {
        if (this.count == ) {
          this.alert(
            'error',
            'Error de captura',
            `Se debe capturar el estado físico indep en el bien ${good.goodId}`
          );
        }
      } else if (good.stateConservationSae == null) {
        if (this.count == 1) {
          this.alert(
            'error',
            'Error de captura',
            `Se debe capturar el estado de conservación indep en el bien ${good.goodId}`
          );
        }
      } else {
       
      }
    }); */
  }

  saveInfoGoodGuard() {
    this.count == 0;
    this.goodId = '';
    let saePhysical: boolean = false;
    let stateConservation: boolean = false;
    let _quantitySae: boolean = false;
    const saePhysicalState = this.goodsGuards.value.map((good: any) => {
      if (good.saePhysicalState == null) return good.goodId;
    });

    if (saePhysicalState.length > 0) {
      const filter = saePhysicalState.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción no Permitida',
          `Se requiere capturar el estado físico INDEP en los bienes: ${this.goodId} `
        );
      } else {
        saePhysical = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      saePhysical = true;
    }

    this.count == 0;
    this.goodId = '';

    const stateConservationSae = this.goodsGuards.value.map((good: any) => {
      if (good.stateConservationSae == null) return good.goodId;
    });

    if (stateConservationSae.length > 0) {
      const filter = stateConservationSae.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `Se requiere capturar el estado de conservación INDEP en los bienes: ${this.goodId} `
        );
      } else {
        stateConservation = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      stateConservation = true;
    }
    //Cantidad
    this.count == 0;
    this.goodId = '';
    const quantitySae = this.goodsGuards.value.map((good: any) => {
      if (Number(good.quantity) < Number(good.quantitySae)) return good.goodId;
    });
    if (quantitySae.length > 0) {
      const filter = quantitySae.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `La cantidad INDEP es mayor a la cantidad transferente en el Bien: ${this.goodId} `
        );
      } else {
        _quantitySae = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      _quantitySae = true;
      this.count == 0;
      this.goodId = '';
    }
    this.count == 0;
    this.goodId = '';
    if (saePhysical && stateConservation && _quantitySae) {
      if (this.goodsGuards.value.length > 0) {
        this.alertQuestion(
          'question',
          'Confirmación',
          '¿Desea editar el bien?'
        ).then(question => {
          if (question.isConfirmed) {
            this.goodsGuards.value.map((good: IGood) => {
              this.count = this.count + 1;
              const info = {
                id: good.id,
                descriptionGoodSae: good.descriptionGoodSae,
                fileNumber: good.fileNumber,
                goodDescription: good.descriptionGood,
                goodId: good.goodId,
                physicalStatus: good.physicalStatus,
                quantity: good.quantity,
                quantitySae: good.quantitySae,
                regionalDelegationNumber: good.delegationNumber,
                saeMeasureUnit: good.saeMeasureUnit,
                saePhysicalState: good.saePhysicalState,
                stateConservation: good.stateConservation,
                stateConservationSae: good.stateConservationSae,
                uniqueKey: good.uniqueKey,
                unitMeasure: good.unitMeasure,
                saeDestiny: good.transferentDestiny,
              };
              if (this.count == 1) {
                this.alert(
                  'success',
                  'Correcto',
                  'Bien actualizado correctamente'
                );
              }
              this.goodService.updateByBody(info).subscribe({
                next: () => {},
                error: error => {},
              });
            });
          }
        });
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'No se encontraron bienes para actualizar'
        );
      }
    }

    /*
    this.count = 0;
    this.goodsGuards.value.map((good: IGood) => {
      this.count = this.count + 1;
      if (Number(good.quantity) < Number(good.quantitySae)) {
        if (this.count == 1) {
          this.alert(
            'error',
            `Error de captura`,
            `La cantidad indep es mayor a la cantidad transferente en el bien ${good.goodId}`
          );
        }
      } else if (good.saePhysicalState == null) {
        if (this.count == 1) {
          this.alert(
            'error',
            'Error de captura',
            `Se debe capturar el estado físico indep en el bien ${good.goodId}`
          );
        }
      } else if (good.stateConservationSae == null) {
        if (this.count == 1) {
          this.alert(
            'error',
            'Error de captura',
            `Se debe capturar el estado de conservación indep en el bien ${good.goodId}`
          );
        }
      } else {
        this.count = 0;
        if (this.goodsGuards.value.length > 0) {
          this.alertQuestion(
            'question',
            'Confirmación',
            '¿Desea editar el bien?'
          ).then(question => {
            if (question.isConfirmed) {
              this.goodsGuards.value.map((good: IGood) => {
                this.count = this.count + 1;
                const info = {
                  id: good.id,
                  descriptionGoodSae: good.descriptionGoodSae,
                  fileNumber: good.fileNumber,
                  goodDescription: good.descriptionGood,
                  goodId: good.goodId,
                  physicalStatus: good.physicalStatus,
                  quantity: good.quantity,
                  quantitySae: good.quantitySae,
                  regionalDelegationNumber: good.delegationNumber,
                  saeMeasureUnit: good.saeMeasureUnit,
                  saePhysicalState: good.saePhysicalState,
                  stateConservation: good.stateConservation,
                  stateConservationSae: good.stateConservationSae,
                  uniqueKey: good.uniqueKey,
                  unitMeasure: good.unitMeasure,
                  saeDestiny: good.transferentDestiny,
                };
                if (this.count == 1) {
                  this.alert(
                    'success',
                    'Correcto',
                    'Bien actualizado correctamente'
                  );
                }
                this.goodService.updateByBody(info).subscribe({
                  next: () => {},
                  error: error => {},
                });
              });
            }
          });
        } else {
          this.alert(
            'warning',
            'Acción Invalida',
            'No se encontraron bienes para actualizar'
          );
        }
      }
    }); */
  }

  saveInfoGoodWarehouse() {
    this.count == 0;
    this.goodId = '';
    let saePhysical: boolean = false;
    let stateConservation: boolean = false;
    let _quantitySae: boolean = false;
    const saePhysicalState = this.goodsWarehouse.value.map((good: any) => {
      if (good.saePhysicalState == null) return good.goodId;
    });

    if (saePhysicalState.length > 0) {
      const filter = saePhysicalState.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `Se requiere capturar el estado físico INDEP en los bienes: ${this.goodId} `
        );
      } else {
        saePhysical = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      saePhysical = true;
    }

    this.count == 0;
    this.goodId = '';
    const stateConservationSae = this.goodsWarehouse.value.map((good: any) => {
      if (good.stateConservationSae == null) return good.goodId;
    });

    if (stateConservationSae.length > 0) {
      const filter = stateConservationSae.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `Se requiere capturar el estado de conservación INDEP en los bienes: ${this.goodId} `
        );
      } else {
        stateConservation = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      stateConservation = true;
    }
    //Cantidad
    this.count == 0;
    this.goodId = '';
    const quantitySae = this.goodsWarehouse.value.map((good: any) => {
      if (Number(good.quantity) < Number(good.quantitySae)) return good.goodId;
    });
    if (quantitySae.length > 0) {
      const filter = quantitySae.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `La cantidad INDEP es mayor a la cantidad transferente en el Bien: ${this.goodId} `
        );
      } else {
        _quantitySae = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      _quantitySae = true;
      this.count == 0;
      this.goodId = '';
    }

    if (saePhysical && stateConservation && _quantitySae) {
      this.count = 0;
      this.goodId = '';
      if (this.goodsWarehouse.value.length > 0) {
        this.alertQuestion(
          'question',
          'Confirmación',
          '¿Desea editar el bien?'
        ).then(question => {
          if (question.isConfirmed) {
            this.goodsWarehouse.value.map((good: IGood) => {
              this.count = this.count + 1;
              const info = {
                id: good.id,
                descriptionGoodSae: good.descriptionGoodSae,
                fileNumber: good.fileNumber,
                goodDescription: good.descriptionGood,
                goodId: good.goodId,
                physicalStatus: good.physicalStatus,
                quantity: good.quantity,
                quantitySae: good.quantitySae,
                regionalDelegationNumber: good.delegationNumber,
                saeMeasureUnit: good.saeMeasureUnit,
                saePhysicalState: good.saePhysicalState,
                stateConservation: good.stateConservation,
                stateConservationSae: good.stateConservationSae,
                uniqueKey: good.uniqueKey,
                unitMeasure: good.unitMeasure,
                saeDestiny: good.transferentDestiny,
              };
              if (this.count == 1) {
                this.alert(
                  'success',
                  'Correcto',
                  'Bien actualizado correctamente'
                );
              }
              this.goodService.updateByBody(info).subscribe({
                next: () => {},
                error: error => {},
              });
            });
          }
        });
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'No se encontraron bienes para actualizar'
        );
      }
    }

    /*
    this.count = 0;
    this.goodsWarehouse.value.map((good: IGood) => {
      this.count = this.count + 1;
      if (Number(good.quantity) < Number(good.quantitySae)) {
        if (this.count == 1) {
          this.alert(
            'error',
            `Error de captura`,
            `La cantidad indep es mayor a la cantidad transferente en el bien ${good.goodId}`
          );
        }
      } else if (good.saePhysicalState == null) {
        if (this.count == 1) {
          this.alert(
            'error',
            'Error de captura',
            `Se debe capturar el estado físico indep en el bien ${good.goodId}`
          );
        }
      } else if (good.stateConservationSae == null) {
        if (this.count == 1) {
          this.alert(
            'error',
            'Error de captura',
            `Se debe capturar el estado de conservación indep en el bien ${good.goodId}`
          );
        }
      } else {
        this.count = 0;
        if (this.goodsWarehouse.value.length > 0) {
          this.alertQuestion(
            'question',
            'Confirmación',
            '¿Desea editar el bien?'
          ).then(question => {
            if (question.isConfirmed) {
              this.goodsWarehouse.value.map((good: IGood) => {
                this.count = this.count + 1;
                const info = {
                  id: good.id,
                  descriptionGoodSae: good.descriptionGoodSae,
                  fileNumber: good.fileNumber,
                  goodDescription: good.descriptionGood,
                  goodId: good.goodId,
                  physicalStatus: good.physicalStatus,
                  quantity: good.quantity,
                  quantitySae: good.quantitySae,
                  regionalDelegationNumber: good.delegationNumber,
                  saeMeasureUnit: good.saeMeasureUnit,
                  saePhysicalState: good.saePhysicalState,
                  stateConservation: good.stateConservation,
                  stateConservationSae: good.stateConservationSae,
                  uniqueKey: good.uniqueKey,
                  unitMeasure: good.unitMeasure,
                  saeDestiny: good.transferentDestiny,
                };
                if (this.count == 1) {
                  this.alert(
                    'success',
                    'Correcto',
                    'Bien actualizado correctamente'
                  );
                }
                this.goodService.updateByBody(info).subscribe({
                  next: () => {},
                  error: error => {},
                });
              });
            }
          });
        } else {
          this.alert(
            'warning',
            'Acción Invalida',
            'No se encontraron bienes para actualizar'
          );
        }
      }
    }); */
  }

  saveInfoGoodReprog() {
    this.count == 0;
    this.goodId = '';
    let saePhysical: boolean = false;
    let stateConservation: boolean = false;
    let _quantitySae: boolean = false;
    const saePhysicalState = this.goodsReprog.value.map((good: any) => {
      if (good.saePhysicalState == null) return good.goodId;
    });

    if (saePhysicalState.length > 0) {
      const filter = saePhysicalState.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `Se requiere capturar el estado físico INDEP en los bienes: ${this.goodId} `
        );
      } else {
        saePhysical = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      saePhysical = true;
    }

    //Validación estado de conservación
    this.count == 0;
    this.goodId = '';
    const stateConservationSae = this.goodsReprog.value.map((good: any) => {
      if (good.stateConservationSae == null) return good.goodId;
    });

    if (stateConservationSae.length > 0) {
      const filter = stateConservationSae.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `Se requiere capturar el estado de conservación INDEP en los bienes: ${this.goodId} `
        );
      } else {
        stateConservation = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      stateConservation = true;
    }

    //Validacion Cantidad//
    this.count == 0;
    this.goodId = '';
    const quantitySae = this.goodsReprog.value.map((good: any) => {
      if (Number(good.quantity) < Number(good.quantitySae)) return good.goodId;
    });
    if (quantitySae.length > 0) {
      const filter = quantitySae.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `La cantidad INDEP es mayor a la cantidad transferente en el Bien: ${this.goodId} `
        );
      } else {
        _quantitySae = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      _quantitySae = true;
      this.count == 0;
      this.goodId = '';
    }

    if (saePhysical && stateConservation && _quantitySae) {
      this.count = 0;
      this.goodId = '';
      if (this.goodsReprog.value.length > 0) {
        this.alertQuestion(
          'question',
          'Confirmación',
          '¿Desea editar el bien?'
        ).then(question => {
          if (question.isConfirmed) {
            this.goodsReprog.value.map((good: IGood) => {
              this.count = this.count + 1;
              const info = {
                id: good.id,
                descriptionGoodSae: good.descriptionGoodSae,
                fileNumber: good.fileNumber,
                goodDescription: good.descriptionGood,
                goodId: good.goodId,
                physicalStatus: good.physicalStatus,
                quantity: good.quantity,
                quantitySae: good.quantitySae,
                regionalDelegationNumber: good.delegationNumber,
                saeMeasureUnit: good.saeMeasureUnit,
                saePhysicalState: good.saePhysicalState,
                stateConservation: good.stateConservation,
                stateConservationSae: good.stateConservationSae,
                uniqueKey: good.uniqueKey,
                unitMeasure: good.unitMeasure,
                saeDestiny: good.transferentDestiny,
              };
              if (this.count == 1) {
                this.alert(
                  'success',
                  'Correcto',
                  'Bien actualizado correctamente'
                );
              }
              this.goodService.updateByBody(info).subscribe({
                next: () => {},
                error: error => {},
              });
            });
          }
        });
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'No se encontraron bienes para actualizar'
        );
      }
    }

    /*this.count = 0;
    this.goodsReprog.value.map((good: IGood) => {
      this.count = this.count + 1;
      if (Number(good.quantity) < Number(good.quantitySae)) {
        if (this.count == 1) {
          this.alert(
            'error',
            `Error de captura`,
            `La cantidad indep es mayor a la cantidad transferente en el bien ${good.goodId}`
          );
        }
      } else if (good.saePhysicalState == null) {
        if (this.count == 1) {
          this.alert(
            'error',
            'Error de captura',
            `Se debe capturar el estado físico indep en el bien ${good.goodId}`
          );
        }
      } else if (good.stateConservationSae == null) {
        if (this.count == 1) {
          this.alert(
            'error',
            'Error de captura',
            `Se debe capturar el estado de conservación indep en el bien ${good.goodId}`
          );
        }
      } else {
        this.count = 0;
        if (this.goodsReprog.value.length > 0) {
          this.alertQuestion(
            'question',
            'Confirmación',
            '¿Desea editar el bien?'
          ).then(question => {
            if (question.isConfirmed) {
              this.goodsReprog.value.map((good: IGood) => {
                this.count = this.count + 1;
                const info = {
                  id: good.id,
                  descriptionGoodSae: good.descriptionGoodSae,
                  fileNumber: good.fileNumber,
                  goodDescription: good.descriptionGood,
                  goodId: good.goodId,
                  physicalStatus: good.physicalStatus,
                  quantity: good.quantity,
                  quantitySae: good.quantitySae,
                  regionalDelegationNumber: good.delegationNumber,
                  saeMeasureUnit: good.saeMeasureUnit,
                  saePhysicalState: good.saePhysicalState,
                  stateConservation: good.stateConservation,
                  stateConservationSae: good.stateConservationSae,
                  uniqueKey: good.uniqueKey,
                  unitMeasure: good.unitMeasure,
                  saeDestiny: good.transferentDestiny,
                };
                if (this.count == 1) {
                  this.alert(
                    'success',
                    'Correcto',
                    'Bien actualizado correctamente'
                  );
                }
                this.goodService.updateByBody(info).subscribe({
                  next: () => {},
                  error: error => {},
                });
              });
            }
          });
        } else {
          this.alert(
            'warning',
            'Acción Invalida',
            'No se encontraron bienes para actualizar'
          );
        }
      }
    }); */
  }

  saveInfoGoodCancelation() {
    this.count == 0;
    this.goodId = '';
    let saePhysical: boolean = false;
    let stateConservation: boolean = false;
    let _quantitySae: boolean = false;
    const saePhysicalState = this.goodsCancelation.value.map((good: any) => {
      if (good.saePhysicalState == null) return good.goodId;
    });

    if (saePhysicalState.length > 0) {
      const filter = saePhysicalState.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `Se requiere capturar el estado físico INDEP en los bienes: ${this.goodId} `
        );
      } else {
        saePhysical = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      saePhysical = true;
    }

    this.count == 0;
    this.goodId = '';
    const stateConservationSae = this.goodsCancelation.value.map(
      (good: any) => {
        if (good.stateConservationSae == null) return good.goodId;
      }
    );

    if (stateConservationSae.length > 0) {
      const filter = stateConservationSae.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `Se requiere capturar el estado de conservación INDEP en los bienes: ${this.goodId} `
        );
      } else {
        stateConservation = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      stateConservation = true;
    }

    //Validacion Cantidad//
    this.count == 0;
    this.goodId = '';
    const quantitySae = this.goodsCancelation.value.map((good: any) => {
      if (Number(good.quantity) < Number(good.quantitySae)) return good.goodId;
    });
    if (quantitySae.length > 0) {
      const filter = quantitySae.filter((item: IGood) => {
        return item;
      });

      filter.map((item: IGood) => {
        this.count = this.count + 1;
        this.goodId += item + ', ';
      });

      if (this.goodId) {
        this.alert(
          'warning',
          'Acción Incorrecta',
          `La cantidad INDEP es mayor a la cantidad transferente en el Bien: ${this.goodId} `
        );
      } else {
        _quantitySae = true;
        this.count == 0;
        this.goodId = '';
      }
    } else {
      _quantitySae = true;
      this.count == 0;
      this.goodId = '';
    }

    if (saePhysical && stateConservation && _quantitySae) {
      this.count = 0;
      this.goodId = '';
      if (this.goodsCancelation.value.length > 0) {
        this.alertQuestion(
          'question',
          'Confirmación',
          '¿Desea editar el bien?'
        ).then(question => {
          if (question.isConfirmed) {
            this.goodsCancelation.value.map((good: IGood) => {
              this.count = this.count + 1;
              const info = {
                id: good.id,
                descriptionGoodSae: good.descriptionGoodSae,
                fileNumber: good.fileNumber,
                goodDescription: good.descriptionGood,
                goodId: good.goodId,
                physicalStatus: good.physicalStatus,
                quantity: good.quantity,
                quantitySae: good.quantitySae,
                regionalDelegationNumber: good.delegationNumber,
                saeMeasureUnit: good.saeMeasureUnit,
                saePhysicalState: good.saePhysicalState,
                stateConservation: good.stateConservation,
                stateConservationSae: good.stateConservationSae,
                uniqueKey: good.uniqueKey,
                unitMeasure: good.unitMeasure,
                saeDestiny: good.transferentDestiny,
              };
              if (this.count == 1) {
                this.alert(
                  'success',
                  'Correcto',
                  'Bien actualizado correctamente'
                );
              }
              this.goodService.updateByBody(info).subscribe({
                next: () => {},
                error: error => {},
              });
            });
          }
        });
      } else {
        this.alert(
          'warning',
          'Acción Invalida',
          'No se encontraron bienes para actualizar'
        );
      }
    }
  }

  showLabelTDRTransportable() {
    if (this.goodsTransportable.value.length) {
      this.goodsTransportable.value.map((good: IGood) => {
        this.goodId += good.goodId + ',';
      });

      let config: ModalOptions = {
        initialState: {
          showTDR: true,
          goodsId: this.goodId,
          programming: this.programming,
          callback: (next: boolean) => {
            if (next) {
              this.goodId = '';
            }
          },
        },
        class: 'modal-xl modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowReportComponentComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'No hay etiquetas que visualizar'
      );
    }
  }

  showLabelTDRProgramming() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    params.getValue().limit = 100000;
    this.programmingService.getGoodsProgramming(params.getValue()).subscribe({
      next: response => {
        response.data.map((good: any) => {
          this.goodId += good.goodId + ',';
        });
        let config: ModalOptions = {
          initialState: {
            showTDR: true,
            goodsId: this.goodId,
            programming: this.programming,
            callback: (next: boolean) => {
              if (next) {
                this.goodId = '';
              }
            },
          },
          class: 'modal-xl modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(ShowReportComponentComponent, config);
      },
      error: error => {},
    });
    /*if (this.goodsTransportable.value.length) {
      let config: ModalOptions = {
        initialState: {
          showTDR: true,
          programming: this.programming,
          callback: (next: boolean) => {
            if (next) {
            }
          },
        },
        class: 'modal-xl modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowReportComponentComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'No hay etiquetas que visualizar'
      );
    } */
  }

  showLabelTDRReception() {
    if (this.goodsReception.value.length) {
      this.goodsReception.value.map((good: IGood) => {
        this.goodId += good.goodId + ',';
      });

      let config: ModalOptions = {
        initialState: {
          showTDR: true,
          goodsId: this.goodId,
          programming: this.programming,
          callback: (next: boolean) => {
            if (next) {
              this.goodId = '';
            }
          },
        },
        class: 'modal-xl modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowReportComponentComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'No hay etiquetas que visualizar'
      );
    }
  }

  showLabelTDRGuard() {
    if (this.goodsGuards.value.length) {
      this.goodsGuards.value.map((good: IGood) => {
        this.goodId += good.goodId + ',';
      });

      let config: ModalOptions = {
        initialState: {
          showTDR: true,
          goodsId: this.goodId,
          programming: this.programming,
          callback: (next: boolean) => {
            if (next) {
              this.goodId = '';
            }
          },
        },
        class: 'modal-xl modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowReportComponentComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'No hay etiquetas que visualizar'
      );
    }
  }

  showLabelTDRWarehouse() {
    if (this.goodsWarehouse.value.length > 0) {
      this.goodsWarehouse.value.map((good: IGood) => {
        this.goodId += good.goodId + ',';
      });

      let config: ModalOptions = {
        initialState: {
          showTDR: true,
          goodsId: this.goodId,
          programming: this.programming,
          callback: (next: boolean) => {
            if (next) {
              this.goodId = '';
            }
          },
        },
        class: 'modal-xl modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowReportComponentComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'No hay etiquetas que visualizar'
      );
    }
  }

  showLabelTDRReprog() {
    if (this.goodsReprog.value.length > 0) {
      this.goodsReprog.value.map((good: IGood) => {
        this.goodId += good.goodId + ',';
      });

      let config: ModalOptions = {
        initialState: {
          showTDR: true,
          goodsId: this.goodId,
          programming: this.programming,
          callback: (next: boolean) => {
            if (next) {
              this.goodId = '';
            }
          },
        },
        class: 'modal-xl modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowReportComponentComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'No hay etiquetas que visualizar'
      );
    }
  }

  showLabelTDRCancel() {
    if (this.goodsCancelation.value.length > 0) {
      this.goodsCancelation.value.map((good: IGood) => {
        this.goodId += good.goodId + ',';
      });

      let config: ModalOptions = {
        initialState: {
          showTDR: true,
          goodsId: this.goodId,
          programming: this.programming,
          callback: (next: boolean) => {
            if (next) {
              this.goodId = '';
            }
          },
        },
        class: 'modal-xl modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(ShowReportComponentComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'No hay etiquetas que visualizar'
      );
    }
  }

  generateReportTransportable() {
    this.programmingService
      .reportProgrammingGoods(this.programmingId, 'EN_TRANSPORTABLE')
      .subscribe({
        next: (response: any) => {
          this.downloadExcel(response.base64File);
        },
        error: error => {
          this.alert(
            'warning',
            'Acción Invalida',
            'No hay bienes para generar el reporte'
          );
        },
      });
  }

  generateReportReception() {
    this.programmingService
      .reportProgrammingGoods(this.programmingId, 'EN_RECEPCION_TMP')
      .subscribe({
        next: (response: any) => {
          this.downloadExcel(response.base64File);
        },
        error: error => {
          this.alert(
            'warning',
            'Acción Invalida',
            'No hay bienes para generar el reporte'
          );
        },
      });
  }

  generateReportGuard() {
    this.programmingService
      .reportProgrammingGoods(this.programmingId, 'EN_RESGUARDO_TMP')
      .subscribe({
        next: (response: any) => {
          this.downloadExcel(response.base64File);
        },
        error: error => {
          this.alert(
            'warning',
            'Acción Invalida',
            'No hay bienes para generar el reporte'
          );
        },
      });
  }

  generateReportWarehouse() {
    this.programmingService
      .reportProgrammingGoods(this.programmingId, 'EN_ALMACEN_TMP')
      .subscribe({
        next: (response: any) => {
          this.downloadExcel(response.base64File);
        },
        error: error => {
          this.alert(
            'warning',
            'Acción Invalida',
            'No hay bienes para generar el reporte'
          );
        },
      });
  }

  generateReportReprog() {
    this.programmingService
      .reportProgrammingGoods(this.programmingId, 'EN_PROGRAMACION_TMP')
      .subscribe({
        next: (response: any) => {
          this.downloadExcel(response.base64File);
        },
        error: error => {
          this.alert(
            'warning',
            'Acción Invalida',
            'No hay bienes para generar el reporte'
          );
        },
      });
  }

  generateReportCancelation() {
    this.programmingService
      .reportProgrammingGoods(this.programmingId, 'EN_CANCELACION_TMP')
      .subscribe({
        next: (response: any) => {
          this.downloadExcel(response.base64File);
        },
        error: error => {
          this.alert(
            'warning',
            'Acción Invalida',
            'No hay bienes para generar el reporte'
          );
        },
      });
  }

  downloadExcel(excel: any) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excel}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.download = 'Bienes.xlsx';
    downloadLink.click();
    this.alert('success', 'Acción Correcta', 'Archivo generado');
  }

  showReceiptClose() {
    let config: ModalOptions = {
      initialState: {
        receipts: this.receipts,
        programming: this.programming,
        callback: (next: boolean) => {
          if (next) {
          }
        },
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReceiptCloseComponent, config);
  }

  showReceiptWarehouseClose() {
    let config: ModalOptions = {
      initialState: {
        programming: this.programming,
        typeReceipt: 'warehouse',
        callback: (next: boolean) => {
          if (next) {
          }
        },
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReceiptGuardCloseComponent, config);
  }

  showReceiptGuardClose() {
    let config: ModalOptions = {
      initialState: {
        programming: this.programming,
        typeReceipt: 'guard',
        callback: (next: boolean) => {
          if (next) {
          }
        },
      },
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReceiptGuardCloseComponent, config);
  }
}
