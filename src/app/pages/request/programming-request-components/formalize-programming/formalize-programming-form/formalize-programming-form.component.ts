import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodProgramming } from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IGood } from 'src/app/core/models/good/good.model';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { ITask } from 'src/app/core/models/ms-task/task-model';
import { IReceipt } from 'src/app/core/models/receipt/receipt.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ESTATE_COLUMNS_VIEW } from '../../acept-programming/columns/estate-columns';
import {
  RECEIPT_COLUMNS_FORMALIZE,
  RECEIPT_GUARD_COLUMNS,
} from '../../execute-reception/execute-reception-form/columns/minute-columns';
import { TRANSPORTABLE_GOODS_FORMALIZE } from '../../execute-reception/execute-reception-form/columns/transportable-goods-columns';
import { ShowReportComponentComponent } from '../../execute-reception/show-report-component/show-report-component.component';
import { UploadReportReceiptComponent } from '../../execute-reception/upload-report-receipt/upload-report-receipt.component';
import { InformationRecordComponent } from '../information-record/information-record.component';

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
  receiptData: IReceipt;
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
    actions: false,
    columns: RECEIPT_COLUMNS_FORMALIZE,
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

  settingsMinutes = { ...TABLE_SETTINGS };
  /*settingsMinutes = {
    ...this.settings,
    columns: MINUTES_COLUMNS,

    //edit: { editButtonContent: '<i class="fa fa-book text-warning mx-2"></i>' },
    
    //actions: { columnTitle: 'Generar / cerrar acta', position: 'right' }, 
  }; */

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
    private authService: AuthService
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

  getProccedings() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.idPrograming'] = this.programmingId;
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
        this.getTask();
        //this.getUsersProgramming();
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getInfoGoodsProgramming());
      });
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
    params.getValue()['filter.idWarehouse'] = this.programming.storeId;
    this.warehouseService.getAll(params.getValue()).subscribe(data => {
      this.nameWarehouse = data.data[0].description;
      this.ubicationWarehouse = data.data[0].ubication;
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

  generateMinute(proceeding: IProceedings) {
    if (this.receiptData.statusReceipt == 'ABIERTO') {
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
              callback: (proceeding: IProceedings, tranType: string) => {
                if (proceeding && tranType) {
                  this.processInfoProceeding(proceeding, tranType);
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
          callback: (proceeding: IProceedings, tranType: string) => {
            if (proceeding && tranType) {
              this.processInfoProceeding(proceeding, tranType);
              //this.getProccedings();
            }
          },
        };

        this.modalService.show(InformationRecordComponent, config);
      }
    } else {
      this.alertInfo(
        'info',
        'Acción Inválida',
        'Se requiere tener los recibos cerrados'
      ).then();
    }
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

  processInfoProceeding(proceeding: IProceedings, tranType: string) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    let nomReport: string = '';
    let idTypeDoc: number = 0;
    params.getValue()['filter.id'] = proceeding.id;
    params.getValue()['filter.idProgramming'] = this.programmingId;
    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: response => {
        const proceeding = response.data[0];
        //const keyDoc = proceeding.programmingId + '-' + proceeding.actId;
        const keyDoc: number = this.programming.id;
        let no_auto: number = 0;
        let no_electronicF: number = 0;
        let autog: boolean = false;
        let elect: boolean = false;
        let OIC: boolean = false;
        let uvfv: boolean = false;

        const nomFun1 = proceeding.nameWorker1;
        const nomFun2 = proceeding.nameWorker2;
        const nomOic = proceeding.nameWorkerOic;
        const nomUvfv = proceeding.nameWorkerUvfv;
        const nomWit1 = proceeding.nameWitness1;
        const nomWit2 = proceeding.nameWitness2;
        const firmFun1 = proceeding.electronicSignatureWorker1;
        const firmFun2 = proceeding.electronicSignatureWorker2;
        const firmUvfv = proceeding.electronicSignatureUvfv;
        const firmOic = proceeding.electronicSignatureOic;
        const firmWit1 = proceeding.electronicSignatureWitness1;
        const firmWit2 = proceeding.electronicSignatureWitness2;

        if (nomFun1) {
          if (firmFun1) {
            no_electronicF++;
          } else {
            no_auto++;
          }
        }

        if (nomFun2) {
          if (firmFun2) {
            no_electronicF++;
          } else {
            no_auto++;
          }
        }

        if (nomWit1) {
          if (firmWit1) {
            no_electronicF++;
          } else {
            no_auto++;
          }
        }

        if (nomWit2) {
          if (firmWit2) {
            no_electronicF++;
          } else {
            no_auto++;
          }
        }

        if (tranType == 'CE') {
          if (nomOic) {
            OIC = true;
            if (firmOic) {
              no_electronicF++;
            } else {
              no_auto++;
            }
          }

          if (nomUvfv) {
            uvfv = true;
            if (firmUvfv) {
              no_electronicF++;
            } else {
              no_auto++;
            }
          }
        }

        if (no_auto > 0) {
          autog = true;
        } else if (no_electronicF > 0) {
          elect = true;
        }

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
                  proceeding.id,
                  'ACTAS',
                  'FIRMA_ELECT_FUN_1',
                  nomFun1,
                  proceeding.positionWorker1,
                  proceeding.idCatWorker1,
                  proceeding.idNoWorker1
                );
              }

              if (firmFun2) {
                await this.createFirm(
                  keyDoc,
                  idTypeDoc,
                  proceeding.id,
                  'ACTAS',
                  'FIRMA_ELECT_FUN_2',
                  nomFun2,
                  proceeding.positionWorker2,
                  proceeding.idCatWorker2,
                  proceeding.idNoWorker2
                );
              }

              if (firmWit1) {
                await this.createFirm(
                  keyDoc,
                  idTypeDoc,
                  proceeding.id,
                  'ACTAS',
                  'FIRMA_ELECT_TEST_1',
                  nomWit1,
                  null,
                  proceeding.idCatWitness1,
                  proceeding.idNoWitness1
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
                  proceeding.idCatWitness2,
                  proceeding.idNoWitness2
                );

                if (createSigned && tranType != 'CE') {
                  if (nomReport) {
                    this.loadDocument(nomReport, proceeding.id, idTypeDoc);
                  }
                }
              }

              if (tranType == 'CE') {
                if (OIC) {
                  if (firmOic) {
                    const createOIC = await this.createFirm(
                      keyDoc,
                      idTypeDoc,
                      proceeding.id,
                      'ACTAS',
                      'FIRMA_ELECT_OIC',
                      nomOic,
                      proceeding.positionWorkerOic,
                      proceeding.idCatWorkerOic,
                      proceeding.idNoWorkerOic
                    );

                    if (createOIC) {
                      if (uvfv) {
                        if (firmUvfv) {
                          const createsig = await this.createFirm(
                            keyDoc,
                            idTypeDoc,
                            proceeding.id,
                            'ACTAS',
                            'FIRMA_ELECT_UVFV',
                            nomUvfv,
                            proceeding.positionWorkerUvfv,
                            null,
                            null
                          );

                          if (createsig) {
                            if (nomReport) {
                              this.loadDocument(
                                nomReport,
                                proceeding.id,
                                idTypeDoc
                              );
                            }
                          }
                        } else {
                          this.loadDocument(
                            nomReport,
                            proceeding.id,
                            idTypeDoc
                          );
                        }
                      }
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
                  proceeding.id,
                  'ACTAS',
                  'FIRMA_ELECT_FUN_1',
                  nomFun1,
                  proceeding.positionWorker1,
                  proceeding.idCatWorker1,
                  proceeding.idNoWorker1
                );
              }

              if (firmFun2) {
                await this.createFirm(
                  keyDoc,
                  idTypeDoc,
                  proceeding.id,
                  'ACTAS',
                  'FIRMA_ELECT_FUN_2',
                  nomFun2,
                  proceeding.positionWorker2,
                  proceeding.idCatWorker2,
                  proceeding.idNoWorker2
                );
              }

              if (firmWit1) {
                await this.createFirm(
                  keyDoc,
                  idTypeDoc,
                  proceeding.id,
                  'ACTAS',
                  'FIRMA_ELECT_TEST_1',
                  nomWit1,
                  null,
                  proceeding.idCatWitness1,
                  proceeding.idNoWitness1
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
                  proceeding.idCatWitness2,
                  proceeding.idNoWitness2
                );

                if (createSigned && tranType != 'CE') {
                  if (nomReport) {
                    this.loadDocument(nomReport, this.actId, idTypeDoc);
                  }
                }
              }

              if (tranType == 'CE') {
                if (OIC) {
                  if (firmOic) {
                    const createOIC = await this.createFirm(
                      keyDoc,
                      idTypeDoc,
                      proceeding.id,
                      'ACTAS',
                      'FIRMA_ELECT_OIC',
                      nomOic,
                      proceeding.positionWorkerOic,
                      proceeding.idCatWorkerOic,
                      proceeding.idNoWorkerOic
                    );

                    if (createOIC) {
                      if (uvfv) {
                        if (firmUvfv) {
                          const createsig = await this.createFirm(
                            keyDoc,
                            idTypeDoc,
                            proceeding.id,
                            'ACTAS',
                            'FIRMA_ELECT_UVFV',
                            nomUvfv,
                            proceeding.positionWorkerUvfv,
                            null,
                            null
                          );

                          if (createsig) {
                            if (nomReport) {
                              this.loadDocument(
                                nomReport,
                                this.actId,
                                idTypeDoc
                              );
                            }
                          }
                        } else {
                          if (nomReport) {
                            this.loadDocument(nomReport, this.actId, idTypeDoc);
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
          });
        //const nomFun1 = proceeding.
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

  loadDocument(nomReport: string, actId: number, typeDoc: number) {
    const idTypeDoc = typeDoc;
    const idProg = this.programming.id;
    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        idTypeDoc,
        idProg,
        programming: this.programming,
        nomReport: nomReport,
        actId: actId,
        callback: (next: boolean) => {
          if (next) {
            this.uplodadReceiptDelivery(typeDoc, actId);
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
      callback: (data: boolean) => {
        if (data) {
          this.getProccedings();
        }
      },
    };

    this.modalService.show(UploadReportReceiptComponent, config);
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
    if (this.proceedingData.statusProceeedings == 'CERRADO') {
      this.alertQuestion(
        'question',
        'Confirmación',
        '¿Desea formalizar la programación?'
      ).then(async question => {
        if (question.isConfirmed) {
          const _task = JSON.parse(localStorage.getItem('Task'));
          const user: any = this.authService.decodeToken();
          let body: any = {};
          body['idTask'] = _task.id;
          body['userProcess'] = user.username;
          body['type'] = 'SOLICITUD_PROGRAMACION';
          body['subtype'] = 'Formalizar_Entrega';
          body['ssubtype'] = 'ACCEPT';

          const closeTask = await this.closeTaskExecuteRecepcion(body);
          if (closeTask) {
            this.alertInfo(
              'success',
              'Acción correcta',
              'Se cerro la tarea formalizar entrega correctamente'
            ).then(question => {
              if (question.isConfirmed) {
                this.router.navigate(['pages/siab-web/sami/consult-tasks']);
              }
            });
          }
        }
      });
    } else {
      this.alertInfo(
        'info',
        'Acción Inválida',
        'Se necesita cerrar el acta'
      ).then();
    }
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

  documents() {}
}
