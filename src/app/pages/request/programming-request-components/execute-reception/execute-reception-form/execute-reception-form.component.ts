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
import {
  IReceipt,
  IRecepitGuard,
} from 'src/app/core/models/receipt/receipt.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
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
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
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
  //goodsWarehouse: LocalDataSource = new LocalDataSource();
  paramsTransportableGoods = new BehaviorSubject<ListParams>(new ListParams());

  nameWarehouse: string = '';
  ubicationWarehouse: string = '';
  totalItems: number = 0;
  totalItemsGuard: number = 0;
  totalItemsWarehouse: number = 0;
  totalItemsReceipt: number = 0;
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
  authorityName: string = '';
  typeRelevantName: string = '';
  formLoading: boolean = false;
  formLoadingReceipt: boolean = false;
  formLoadingReprog: boolean = false;
  formLoadingTrans: boolean = false;
  formLoadingGuard: boolean = false;
  showReception: boolean = false;
  showTransportable: boolean = false;
  showGuard: boolean = false;
  showWarehouse: boolean = false;
  showReprog: boolean = false;
  showCancel: boolean = false;
  receiptGuardGood: IRecepitGuard;
  receiptData: IReceipt;
  goodData: IGood;
  transfersDestinity: any[] = [];

  delegationDes: string = '';
  keyTransferent: string = '';

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
      delete: true,
    },
    columns: RECEIPT_COLUMNS,
    edit: {
      editButtonContent: '<i class="fa fa-file text-primary mx-2"></i>',
    },
  };

  settingsReceiptClose = {
    ...this.settings,
    actions: {
      columnTitle: 'Visualizar',
      position: 'right',
      delete: false,
    },
    columns: RECEIPT_COLUMNS,
    edit: {
      editButtonContent: '<i class="fa fa-eye text-primary mx-2"></i>',
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
      editButtonContent:
        '<i class="fa fa-eye text-primary mx-2" > Ver Bienes</i>',
    },

    delete: {
      deleteButtonContent:
        '<i class="fa fa-file text-info mx-2"> Generar Recibo Resguardo</i>',
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
      editButtonContent:
        '<i class="fa fa-eye text-primary mx-2" > Ver bienes</i>',
    },

    delete: {
      deleteButtonContent:
        '<i class="fa fa-file text-info mx-2"> Ver Recibo</i>',
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
        '<i class="fa fa-book" text-warning aria-hidden="true"></i> Ver bienes',
    },

    delete: {
      deleteButtonContent:
        '<i class="fa fa-file ml-4" text-primary aria-hidden="true"></i> Generar recibo',
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
        '<i class="fa fa-book" text-warning aria-hidden="true"></i> Ver bienes',
    },

    delete: {
      deleteButtonContent:
        '<i class="fa fa-eye ml-4" text-primary aria-hidden="true"></i> Ver recibo',
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
    private regionalDelegationService: RegionalDelegationService
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
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      quantitySae: [
        null,
        [Validators.maxLength(50), Validators.pattern(NUMBERS_PATTERN)],
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

  getReceipts() {
    this.formLoadingReceipt = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    this.receptionGoodService.getReceipt(params.getValue()).subscribe({
      next: response => {
        this.receiptData = response.data[0];
        this.receipts.load(response.data);
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
    this.receptionGoodService.getReceptions(params.getValue()).subscribe({
      next: response => {
        console.log('receipt guard', response);
        this.receiptGuardGood = response.data[0];

        const filterWarehouse = response.data.map((item: any) => {
          if (item.typeReceipt == 'ALMACEN') return item;
        });

        const infoWarehouse = filterWarehouse.filter((item: IRecepitGuard) => {
          return item;
        });

        this.receiptWarehouse.load(infoWarehouse);
        const filterGuard = response.data.map((item: any) => {
          if (item.typeReceipt == 'RESGUARDO') return item;
        });
        if (filterGuard) {
          const infoGuard = filterGuard.filter((item: IRecepitGuard) => {
            return item;
          });

          this.receiptGuards.load(infoGuard);
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
        this.getUsersProgramming();
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getInfoGoodsProgramming());
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
        this.filterStatusReception(data.data);
        this.filterStatusGuard(data.data);
        this.filterStatusWarehouse(data.data);
        this.filterStatusReprog(data.data);
        this.filterStatusCancelation(data.data);
      });
  }

  filterStatusTrans(data: IGoodProgramming[]) {
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
  }

  getDestinyIndep(saeDestiny: number) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.name'] = 'Destino';
    this.genericService.getAll(params.getValue()).subscribe({
      next: response => {
        this.transfersDestinity = response.data;
      },
      error: error => {
        console.log('error', error);
      },
    });
  }

  filterStatusReception(data: IGoodProgramming[]) {
    const _data: any[] = [];
    const filterData = data.filter(item => {
      return item.status == 'EN_RECEPCION_TMP';
    });

    filterData.forEach(items => {
      this.params.getValue()['filter.id'] = items.goodId;
      this.goodService.getAll(this.params.getValue()).subscribe({
        next: response => {
          _data.push(response.data[0]);

          this.goodsReception.clear();
          _data.forEach(item => {
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
          });
        },
        error: error => {
          this.formLoading = false;
        },
      });
    });
  }

  formGoooTrans() {}
  filterStatusGuard(data: IGoodProgramming[]) {
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
          _data.forEach(item => {
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
            this.showWarehouse = true;
          });
        },
        error: error => {
          this.formLoading = false;
          this.goodsWarehouse.clear();
        },
      });
    });
  }

  filterStatusReprog(data: IGoodProgramming[]) {
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
          _data.forEach(item => {
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
            this.showCancel = true;
          });
        },
        error: error => {
          this.formLoading = false;
          this.goodsCancelation.clear();
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
      tranType: this.tranType,
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
        };
        this.goodService.updateByBody(info).subscribe({
          next: response => {
            //this.getInfoGoodsProgramming();
          },
          error: error => {},
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
    if (this.selectGood.length > 0) {
      this.alertQuestion(
        'warning',
        '¿Seguro que quiere asignar los bienes  a una acta?',
        '',
        'Aceptar'
      ).then(question => {
        if (question.isConfirmed) {
          this.checkExistAct('resguardo');
        }
      });
    } else {
      this.onLoadToast(
        'warning',
        'Acción inválida',
        'Se necesita tener un bien seleccionado'
      );
    }
  }

  assingMinuteReprogramation() {
    if (this.selectGood.length > 0) {
      this.alertQuestion(
        'warning',
        'Confirmación',
        '¿Seguro que quiere asignar los bienes  a una acta?',
        'Aceptar'
      ).then(async question => {
        if (question.isConfirmed) {
          const updateGood = await this.updateGoodProgramming('reprogramation');
        }
      });
    } else {
      this.onLoadToast(
        'warning',
        'Acción inválida',
        'Se necesita tener un bien seleccionado'
      );
    }
  }

  assingMinuteCancelation() {
    if (this.selectGood.length > 0) {
      this.alertQuestion(
        'warning',
        'Confirmación',
        '¿Seguro que quiere asignar los bienes  a una acta?',
        'Aceptar'
      ).then(async question => {
        if (question.isConfirmed) {
          const updateGood = await this.updateGoodProgramming('cancelalation');
        }
      });
    } else {
      this.onLoadToast(
        'warning',
        'Acción inválida',
        'Se necesita tener un bien seleccionado'
      );
    }
  }

  updateGoodProgramming(type: string) {
    if (type == 'reprogramation') {
      this.receipts.getElements().then(item => {
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
                    this.getInfoGoodsProgramming();
                    this.headingReprogramation = `Reprogramación(${this.goodsReprog.length})`;
                  },
                  error: error => {},
                });
            },
            error: error => {},
          });
        });
      });
    } else if (type == 'cancelalation') {
      this.receipts.getElements().then(item => {
        const actId = item[0].actaId;
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
                actaId: actId,
              };
              this.programmingGoodService
                .updateGoodProgramming(formData)
                .subscribe({
                  next: response => {
                    this.goodsCancelation.clear();
                    this.getInfoGoodsProgramming();
                    this.headingCancelation = `Cancelación(${this.goodsCancelation.length})`;
                  },
                  error: error => {},
                });
            },
            error: error => {
              console.log('update good error', error);
            },
          });
        });
      });
    }
  }

  assingMinuteWarehouse() {
    if (this.selectGood.length > 0) {
      this.alertQuestion(
        'warning',
        'Confirmación',
        '¿Seguro que quiere asignar los bienes  a una acta?',
        'Aceptar'
      ).then(question => {
        if (question.isConfirmed) {
          this.checkExistAct('almacen');
        }
      });
    } else {
      this.onLoadToast(
        'warning',
        'Acción inválida',
        'Se necesita tener un bien seleccionado'
      );
    }
  }

  checkExistAct(type: string) {
    if (type == 'resguardo') {
      this.formLoadingGuard = true;
      if (this.receipts.count() > 0) {
        this.receipts.getElements().then(async receipt => {
          const createReceiptGood: any = await this.createReceiptGuard(
            receipt[0]
          );
          if (createReceiptGood) {
            const createReceiptGoodGuard = await this.createReceiptGoodGuard(
              createReceiptGood
            );

            if (createReceiptGoodGuard) {
              const updateProgrammingGood = await this.updateProgGoodGuard(
                receipt[0]
              );
              if (updateProgrammingGood) {
                const updateGood = await this.updateGoodGuard();
                this.goodsGuards.clear();
                this.getReceiptsGuard();
                this.getInfoGoodsProgramming();
                this.formLoadingGuard = false;
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
                await this.createReceiptGuardNewAct(response);
              if (createReceiptGood) {
                const createReceiptGoodGuard =
                  await this.createReceiptGoodGuard(createReceiptGood);

                if (createReceiptGoodGuard) {
                  const updateProgrammingGood =
                    await this.updateProgGoodGuardNewAct(response);

                  if (updateProgrammingGood) {
                    const updateGood = await this.updateGoodGuard();
                    this.goodsGuards.clear();
                    this.headingGuard = `Resguardo(${this.goodsGuard.length})`;
                    this.getReceiptsGuard();
                    this.getInfoGoodsProgramming();

                    this.formLoadingGuard = false;
                  }
                }
              }
            }
          },
          error: error => {},
        });
      }
    } else if (type == 'almacen') {
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
                this.goodsWarehouse.clear();
                this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.length})`;
                this.getReceiptsGuard();
                this.getInfoGoodsProgramming();
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
                    this.getInfoGoodsProgramming();
                    this.formLoadingGuard = false;
                  }
                }
              }
            }
          },
          error: error => {},
        });
      }
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

  createReceiptGuard(receipt: IReceipt) {
    return new Promise((resolve, reject) => {
      const formData = {
        programmingId: this.programmingId,
        actId: receipt.actId,
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

  createReceiptWarehouse(receipt: IReceipt) {
    return new Promise((resolve, reject) => {
      const formData = {
        programmingId: this.programmingId,
        actId: receipt.actId,
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

  updateProgGoodGuard(receipt: IReceipt) {
    return new Promise((resolve, reject) => {
      this.selectGood.map(item => {
        const formData: Object = {
          programmingId: this.programming.id,
          actaId: receipt.actId,
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

  updateProgGoodWarehouse(receipt: IReceipt) {
    return new Promise((resolve, reject) => {
      this.selectGood.map(item => {
        const formData: Object = {
          programmingId: this.programming.id,
          actaId: receipt.actId,
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
            console.log('error', error);
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

      callback: (receipt: IProceedings, keyDoc: string) => {
        if (receipt && keyDoc) {
          this.openReportReceipt(receipt, keyDoc);
        }
      },
    };

    this.modalService.show(GenerateReceiptFormComponent, config);
  }

  openReportReceipt(_receipt: IProceedings, keyDoc: string) {
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
        callback: (next: boolean) => {
          if (next) {
            this.uplodadReceiptDelivery();
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
        }
      },
    };

    this.modalService.show(UploadReportReceiptComponent, config);
  }

  assignReceipt() {
    if (this.selectGood) {
      let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
      config.initialState = {
        programming: this.programming,
        selectGoods: this.selectGood,
        callback: (data: boolean) => {
          if (data) {
            this.goodsTransportable.clear();
            this.getReceipts();
            this.getInfoGoodsProgramming();
          }
        },
      };

      this.modalService.show(AssignReceiptFormComponent, config);
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
    if (this.selectGood) {
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
    if (this.selectGood) {
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
        this.getInfoGoodsProgramming();
        this.goodIdSelect = null;
        this.selectGood = [];
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
        this.getInfoGoodsProgramming();
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
        this.getInfoGoodsProgramming();
        this.goodIdSelect = null;
        this.selectGood = [];
        this.headingReprogramation = `Reprogramación(${this.goodsReprog.length})`;
      }
    });
  }

  cancel() {
    this.goodsTransportable.clear();
    this.searchGoodForm.reset();
    this.getInfoGoodsProgramming();
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
        this.getInfoGoodsProgramming();
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
        this.getInfoGoodsProgramming();
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
          status: 'EN_TRANSPORTABLE',
        };
        this.programmingGoodService.updateGoodProgramming(formData).subscribe({
          next: async response => {
            await this.changeStatusGoodReceipt();
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
          error: error => {
            console.log('error actualizar progr', error);
          },
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
          error: error => {
            console.log('error actualizar progr', error);
          },
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
            this.getInfoGoodsProgramming();
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
}
