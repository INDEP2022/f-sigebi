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
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
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
import { IReception } from 'src/app/core/models/ms-reception-good/reception-good.model';
import { IReceipt } from 'src/app/core/models/receipt/receipt.model';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { WarehouseService } from 'src/app/core/services/catalogs/warehouse.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { PhotographyFormComponent } from '../../../shared-request/photography-form/photography-form.component';
import { ESTATE_COLUMNS_VIEW } from '../../acept-programming/columns/estate-columns';
import { CancelationGoodFormComponent } from '../../execute-reception/cancelation-good-form/cancelation-good-form.component';
import { DocumentsListComponent } from '../../execute-reception/documents-list/documents-list.component';
import {
  RECEIPT_COLUMNS,
  RECEIPT_GUARD_COLUMNS,
} from '../../execute-reception/execute-reception-form/columns/minute-columns';
import { TRANSPORTABLE_GOODS_FORMALIZE } from '../../execute-reception/execute-reception-form/columns/transportable-goods-columns';
import { GenerateReceiptGuardFormComponent } from '../../shared-components-programming/generate-receipt-guard-form/generate-receipt-guard-form.component';
import { GoodsReceiptsFormComponent } from '../../shared-components-programming/goods-receipts-form/goods-receipts-form.component';
import { MINUTES_COLUMNS } from '../columns/minutes-columns';
import { InformationRecordComponent } from '../information-record/information-record.component';
import { minutes, tranGoods } from './formalize-programmig.data';

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
  receiptGuards: IReception[] = [];
  goodsGuard: IGood[] = [];
  goodsRepro: IGood[] = [];
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

  settingsMinutes = {
    ...this.settings,
    columns: MINUTES_COLUMNS,
    edit: { editButtonContent: '<i class="fa fa-book text-warning mx-2"></i>' },
    actions: { columnTitle: 'Generar / cerrar acta', position: 'right' },
  };

  settingsTranGoods = {
    ...this.settings,
    selectMode: 'multi',
    columns: TRANSPORTABLE_GOODS_FORMALIZE,
    actions: false,
    // edit: {
    //   confirmSave: true,
    //   editButtonContent: '<i class="fa fa-edit"></i>', // Icono de edición
    //   cancelButtonContent: '<i class="fa fa-times"></i>', // Icono de cancelar
    //   saveButtonContent: '<i class="fa fa-check"></i>', // Icono de actualizar
    // },
    // actions: {
    //   add: false,
    //   delete: false,
    //   edit: true,
    // },
  };

  minutes = minutes;

  nameTransferent: string = '';
  nameStation: string = '';

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
    private programmingGoodService: ProgrammingGoodService
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

  getProgrammingData() {
    this.programmingService.getProgrammingId(this.programmingId).subscribe({
      next: data => {
        console.log('data', data);
        this.programming = data;
        this.idTransferent = data.tranferId;
        this.idStation = data.stationId;
        this.getRegionalDelegation();
        this.getTransferent(data);
        this.getStation(data);
        this.getAuthority();
        this.getTypeRelevant();
        this.getwarehouse();
      },
      error: error => {},
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
  formDataTrans(good: IGood[]) {
    console.log('goodsTrans', good);
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
        if (data) {
        }
      },
    };

    const generateMinute = this.modalService.show(
      InformationRecordComponent,
      config
    );
  }

  getRegionalDelegation() {
    this.regionalDelegationService
      .getById(this.programming.regionalDelegationNumber)
      .subscribe(data => {
        this.programming.regionalDelegationNumber = data.description;
      });
  }
  showGood(data: IGood) {
    let report = '/showReport?nombreReporte=Etiqueta_TDR.jasper&CID_BIEN=';
    report += [data.goodId];
  }
  // getTransferent() {
  //   this.transferentService
  //     .getById(this.programming.tranferId)
  //     .subscribe(data => {
  //       this.nameTransferent = data.nameTransferent;
  //     });
  // }
  getTransferent(data: Iprogramming) {
    this.transferentService.getById(data.tranferId).subscribe(data => {
      this.transferentName = data.nameTransferent;
    });
  }

  // getStation(data: Iprogramming) {
  //   this.paramsStation.getValue()['filter.id'] = this.programming.stationId;
  //   this.paramsStation.getValue()['filter.idTransferent'] =
  //     this.programming.tranferId;

  //   this.stationService.getAll(this.paramsStation.getValue()).subscribe({
  //     next: response => {
  //       this.nameStation = response.data[0].stationName;
  //     },
  //     error: error => {
  //       console.log(error);
  //     },
  //   });
  // }
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

    this.authorityService.getAll(this.paramsAuthority.getValue()).subscribe({
      next: response => {
        let authority = response.data.find(res => {
          return res;
        });
        this.authorityName = authority.authorityName;
      },
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

  confirm() {}

  close() {}
  //Bienes seleccionados//
  goodsSelects(data: any) {
    this.goodsSelect = data;
  }
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
          //
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
