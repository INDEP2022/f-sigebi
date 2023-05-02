import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, takeUntil, throwError } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
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
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AssignReceiptFormComponent } from '../../../shared-request/assign-receipt-form/assign-receipt-form.component';
import { GenerateReceiptFormComponent } from '../../../shared-request/generate-receipt-form/generate-receipt-form.component';
import { PhotographyFormComponent } from '../../../shared-request/photography-form/photography-form.component';
import { ESTATE_COLUMNS_VIEW } from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS_SHOW } from '../../acept-programming/columns/users-columns';
import { GenerateReceiptGuardFormComponent } from '../../shared-components-programming/generate-receipt-guard-form/generate-receipt-guard-form.component';
import { GoodsReceiptsFormComponent } from '../../shared-components-programming/goods-receipts-form/goods-receipts-form.component';
import { DocumentsListComponent } from '../documents-list/documents-list.component';
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
  executeForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsProceeding = new BehaviorSubject<ListParams>(new ListParams());
  paramsAuthority = new BehaviorSubject<ListParams>(new ListParams());
  paramsReception = new BehaviorSubject<ListParams>(new ListParams());
  paramsGuard = new BehaviorSubject<ListParams>(new ListParams());
  paramsGoodsWarehouse = new BehaviorSubject<ListParams>(new ListParams());
  goodsWarehouse: LocalDataSource = new LocalDataSource();
  ubicationWarehouse: string = '';
  totalItems: number = 0;
  totalItemsGuard: number = 0;
  totalItemsWarehouse: number = 0;
  programmingId: number = 0;
  idTransferent: any;
  idRegDelegation: any;
  idTypeRelevat: any;
  headingGuard: string = `Resguardo(0)`;
  headingWarehouse: string = `Almacén SAT(0)`;
  idStation: any;

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
    private receptionService: ReceptionGoodService
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
    this.showHideErrorInterceptorService.showHideError(false);
    this.prepareForm();
    this.showDataProgramming();
    this.showReceiptsGuard();

    this.paramsGuard
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodsProgramming());
  }

  prepareForm() {
    this.executeForm = this.fb.group({
      goodsProg: this.fb.array([]),
      descriptionGoodSae: [null],
      quantitySae: [null],
      saeMeasureUnit: [null],
      saePhysicalState: [null],
      stateConservationSae: [null],
      selectColumn: [null],
    });
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
        this.programming.regionalDelegationNumber = data.description;
      });
  }

  getTransferent(data: Iprogramming) {
    this.transferentService.getById(data.tranferId).subscribe(data => {
      this.programming.tranferId = data.nameTransferent;
    });
  }

  getStation(data: Iprogramming) {
    this.stationService.getById(data.stationId).subscribe(data => {
      this.programming.stationId = data.stationName;
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
        this.programming.autorityId = authority.authorityName;
      });
  }

  getTypeRelevant() {
    return this.typeRelevantService
      .getById(this.programming.typeRelevantId)
      .subscribe(data => {
        this.programming.typeRelevantId = data.description;
      });
  }

  getwarehouse() {
    return this.warehouseService
      .getById(this.programming.storeId)
      .subscribe(data => {
        this.programming.storeId = data.description;
        this.ubicationWarehouse = data.ubication;
      });
  }

  /*------------- function button to show info programming ---*/
  getReportGoods() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getInfoGoodsProgramming());
  }

  /*----------Show info goods programming --------- */
  getInfoGoodsProgramming() {
    const filterColumns: Object = {
      regionalDelegation: Number(this.idRegDelegation),
      transferent: Number(this.idTransferent),
      relevantType: Number(this.idTypeRelevat),
      statusGood: 'APROBADO',
    };

    this.goodsQueryService
      .postGoodsProgramming(this.params.getValue(), filterColumns)
      .subscribe({
        next: response => {
          const filterData = response.data.map(items => {
            if (items.physicalState == 1 || items.stateConservation == 1) {
              items.physicalState = 'BUENO';
              items.stateConservation = 'BUENO';
              return items;
            } else if (
              items.physicalState == 2 ||
              items.stateConservation == 2
            ) {
              items.physicalState = 'MALO';
              items.stateConservation = 'MALO';
              return items;
            }
          });
          this.goods = filterData;

          /*for (let i = 0; i < this.goods.length; i++) {
            console.log('info', this.goods[i].quantitySae);
            this.executeForm.get('quantitySae').setValue(this.goods[i].quantitySae);
            console.log(this.executeForm.get('quantitySae').value);
          } */
          /*this.goods.forEach(item => {
            console.log(item.quantitySae);
            this.executeForm.patchValue({ quantitySae: item.quantitySae });
            this.executeForm.reset()
          }) */
        },
        error: error => (this.loading = false),
      });
  }

  /*infoGoods() {
    this.goods.forEach(items => {
      console.log(items.quantitySae);
      this.executeForm.get('quantitySae').setValue(items.quantitySae);
      console.log('mee', this.executeForm.get('quantitySae').value)
    })
  } */

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
          this.getReportGoods();
        });
      }
    });
  }

  //Actualizar información de la transferente//
  updateInfoGoodTransferent(goodNumber: number) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      goodNumber,
      callback: (data: boolean) => {
        if (data) {
          console.log(data);
        }
      },
    };

    this.modalService.show(EditGoodFormComponent, config);
  }

  /*----------Mostrar bienes transportable, resguardo y almacén-------------*/

  getGoodsProgramming() {
    this.paramsGuard.getValue()['filter.programmingId'] = this.programmingId;
    this.programmingService
      .getGoodsProgramming(this.paramsGuard.getValue())
      .subscribe(data => {
        this.getGoodsGuards(data.data);
        this.getGoodsWarehouse(data.data);
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
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const uploadDocuments = this.modalService.show(
      DocumentsListComponent,
      config
    );
  }

  uploadPicture() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const uploadPictures = this.modalService.show(
      PhotographyFormComponent,
      config
    );
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

  showEstate() {
    alert('vista imprimir reporte');
  }

  delete() {}
}
