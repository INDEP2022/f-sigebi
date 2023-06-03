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
import { BehaviorSubject, catchError, takeUntil, throwError } from 'rxjs';
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
import { EditGoodFormComponent } from '../edit-good-form/edit-good-form.component';
import { ReschedulingFormComponent } from '../rescheduling-form/rescheduling-form.component';
import {
  RECEIPT_COLUMNS,
  RECEIPT_GUARD_COLUMNS,
} from './columns/minute-columns';
import { receipts, tranGoods } from './execute-reception-data';

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
  buildForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsProceeding = new BehaviorSubject<ListParams>(new ListParams());
  paramsAuthority = new BehaviorSubject<ListParams>(new ListParams());
  paramsStation = new BehaviorSubject<ListParams>(new ListParams());
  paramsReception = new BehaviorSubject<ListParams>(new ListParams());
  paramsGuard = new BehaviorSubject<ListParams>(new ListParams());
  paramsGoodsWarehouse = new BehaviorSubject<ListParams>(new ListParams());
  goodsWarehouse: LocalDataSource = new LocalDataSource();
  nameWarehouse: string = '';
  ubicationWarehouse: string = '';
  totalItems: number = 0;
  totalItemsGuard: number = 0;
  totalItemsWarehouse: number = 0;
  selectGood: IGood;
  goodIdSelect: string | number;
  programmingId: number = 0;
  idTransferent: any;
  idRegDelegation: any;
  idTypeRelevat: any;
  headingGuard: string = `Resguardo(0)`;
  headingWarehouse: string = `Almacén SAT(0)`;
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
  receipts = receipts;
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
    private genericService: GenericService
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
    this.formLoading = true;
    this.showDataProgramming();

    this.paramsGuard
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsProgramming());

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

  get goodsTransportable() {
    return this.executeForm.get('goodsTransportable') as FormArray;
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
    this.formLoading = true;
    this.goodsTransportable.reset();
    this.params.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getGoodsProgramming(this.params.getValue())
      .subscribe(data => {
        this.filterStatusTrans(data.data);
        /*
        this.filterStatusGuard(data.data);
        this.filterStatusWarehouse(data.data); */
      });
  }

  filterStatusTrans(data: IGoodProgramming[]) {
    const goodsTrans = data.filter(items => {
      return items.status == 'EN_TRANSPORTABLE';
    });

    goodsTrans.map(items => {
      this.goodService.getGoodByIds(items.goodId).subscribe({
        next: response => {
          console.log('repsonse', response);
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
          this.goodsTransportable.clear();
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
          this.goodsTransportable.push(form);
          this.goodsTransportable.updateValueAndValidity();
          this.formLoading = false;

          /*if (response.saePhysicalState == 1)
            response.saePhysicalState = 'BUENO';
          if (response.saePhysicalState == 2)
            response.saePhysicalState = 'MALO';
          if (response.decriptionGoodSae == null)
            response.decriptionGoodSae = 'Sin descripción';
          // queda pendiente mostrar el alías del almacén // */
          //this.goodsTranportables.load(this.goodsInfoTrans);
          //this.totalItemsTransportable = this.goodsTranportables.count();
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
          console.log('Unit measure', resp);
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
          console.log('data', data);
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
          console.log('status', data);
          this.statusPhysical = data.data;
        },
      });
  }

  goodSelect(good: IGood) {
    this.goodIdSelect = good.id;
    this.selectGood = good;
  }

  infoGoods() {
    this.goods.forEach(items => {
      console.log(items.quantitySae);
      this.executeForm.get('quantitySae').setValue(items.quantitySae);
      console.log('mee', this.executeForm.get('quantitySae').value);
    });
  }

  // Actualizar la información del bien //
  updateInfoGood(goodNumber: number, goodId: number) {
    console.log('numero de bien', goodNumber);
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
        console.log('Se manda', GoodData);
        this.goodService.updateByBody(GoodData).subscribe(() => {
          this.onLoadToast('success', 'Bien actualizado correctamente', '');
          //this.getReportGoods();
        });
      }
    });
  }

  /*----------Mostrar bienes transportable, resguardo y almacén-------------*/

  getGoodsProgramming() {
    /*this.paramsGuard.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getGoodsProgramming(this.paramsGuard.getValue())
      .subscribe(data => {
        this.getGoodsGuards(data.data);
        this.getGoodsWarehouse(data.data);
        this.formLoading = false;
      }); */
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
          this.goodsGuard.push(response);
          console.log('Bienes', response);
          this.guardGoods.load(this.goodsGuard);
          this.totalItemsGuard = this.guardGoods.count();
          this.headingGuard = `Resguardo(${this.guardGoods.count()})`;
        },
      });
    });
    /*const infoGood = filter.map(goods => {
      return goods.view;
    });
    this.guardGoods.load(infoGood);
    console.log('guards goods', this.guardGoods); */
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
          this.checkProccedingsExist();
        }
      });
    } else {
      this.onLoadToast('warning', 'Se necesita tener un bien seleccionado', '');
    }
  }

  //Verificar si hay actas abiertas y relacionadas a la programación//
  checkProccedingsExist() {
    this.paramsProceeding.getValue()['filter.statusProceeedings'] = 'ABIERTO';
    this.paramsProceeding.getValue()['filter.idPrograming'] =
      this.programmingId;

    this.proccedingService
      .getProceedings(this.paramsProceeding.getValue())
      .pipe(
        catchError(error => {
          if (error.status == 400) {
            this.createProceeding();
          } else {
            this.showProceedings();
          }
          return throwError(() => error);
        })
      )
      .subscribe(data => {
        console.log(data);
      });
  }

  //----------------Creando actas----------------------------------
  createProceeding() {
    const formData: Object = {
      id: '108',
      idPrograming: Number(this.programmingId),
      status: null,
    };

    console.log(formData);
    this.proccedingService.createProceedings(formData).subscribe({
      next: response => {
        this.onLoadToast(
          'success',
          'Bienes agregados a el acta correctamente',
          ''
        );
        console.log('Acta creada', response);
        this.generateReceipt(response.id);
      },
    });
  }

  //----------------Mostrando actas-------------------------------
  showProceedings() {
    console.log('Mostrando actas');
  }

  //Generando el recibo resguardo y los bienes del recibo resguardo
  generateReceipt(idProceeding: number) {
    //Primero se crea el recibo
    const formData: Object = {
      id: 456400,
      programmingId: Number(this.programmingId),
      receiptDate: '2023-03-16',
      typeReceipt: 'RESGUARDO',
      actId: Number(idProceeding),
      statusReceiptGuard: 'ABIERTO',
      creationUser: 'sigebiadmon',
      creationDate: new Date(),
      modificationUser: 'sigebiadmon',
      modificationDate: new Date(),
    };

    this.receptionService.createReception(formData).subscribe({
      next: response => {
        this.assingGoodsGuards(response.id);
      },
    });
  }

  //Se insertan los bienes a ese recibo
  assingGoodsGuards(receiptId: number) {
    this.goodsSelect.forEach(item => {
      const formData: Object = {
        receiptGuardId: Number(receiptId),
        idGood: item.id,
        creationUser: 'sigebiadmon',
        creationDate: '2023-03-16',
        modificationUser: 'sigebiadmon',
        modificationDate: '2023-03-16',
        version: 1,
      };

      this.receptionService.createReceptionGoods(formData).subscribe({
        next: () => {
          this.showReceiptsGuard();
        },
      });
    });
  }

  //Mostrando recibo
  showReceiptsGuard() {
    this.paramsReception.getValue()['filter.typeReceipt'] = 'RESGUARDO';
    this.paramsReception.getValue()['filter.programmingId'] =
      this.programmingId;
    return this.receptionService
      .getReceptions(this.paramsReception.getValue())
      .subscribe({
        next: response => {
          this.receiptGuards = response.data;
          console.log('recibos', response.data);
        },
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

  /*-----------------Bienes en almacén---------------------------*/
  getGoodsWarehouse(data: IGoodProgramming[]) {
    const filter = data.filter(item => {
      return item.status == 'EN_ALMACÉN';
    });

    filter.map(items => {
      this.goodService.getById(items.goodId).subscribe({
        next: response => {
          this.goodsWareh.push(response);
          this.goodsWarehouse.load(this.goodsWareh);
          this.totalItemsWarehouse = this.goodsWarehouse.count();
          this.headingWarehouse = `Almacén INDEP(${this.goodsWarehouse.count()})`;
        },
      });
    });
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
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const assignReceipt = this.modalService.show(
      AssignReceiptFormComponent,
      config
    );
  }

  rescheduling() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const rescheduling = this.modalService.show(
      ReschedulingFormComponent,
      config
    );
  }

  showGood(data: IGood) {
    console.log('good', data);
    console.log('programming', this.programming);
    let report = '/showReport?nombreReporte=Etiqueta_TDR.jasper&CID_BIEN=';
    report += [data.goodId];
    console.log('report', report);
  }

  delete() {}
}
