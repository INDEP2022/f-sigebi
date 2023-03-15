import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
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
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { AssignReceiptFormComponent } from '../../../shared-request/assign-receipt-form/assign-receipt-form.component';
import { GenerateReceiptFormComponent } from '../../../shared-request/generate-receipt-form/generate-receipt-form.component';
import { PhotographyFormComponent } from '../../../shared-request/photography-form/photography-form.component';
import { ESTATE_COLUMNS_VIEW } from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS_SHOW } from '../../acept-programming/columns/users-columns';
import { DocumentsListComponent } from '../documents-list/documents-list.component';
import { EditGoodFormComponent } from '../edit-good-form/edit-good-form.component';
import { ReschedulingFormComponent } from '../rescheduling-form/rescheduling-form.component';
import { RECEIPT_COLUMNS } from './columns/minute-columns';
import { receipts, tranGoods } from './execute-reception-data';

@Component({
  selector: 'app-execute-reception-form',
  templateUrl: './execute-reception-form.component.html',
  styleUrls: ['./execute-reception.scss'],
})
export class ExecuteReceptionFormComponent extends BasePage implements OnInit {
  isDropup = true;
  goods: any[] = [];
  goodsGuard: IGood[] = [];
  goodsWareh: IGood[] = [];
  goodsSelect: IGood[] = [];
  executeForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsProceeding = new BehaviorSubject<ListParams>(new ListParams());
  paramsAuthority = new BehaviorSubject<ListParams>(new ListParams());
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
    private proccedingService: ProceedingsService
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
    this.showDataProgramming();

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
        console.log('información', data);
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
    this.proccedingService
      .getProceedings(this.paramsProceeding.getValue())
      .subscribe({
        next: response => {
          console.log('res', response);
        },
      });
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
          this.headingWarehouse = `Almacén SAE(${this.goodsWarehouse.count()})`;
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
          this.usersData.load(response.data);
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
