import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ShowDocumentsGoodComponent } from '../../../shared-request/expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { ESTATE_COLUMNS_VIEW } from '../../acept-programming/columns/estate-columns';
import {
  RECEIPT_COLUMNS_FORMALIZE,
  RECEIPT_GUARD_COLUMNS,
} from '../../execute-reception/execute-reception-form/columns/minute-columns';
import { TRANSPORTABLE_GOODS_FORMALIZE } from '../../execute-reception/execute-reception-form/columns/transportable-goods-columns';
import { ShowReportComponentComponent } from '../../execute-reception/show-report-component/show-report-component.component';
import { UploadReportReceiptComponent } from '../../execute-reception/upload-report-receipt/upload-report-receipt.component';
import { InformationRecordComponent } from '../information-record/information-record.component';
import { ShowProceedingCloseComponent } from '../show-proceeding-close/show-proceeding-close.component';

@Component({
  selector: 'app-formalize-programming-form',
  templateUrl: './formalize-programming-form.component.html',
  styles: [],
})
export class FormalizeProgrammingFormComponent
  extends BasePage
  implements OnInit
{
  observationProceedings: string;
  isDropup = true;
  goods: any[] = [];
  proceedingForm: FormGroup = new FormGroup({});
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
  paramsReceiptsWarehouse = new BehaviorSubject<ListParams>(new ListParams());
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
  totalItemsReceiptWarehouse: number = 0;
  totalItemsReprog: number = 0;
  totalItemsCanc: number = 0;
  totalItemsProceedings: number = 0;
  selectGood: IGood[] = [];
  selectGoodGuard: IGood[] = [];
  receiptData: IReceipt;
  receiptGuardData: IRecepitGuard;
  receiptWarehouseData: IRecepitGuard;
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
  typeTransferent: string = '';
  stationName: string = '';
  authorityName: string = '';
  typeRelevantName: string = '';
  formLoading: boolean = false;
  goodData: IGood;
  actId: number = 0;
  observation: string = '';
  proceedingData: IProceedings;
  task: ITask;

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
    actions: {
      columnTitle: 'Visualizar',
      position: 'right',
      delete: false,
    },
    columns: RECEIPT_COLUMNS_FORMALIZE,
    edit: {
      editButtonContent: '<i class="fa fa-eye text-primary mx-2"></i>',
    },
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
  stateName: string = '';
  receiptGuardGood: LocalDataSource = new LocalDataSource();
  receiptWarehouseGood: LocalDataSource = new LocalDataSource();

  settingsMinutes = { ...TABLE_SETTINGS };
  /*settingsMinutes = {
    ...this.settings,
    columns: MINUTES_COLUMNS,

    //edit: { editButtonContent: '<i class="fa fa-book text-warning mx-2"></i>' },
    
    //actions: { columnTitle: 'Generar / cerrar acta', position: 'right' }, 
  }; */

  settingsReceiptClose = {
    ...this.settings,
    actions: {
      columnTitle: 'Visualizar',
      position: 'right',
      delete: false,
    },
    columns: RECEIPT_GUARD_COLUMNS,
    edit: {
      editButtonContent: '<i class="fa fa-eye text-primary mx-2"></i>',
    },
  };

  settingsReceiptWarehouseClose = {
    ...this.settings,
    actions: {
      columnTitle: 'Visualizar',
      position: 'right',
      delete: false,
    },
    columns: RECEIPT_GUARD_COLUMNS,
    edit: {
      editButtonContent: '<i class="fa fa-eye text-primary mx-2"></i>',
    },
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
    private stateService: StateOfRepublicService,
    private wcontentService: WContentService,
    // private router: ActivatedRoute,
    private router: Router,
    private signatoriesService: SignatoriesService,
    private sanitizer: DomSanitizer,
    private taskService: TaskService,
    private authService: AuthService,
    private emailService: EmailService,
    private goodsProcessService: GoodprocessService,
    private goodsQueryService: GoodsQueryService
  ) {
    super();
    this.settings.columns = TRANSPORTABLE_GOODS_FORMALIZE;

    this.programmingId = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
  }

  ngOnInit(): void {
    this.formLoading = true;
    this.getProgrammingData();
    this.prepareFormProceeding();
    this.getTask();
    /*this.paramsReceipts
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => ); */

    this.paramsProceeding
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getProccedings());

    /*
    this.router.navigate(
      [
        '/pages/request/programming-request/formalize-programming',
        this.programmingId,
      ],
      { queryParams: { programingId: this.programmingId } }
    ); */
  }

  prepareFormProceeding() {
    this.proceedingForm = this.fb.group({
      proceeding: this.fb.array([]),
      id: [null],
      statusProceeedings: [null],
      idPrograming: [this.programmingId],
      observationProceedings: [null],
    });
  }

  get proceeding() {
    return this.proceedingForm.get('proceeding') as FormArray;
  }

  getReceipts() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    params.getValue()['filter.actId'] = this.actId;
    params.getValue()['filter.statusReceipt'] = 'CERRADO';

    this.receptionGoodService.getReceipt(params.getValue()).subscribe({
      next: response => {
        this.receiptData = response.data[0];
        this.receipts.load(response.data);
      },
      error: error => {
        this.receipts = new LocalDataSource();
      },
    });
  }

  getReceiptsGuardInfo() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    params.getValue()['filter.actId'] = this.actId;
    params.getValue()['filter.statusReceiptGuard'] = 'CERRADO';
    this.receptionGoodService.getReceptions(params.getValue()).subscribe({
      next: response => {
        //this.receiptGuardGood = response.data[0];

        const filterWarehouse = response.data.map((item: any) => {
          if (item.typeReceipt == 'ALMACEN') return item;
        });

        const infoWarehouse = filterWarehouse.filter((item: IRecepitGuard) => {
          return item;
        });

        this.receiptWarehouseData = infoWarehouse[0];
        this.receiptWarehouseGood.load(infoWarehouse);
        //this.receiptWarehouseGood = infoWarehouse[0];
        //this.receiptWarehouse.load(infoWarehouse);

        const filterGuard = response.data.map((item: any) => {
          if (item.typeReceipt == 'RESGUARDO') return item;
        });
        if (filterGuard) {
          const infoGuard = filterGuard.filter((item: IRecepitGuard) => {
            return item;
          });

          this.receiptGuardData = infoGuard[0];
          //this.receipts.load(infoGuard);
          //this.receiptGuardGood = infoGuard[0];
          this.receiptGuardGood.load(infoGuard);
        }
      },
      error: error => {},
    });
  }

  getProccedings() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.idPrograming'] = this.programmingId;
    params.getValue()['filter.statusProceeedings'] = 'ABIERTO';
    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: response => {
        this.actId = response.data[0].id;
        this.proceedingData = response.data[0];
        this.proceeding.clear();
        response.data.forEach(item => {
          this.observation = item?.observationProceedings;
          const form = this.fb.group({
            id: [item.id],
            statusProceeedings: [item.statusProceeedings],
            idPrograming: [this.programming?.id],
            observationProceedings: [item?.observationProceedings],
          });
          this.proceeding.push(form);
        });
        //this.proceedings.load(response.data);
        this.getInfoGoodsProgramming();
        this.getReceiptsGuard();
        this.getReceiptsGuardWarehouse();
        this.getReceiptsGuardInfo();
        this.paramsReceipts
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getReceipts());
        this.totalItemsProceedings = response.count;
      },
      error: error => {},
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
        this.getState(data);
        this.getTransferent(data);
        this.getStation(data);
        this.getAuthority();
        this.getTypeRelevant();
        this.getwarehouse();

        //this.getUsersProgramming();
        /*this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getInfoReceptionGood()); */
      });
  }

  getTask() {
    const task = JSON.parse(localStorage.getItem('Task'));

    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = `$eq:${task.id}`;
    this.taskService.getAll(params.getValue()).subscribe({
      next: response => {
        this.task = response.data[0];
      },
      error: error => {},
    });
  }

  getRegionalDelegation(data: Iprogramming) {
    this.regionalDelegationService
      .getById(data.regionalDelegationNumber)
      .subscribe(data => {
        this.programming.regionalDelegationName = data.description;
      });
  }

  getState(programming: Iprogramming) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.programming.stateKey;
    this.stateService.getAll(params.getValue()).subscribe({
      next: response => {
        this.stateName = response.data[0].descCondition;
      },
      error: error => {},
    });
  }

  getTransferent(data: Iprogramming) {
    this.transferentService.getById(data.tranferId).subscribe(data => {
      this.transferentName = data.nameTransferent;
      this.typeTransferent = data.typeTransferent;
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
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.programming.typeRelevantId;
    this.typeRelevantService.getAll(params.getValue()).subscribe(data => {
      this.typeRelevantName = data.data[0].description;
    });
  }

  getwarehouse() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.organizationCode'] = this.programming.storeId;
    this.goodsQueryService.getCatStoresView(params.getValue()).subscribe({
      next: response => {
        this.nameWarehouse = response.data[0].name;
        this.ubicationWarehouse = response.data[0].address1;
        this.formLoading = false;
      },
      error: error => {},
    });
    /*const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.idWarehouse'] = this.programming.storeId;
    this.warehouseService.getAll(params.getValue()).subscribe(data => {
      this.nameWarehouse = data.data[0].description;
      this.ubicationWarehouse = data.data[0].ubication;
      this.formLoading = false;
    }); */
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

  getInfoReceptionGood() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getGoodsProgramming(params.getValue())
      .subscribe(data => {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.filterStatusReception());

        this.paramsGuard
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.filterStatusGuard());
        /* 

        this.paramsGoodsWarehouse
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.filterStatusWarehouse(data.data));

        this.paramsReprog
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.filterStatusReprog(data.data));

        this.filterStatusCancel(data.data); */
        /*
         */
      });
  }

  getInfoGoodsProgramming() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.filterStatusReception());

    this.paramsGuard
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.filterStatusGuard());

    this.paramsGoodsWarehouse
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.filterStatusWarehouse());

    this.paramsReprog
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.filterStatusReprog());

    this.paramsCanc
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.filterStatusCancel());
  }

  filterStatusReception() {
    const goodsInfoRecep: any[] = [];

    this.params.getValue()['filter.programmingId'] = this.programmingId;
    this.params.getValue()['filter.status'] = 'EN_RECEPCION';
    this.params.getValue()['filter.actaId'] = this.actId;

    this.programmingService
      .getGoodsProgramming(this.params.getValue())
      .subscribe(data => {
        data.data.map(items => {
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
      });
    /*const goodsInfoRecep: any[] = [];
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
    }); */
  }

  filterStatusGuard() {
    const goodsInfoGuard: any[] = [];
    this.paramsGuard.getValue()['filter.programmingId'] = this.programmingId;
    this.paramsGuard.getValue()['filter.status'] = 'EN_RESGUARDO';
    this.paramsGuard.getValue()['filter.actaId'] = this.actId;
    this.programmingService
      .getGoodsProgramming(this.paramsGuard.getValue())
      .subscribe({
        next: response => {
          response.data.map(items => {
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
        },
        error: error => {},
      });
    /*
   
    const goodsTrans = data.filter(items => {
      return items.status == 'EN_RESGUARDO';
    });

     */
  }

  filterStatusWarehouse() {
    const goodsInfoWarehouse: any[] = [];
    this.paramsGoodsWarehouse.getValue()['filter.programmingId'] =
      this.programmingId;
    this.paramsGoodsWarehouse.getValue()['filter.status'] = 'EN_ALMACEN';
    this.paramsGoodsWarehouse.getValue()['filter.actaId'] = this.actId;
    this.programmingService
      .getGoodsProgramming(this.paramsGoodsWarehouse.getValue())
      .subscribe({
        next: response => {
          response.data.map(items => {
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
        },
      });
  }

  filterStatusReprog() {
    const goodsInfoReprog: any[] = [];
    this.paramsReprog.getValue()['filter.programmingId'] = this.programmingId;
    this.paramsReprog.getValue()['filter.status'] = 'EN_PROGRAMACION';
    this.paramsReprog.getValue()['filter.actaId'] = this.actId;
    this.programmingService
      .getGoodsProgramming(this.paramsReprog.getValue())
      .subscribe({
        next: response => {
          response.data.map(items => {
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
        },
      });
  }

  filterStatusCancel() {
    const goodsInfoCancel: any[] = [];
    this.paramsCanc.getValue()['filter.programmingId'] = this.programmingId;
    this.paramsCanc.getValue()['filter.status'] = 'CANCELADO';
    this.paramsCanc.getValue()['filter.actaId'] = this.actId;
    this.programmingService
      .getGoodsProgramming(this.paramsCanc.getValue())
      .subscribe({
        next: response => {
          response.data.map(items => {
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
        },
        error: error => {},
      });
    /*
    
    const goodsCancel = data.filter(items => {
      return items.status == 'CANCELADO';
    });

    */
  }

  async generateMinute(proceeding: IProceedings) {
    proceeding.programmingId = this.programmingId;
    const receiptCheck = await this.checkReceipt();
    const receiptGuardCheck = await this.checkReceiptGuard();
    const receiptWarehouseCheck = await this.checkReceiptWarehouse();
    if (receiptCheck == true) {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere cerrar todos los recibos de entrega'
      );
    } else if (receiptGuardCheck == true) {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere cerrar todos los recibos de resguardo'
      );
    } else if (receiptWarehouseCheck == true) {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se requiere cerrar todos los recibos de almacén'
      );
    } else if (!receiptCheck && !receiptGuardCheck && !receiptWarehouseCheck) {
      if (
        this.receiptData?.statusReceipt == 'CERRADO' ||
        this.receiptGuardData?.statusReceiptGuard == 'CERRADO' ||
        this.receiptWarehouseData?.statusReceiptGuard == 'CERRADO'
      ) {
        if (this.proceeding.value[0].observationProceedings) {
          this.proceedingService.updateProceeding(proceeding).subscribe({
            next: () => {
              let config = {
                ...MODAL_CONFIG,
                class: 'modal-lg modal-dialog-centered',
              };

              config.initialState = {
                proceeding,
                programming: this.programming,
                typeTransferent: this.typeTransferent,
                callback: (
                  proceeding: IProceedings,
                  tranType: string,
                  typeFirm: string
                ) => {
                  if (proceeding && tranType) {
                    this.processInfoProceeding(proceeding, tranType, typeFirm);
                    //this.getProccedings();
                  }
                },
              };

              this.modalService.show(InformationRecordComponent, config);
            },
            error: error => {},
          });
        } else {
          let config = {
            ...MODAL_CONFIG,
            class: 'modal-lg modal-dialog-centered',
          };

          config.initialState = {
            proceeding,
            programming: this.programming,
            typeTransferent: this.typeTransferent,
            callback: (
              proceeding: IProceedings,
              tranType: string,
              typeFirm: string
            ) => {
              this.processInfoProceeding(proceeding, tranType, typeFirm);
              //this.getProccedings();
            },
          };

          this.modalService.show(InformationRecordComponent, config);
        }
      } else {
        this.alertInfo(
          'warning',
          'Acción Inválida',
          'Se requiere tener los recibos cerrados'
        ).then();
      }
    }
  }

  checkReceipt() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.programmingId'] = this.programmingId;
      params.getValue()['filter.actId'] = this.actId;
      params.getValue()['filter.statusReceipt'] = 'ABIERTO';

      this.receptionGoodService.getReceipt(params.getValue()).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  checkReceiptGuard() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.programmingId'] = this.programmingId;
      params.getValue()['filter.actId'] = this.actId;
      params.getValue()['filter.statusReceiptGuard'] = 'ABIERTO';
      params.getValue()['filter.typeReceipt'] = 'RESGUARDO';
      this.receptionGoodService.getReceptions(params.getValue()).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  checkReceiptWarehouse() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.programmingId'] = this.programmingId;
      params.getValue()['filter.actId'] = this.actId;
      params.getValue()['filter.statusReceiptGuard'] = 'ABIERTO';
      params.getValue()['filter.typeReceipt'] = 'ALMACEN';
      this.receptionGoodService.getReceptions(params.getValue()).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  saveInfoProceeding() {
    if (this.proceeding.value[0].observationProceedings) {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea guardar la información?'
      ).then(question => {
        if (question) {
          const formData = {
            id: this.proceeding.value[0].id,
            idPrograming: this.programming.id,
            observationProceedings:
              this.proceeding.value[0].observationProceedings,
          };

          this.proceedingService.updateProceeding(formData).subscribe({
            next: () => {
              this.alertInfo(
                'success',
                'Acción Correcta',
                'Información Guardada Correctamente'
              ).then(info => {
                if (info.isConfirmed) {
                  this.getProccedings();
                }
              });
            },
            error: error => {},
          });
        }
      });
    } else {
      this.onLoadToast(
        'warning',
        'Acción invalida',
        'No hay información para guardar'
      );
    }
  }

  processInfoProceeding(
    proceeding: IProceedings,
    tranType: string,
    typeFirm: string
  ) {
    let OIC: boolean = false;
    let uvfv: boolean = false;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = proceeding.id;
    params.getValue()['filter.idPrograming'] = this.programmingId;
    params.getValue()['filter.statusProceeedings'] = 'ABIERTO';

    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: response => {
        const _proceeding = response.data[0];
        let nomReport: string = '';
        let idTypeDoc: number = 0;

        const keyDoc: number = this.programming.id;
        const nomFun1 = _proceeding.nameWorker1;
        const nomFun2 = _proceeding.nameWorker2;
        const nomOic = _proceeding.nameWorkerOic;
        const nomUvfv = _proceeding.nameWorkerUvfv;
        const nomWit1 = _proceeding.nameWitness1;
        const nomWit2 = _proceeding.nameWitness2;
        const firmFun1 = _proceeding.electronicSignatureWorker1;
        const firmFun2 = _proceeding.electronicSignatureWorker2;
        const firmUvfv = _proceeding.electronicSignatureUvfv;
        const firmOic = _proceeding.electronicSignatureOic;
        const firmWit1 = _proceeding.electronicSignatureWitness1;
        const firmWit2 = _proceeding.electronicSignatureWitness2;

        if (tranType == 'A') {
          nomReport = 'ActaAseguradosBook.jasper';
          idTypeDoc = 106;
        } else if (tranType == 'NO') {
          nomReport = 'Acta_VoluntariasBook.jasper';
          idTypeDoc = 107;
        } else if (tranType == 'CE') {
          nomReport = 'Acta_SATBook.jasper';
          idTypeDoc = 210;
        }

        if (typeFirm == 'autografa') {
          this.loadDocument(
            nomReport,
            _proceeding.id,
            idTypeDoc,
            typeFirm,
            _proceeding
          );
        } else {
          const learnedType = idTypeDoc;
          const learnedId = this.programming.id;
          this.signatoriesService
            .getSignatoriesFilter(learnedType, learnedId)
            .subscribe({
              next: async response => {
                response.data.map(async item => {
                  this.signatoriesService
                    .deleteFirmante(Number(item.signatoryId))
                    .subscribe({
                      next: () => {},
                      error: error => {},
                    });
                });

                if (firmFun1) {
                  await this.createFirm(
                    keyDoc,
                    idTypeDoc,
                    _proceeding.id,
                    'ACTAS',
                    'FIRMA_ELECT_FUN_1',
                    nomFun1,
                    _proceeding.positionWorker1,
                    _proceeding.idCatWorker1,
                    _proceeding.idNoWorker1
                  );
                }

                if (firmFun2) {
                  await this.createFirm(
                    keyDoc,
                    idTypeDoc,
                    _proceeding.id,
                    'ACTAS',
                    'FIRMA_ELECT_FUN_2',
                    nomFun2,
                    _proceeding.positionWorker2,
                    _proceeding.idCatWorker2,
                    _proceeding.idNoWorker2
                  );
                }

                if (firmWit1) {
                  await this.createFirm(
                    keyDoc,
                    idTypeDoc,
                    _proceeding.id,
                    'ACTAS',
                    'FIRMA_ELECT_TEST_1',
                    nomWit1,
                    null,
                    _proceeding.idCatWitness1,
                    _proceeding.idNoWitness1
                  );
                }

                if (firmWit2) {
                  const createSigned = await this.createFirm(
                    keyDoc,
                    idTypeDoc,
                    _proceeding.id,
                    'ACTAS',
                    'FIRMA_ELECT_TEST_2',
                    nomWit2,
                    null,
                    _proceeding.idCatWitness2,
                    _proceeding.idNoWitness2
                  );

                  if (createSigned && tranType != 'CE') {
                    if (nomReport) {
                      this.loadDocument(
                        nomReport,
                        _proceeding.id,
                        idTypeDoc,
                        typeFirm,
                        _proceeding
                      );
                    }
                  }
                }

                if (tranType == 'CE') {
                  if (firmOic) {
                    const createOIC = await this.createFirm(
                      keyDoc,
                      idTypeDoc,
                      _proceeding.id,
                      'ACTAS',
                      'FIRMA_ELECT_OIC',
                      nomOic,
                      _proceeding.positionWorkerOic,
                      _proceeding.idCatWorkerOic,
                      _proceeding.idNoWorkerOic
                    );

                    if (createOIC) {
                      if (!firmUvfv) {
                        if (nomReport) {
                          this.loadDocument(
                            nomReport,
                            _proceeding.id,
                            idTypeDoc,
                            typeFirm,
                            _proceeding
                          );
                        }
                      } else {
                        this.loadDocument(
                          nomReport,
                          _proceeding.id,
                          idTypeDoc,
                          typeFirm,
                          _proceeding
                        );
                      }
                    }
                  }
                }
              },
              error: async error => {
                if (firmFun1) {
                  await this.createFirm(
                    keyDoc,
                    idTypeDoc,
                    _proceeding.id,
                    'ACTAS',
                    'FIRMA_ELECT_FUN_1',
                    nomFun1,
                    _proceeding.positionWorker1,
                    _proceeding.idCatWorker1,
                    _proceeding.idNoWorker1
                  );
                }

                if (firmFun2) {
                  await this.createFirm(
                    keyDoc,
                    idTypeDoc,
                    _proceeding.id,
                    'ACTAS',
                    'FIRMA_ELECT_FUN_2',
                    nomFun2,
                    _proceeding.positionWorker2,
                    _proceeding.idCatWorker2,
                    _proceeding.idNoWorker2
                  );
                }

                if (firmWit1) {
                  await this.createFirm(
                    keyDoc,
                    idTypeDoc,
                    _proceeding.id,
                    'ACTAS',
                    'FIRMA_ELECT_TEST_1',
                    nomWit1,
                    null,
                    _proceeding.idCatWitness1,
                    _proceeding.idNoWitness1
                  );
                }

                if (firmWit2) {
                  const createSigned = await this.createFirm(
                    keyDoc,
                    idTypeDoc,
                    proceeding.id,
                    'ACTAS',
                    'FIRMA_ELECT_TEST_2',
                    nomWit2,
                    null,
                    _proceeding.idCatWitness2,
                    _proceeding.idNoWitness2
                  );

                  if (createSigned && tranType != 'CE') {
                    if (nomReport) {
                      this.loadDocument(
                        nomReport,
                        this.actId,
                        idTypeDoc,
                        typeFirm,
                        _proceeding
                      );
                    }
                  }
                }

                if (tranType == 'CE') {
                  if (firmOic) {
                    const createOIC = await this.createFirm(
                      keyDoc,
                      idTypeDoc,
                      _proceeding.id,
                      'ACTAS',
                      'FIRMA_ELECT_OIC',
                      nomOic,
                      _proceeding.positionWorkerOic,
                      _proceeding.idCatWorkerOic,
                      _proceeding.idNoWorkerOic
                    );

                    if (createOIC) {
                      if (!firmUvfv) {
                        if (nomReport) {
                          this.loadDocument(
                            nomReport,
                            _proceeding.id,
                            idTypeDoc,
                            typeFirm,
                            _proceeding
                          );
                        }
                      } else {
                        this.loadDocument(
                          nomReport,
                          _proceeding.id,
                          idTypeDoc,
                          typeFirm,
                          _proceeding
                        );
                      }
                    }
                  }
                }
              },
            });
        }
      },
      error: error => {},
    });
  }

  createFirm(
    keyDoc: number,
    idTypeDoc: number,
    idReg: number,
    nomTable: string,
    nomColumn: string,
    nomPerson: string,
    chargePerson: string,
    identification: string,
    noIdent: string
  ) {
    return new Promise((resolve, reject) => {
      const formData: Object = {
        learnedId: keyDoc,
        learnedType: idTypeDoc,
        recordId: idReg,
        boardSignatory: nomTable,
        columnSignatory: nomColumn,
        name: nomPerson,
        post: chargePerson,
        identifierSignatory: identification,
        IDNumber: noIdent,
      };
      this.signatoriesService.create(formData).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {},
      });
    });
  }

  loadDocument(
    nomReport: string,
    actId: number,
    typeDoc: number,
    typeFirm: string,
    proceeding: IProceedings
  ) {
    const idTypeDoc = typeDoc;
    const idProg = this.programming.id;
    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        idTypeDoc,
        idProg,
        typeFirm,
        programming: this.programming,
        nomReport: nomReport,
        actId: actId,
        proceedingInfo: proceeding,
        callback: (next: boolean, typeFirm: string) => {
          if (next) {
            if (typeFirm == 'autografa') {
              this.uplodadReceiptDelivery(typeDoc, actId);
            } else {
              this.getProccedings();
              this.proceeding.clear();
              this.totalItemsProceedings = 0;
              this.sendEmail();
            }
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReportComponentComponent, config);
  }

  uplodadReceiptDelivery(typeDoc: number, actId: number) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      typeDoc: typeDoc,
      actId: actId,
      programming: this.programming,
      callback: (data: boolean, typeFirm: string) => {
        if (data) {
          this.getProccedings();
          this.proceeding.clear();
          this.totalItemsProceedings = 0;
          this.sendEmail();
          this.formLoading = false;
        }
      },
    };

    this.modalService.show(UploadReportReceiptComponent, config);
  }

  sendEmail() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.idPrograming'] = this.programmingId;
    params.getValue()['filter.statusProceeedings'] = 'CERRADO';
    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: async response => {
        if (response.data.length > 0) {
          const data = {
            //recipients: `gustavoangelsantosclemente@gmail.com, al221810743@gmail.com`,
            recipients: `${response.data[0].emailOic}, ${response.data[0].emailWorker1}, ${response.data[0].emailWorker2}, ${response.data[0].emailWitness1}, ${response.data[0].emailWitness2}, al221810743@gmail.com`,
            message: `Le informamos que el acta con folio: ${response.data[0].folioProceedings}, terminó satisfactoriamente.`,
            userCreation: 'dr_sigebi',
            dateCreation: '2023-07-31',
            userModification: 'dr_sigebi',
            dateModification: '2023-07-31',
            version: '2',
            subject: 'Notificación de cierre de acta de entrega recepción',
            nameAtt: response.data[0].folioProceedings,
            typeAtt: 'application/pdf;',
            //"urlAtt": "https://seguimiento.agoraparticipa.org/docs/PDF_TEXT-CA4Bn.pdf", //si cuentas con una url usas esto en ves del base64
            process: 'FORMALIZAR',
            wcontent: response.data[0].id_content,
          };
          this.emailService.createEmailNotify(data).subscribe({
            next: response => {},
          });
        }
      },
      error: error => {},
    });
  }

  close() {
    this.router.navigate(['pages/siab-web/sami/consult-tasks']);
  }

  showProceeding(proceeding: IProceedings) {
    this.wcontentService.obtainFile(this.proceedingData.id_content).subscribe({
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

  async confirm() {
    //const sendGoodInventary = await this.sendGoodsGuardInventary();
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea formalizar la programación?'
    ).then(async question => {
      if (question.isConfirmed) {
        //const sendEmailendFormalitation = this.sendEmail();
        const _task = JSON.parse(localStorage.getItem('Task'));
        const user: any = this.authService.decodeToken();
        let body: any = {};
        body['idTask'] = _task.id;
        body['userProcess'] = user.username;
        body['type'] = 'SOLICITUD_PROGRAMACION';
        body['subtype'] = 'Formalizar_Entrega';
        body['ssubtype'] = 'ACCEPT';
        const closeTaskNotification = await this.closeTaskNotification();
        if (closeTaskNotification) {
          const closeTask = await this.closeTaskExecuteRecepcion(body);
          if (closeTask) {
            const deleteGoodsReprog = await this.deleteGoodReprog();
            if (deleteGoodsReprog) {
              const updateProgramming = await this.updateProgrammingInfo();
              if (updateProgramming) {
                const sendGoodInventary = await this.sendGoodsGuardInventary();
                if (sendGoodInventary) {
                  this.alertInfo(
                    'success',
                    'Acción correcta',
                    'Se cerro la tarea formalizar entrega correctamente'
                  ).then(question => {
                    if (question.isConfirmed) {
                      this.router.navigate([
                        'pages/siab-web/sami/consult-tasks',
                      ]);
                    }
                  });
                }
              }
            }
          }
        }
      }
    });
  }

  updateProgrammingInfo() {
    return new Promise((resolve, reject) => {
      const form = {
        id: this.programming.id,
        status: 'APROBADA',
      };

      this.programmingService
        .updateProgramming(this.programming.id, form)
        .subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {
            resolve(true);
          },
        });
    });
  }

  sendGoodsGuardInventary() {
    return new Promise((resolve, reject) => {
      if (this.goodsGuards.count() > 0) {
        this.goodsGuards.getElements().then(data => {
          data.map((item: IGood) => {
            this.goodsProcessService
              .AddReceptionBpm(Number(item.id), Number(item.goodId))
              .subscribe({
                next: response => {
                  console.log('response', response);
                  resolve(true);
                },
                error: error => {
                  resolve(true);
                },
              });
          });
        });
      } else {
        resolve(true);
      }
    });
  }

  deleteGoodReprog() {
    return new Promise((resolve, reject) => {
      if (this.goodsGuards.count() > 0) {
        this.goodsGuards.getElements().then(data => {
          const deleteGoodProg = {
            programmingId: this.programming.id,
            goodId: data.goodId,
          };

          this.programmingGoodService
            .deleteGoodProgramming(deleteGoodProg)
            .subscribe({
              next: response => {
                resolve(true);
              },
              error: error => {
                resolve(true);
              },
            });
        });
      } else {
        resolve(true);
      }
    });
  }

  showBase64(id_content: string) {
    return new Promise((resolve, reject) => {
      this.wcontentService.obtainFile(id_content).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {},
      });
    });
  }

  closeTaskNotification() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      const _task = JSON.parse(localStorage.getItem('Task'));
      params.getValue()['filter.id'] = `$eq:${_task.id}`;
      this.taskService.getAll(params.getValue()).subscribe({
        next: async response => {
          const taskInfo = response.data[0];

          const user: any = this.authService.decodeToken();
          let body: any = {};
          body['idTask'] = taskInfo.identificationKey;
          body['userProcess'] = user.username;
          body['type'] = 'SOLICITUD_PROGRAMACION';
          body['subtype'] = 'Aceptar_Programacion';
          body['ssubtype'] = 'APPROVE';

          const closeTask = await this.closeTaskExecuteRecepcion(body);
          if (closeTask) {
            resolve(true);
          } else {
            resolve(true);
          }
          /*const body: ITask = {
            State: 'FINALIZADA',
          };
          this.taskService.update(taskInfo.id, body).subscribe({
            next: response => {
              console.log('cerro la tarea de notificación', response);
              resolve(true);
            },
            error: error => {
              resolve(true);
            }, 
          }); */
        },
        error: error => {
          resolve(true);
        },
      });
    });
  }

  closeTaskExecuteRecepcion(body: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          this.alertInfo('error', 'Error', 'No se pudo crear la tarea').then();
          reject(false);
        },
      });
    });
  }

  documents() {
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
  }

  showProceedingClose() {
    let config: ModalOptions = {
      initialState: {
        programming: this.programming,
        proceeding: this.proceedingData,
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: `modalSizeXL modal-dialog-centered`,
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowProceedingCloseComponent, config);
  }

  showReceipt(receipt: IRecepitGuard) {
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

  getReceiptsGuard() {
    this.paramsReceipts.getValue()['filter.statusReceiptGuard'] = 'CERRADO';
    this.paramsReceipts.getValue()['filter.actId'] = this.actId;
    this.paramsReceipts.getValue()['filter.programmingId'] = this.programmingId;
    this.receptionGoodService
      .getReceptions(this.paramsReceipts.getValue())
      .subscribe({
        next: response => {
          const filterWarehouse = response.data.map((item: any) => {
            if (item.typeReceipt == 'RESGUARDO') return item;
          });

          const infoWarehouse = filterWarehouse.filter(
            (item: IRecepitGuard) => {
              return item;
            }
          );

          //this.receiptWarehouseGood = infoWarehouse[0];

          if (infoWarehouse.length > 0) {
            const infoWarehouseFilter = infoWarehouse.map(
              (receipt: IReceipt) => {
                receipt.receiptDate = moment(receipt.receiptDate).format(
                  'DD/MM/YYYY'
                );

                return receipt;
              }
            );
            /*infoWarehouse[0].receiptDate = moment(
              infoWarehouse[0]?.receiptDate
            ).format('DD/MM/YYYY'); */

            this.receiptGuardGood.load(infoWarehouseFilter);
            this.totalItemsReceipt = this.receiptGuardGood.count();
          }

          /*const filterGuard = response.data.map((item: any) => {
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
        } */
        },
        error: error => {},
      });
  }

  getReceiptsGuardWarehouse() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    this.paramsReceiptsWarehouse.getValue()['filter.statusReceiptGuard'] =
      'CERRADO';
    this.paramsReceiptsWarehouse.getValue()['filter.actId'] = this.actId;
    this.paramsReceiptsWarehouse.getValue()['filter.programmingId'] =
      this.programmingId;
    this.receptionGoodService
      .getReceptions(this.paramsReceiptsWarehouse.getValue())
      .subscribe({
        next: response => {
          const filterWarehouse = response.data.map((item: any) => {
            if (item.typeReceipt == 'ALMACEN') return item;
          });

          const infoWarehouse = filterWarehouse.filter(
            (item: IRecepitGuard) => {
              return item;
            }
          );

          //this.receiptWarehouseGood = infoWarehouse[0];

          if (infoWarehouse.length > 0) {
            const infoWarehouseFilter = infoWarehouse.map(
              (receipt: IReceipt) => {
                receipt.receiptDate = moment(receipt.receiptDate).format(
                  'DD/MM/YYYY'
                );

                return receipt;
              }
            );
            /*infoWarehouse[0].receiptDate = moment(
              infoWarehouse[0]?.receiptDate
            ).format('DD/MM/YYYY'); */

            this.receiptWarehouseGood.load(infoWarehouseFilter);
            this.totalItemsReceiptWarehouse = this.receiptWarehouseGood.count();
          }

          /*const filterGuard = response.data.map((item: any) => {
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
        } */
        },
        error: error => {},
      });
  }

  receiptResGood(receipt: IReceipt) {
    const goodsInfoRecep: any[] = [];
    this.params.getValue()['filter.receiptId'] = receipt.id;
    this.params.getValue()['filter.actId'] = receipt.actId;
    this.params.getValue()['filter.programmationId'] = receipt.programmingId;
    this.receptionGoodService.getReceiptGood(this.params.getValue()).subscribe({
      next: response => {
        response.data.map((item: any) => {
          this.goodService.getGoodByIds(item.goodId).subscribe({
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
            },
          });
        });
      },
      error: error => {},
    });
    /*
    this.receptionGoodService.getReceiptGoodByIds(formData).subscribe({
      next: data => {
        const info = [data];
        info.map((item: any) => {
          this.goodService.getGoodByIds(item.goodId).subscribe({
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
            },
          });
        });
      },
      error: error => {},
    }); */
  }

  receiptGuardSelect(receiptGuard: IRecepitGuard) {
    const goodsInfoGuard: any[] = [];
    this.paramsGuard.getValue()['filter.receiptGuardId'] = receiptGuard.id;
    this.receptionGoodService
      .getReceptionGoods(this.paramsGuard.getValue())
      .subscribe({
        next: data => {
          data.data.map((item: any) => {
            this.goodService.getGoodByIds(item.idGood).subscribe({
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
        },
        error: error => {},
      });
  }

  receiptWarehouseSelect(receiptGuard: IRecepitGuard) {
    const goodsInfoWarehouse: any[] = [];
    this.paramsGuard.getValue()['filter.receiptGuardId'] = receiptGuard.id;
    this.receptionGoodService
      .getReceptionGoods(this.paramsGuard.getValue())
      .subscribe({
        next: data => {
          data.data.map((item: any) => {
            this.goodService.getGoodByIds(item.idGood).subscribe({
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
        },
        error: error => {},
      });
  }
}
