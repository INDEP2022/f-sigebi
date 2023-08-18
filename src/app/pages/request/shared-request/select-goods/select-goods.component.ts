import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodsResDev } from 'src/app/core/models/ms-rejectedgood/goods-res-dev-model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { AppliGoodResDevViewService } from 'src/app/core/services/ms-commer-concepts/appli-good-res-dev-inv-view.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ShowDocumentsGoodComponent } from '../expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { RequestSiabFormComponent } from '../request-siab-form/request-siab-form.component';
import { AddGoodsButtonComponent } from './add-goods-button/add-goods-button.component';
import { GrouperGoodFieldComponent } from './grouper-good-field/grouper-good-field.component';
import { ReserveGoodModalComponent } from './reserve-good-modal/reserve-good-modal.component';
import {
  GOODS_RES_DEV_INV_COLUMNS,
  SELECT_GOODS_COLUMNS,
} from './select-goods-columns';
import { ViewFileButtonComponent } from './view-file-button/view-file-button.component';

const datagood: any = [
  {
    amount: 1,
    amountToReserve: 0,
    applicationId: 1499,
    authorityId: 44,
    codeStore: 'T01',
    cveState: 2,
    delegationRegionalId: 1,
    descriptionGood:
      '01 PIEZA DE FAX MARCA: SAMSUNG, MODELO: FX500, SERIE: 3110918',
    destination: 'Ventas',
    fractionId: '8443.39.01.PZ.',
    goodId: 5011335,
    goodresdevId: '4550',
    inventoryItemId: 173813,
    inventoryNumber: '0000001756',
    invoiceRecord: 'BAJA CALIFORNIA-SAT-169-A1-18-09',
    jobNumber: '800-13-00-02-03-2018-10905',
    locatorId: 109207,
    naturalness: 'INVENTARIOS',
    organizationId: 104,
    origin: 'INVENTARIOS',
    proceedingsId: 1108,
    proceedingsType: 'ABANDONO',
    relevantTypeId: 8,
    stateConservation: 'MALO',
    statePhysical: 'MALO',
    stationId: 114,
    subinventory: 'Ventas',
    transfereeId: 120,
    uniqueKey: '110-99-06-11-000290',
    unitExtent: 'PZ',
  },
];
@Component({
  selector: 'app-select-goods',
  templateUrl: './select-goods.component.html',
  styleUrls: ['./select-goods.component.scss'],
})
export class SelectGoodsComponent extends BasePage implements OnInit {
  @ViewChild('table', { static: false }) table: any;
  goodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoodParams = new BehaviorSubject<ListParams>(new ListParams());
  selectedGoods: any[] = [];
  goodTotalItems: number = 0;
  selectedGoodTotalItems: number = 0;
  requestInfo: IRequest;
  processDet: string = '';
  goodColumns = new LocalDataSource();
  selectedGoodColumns: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Input() nombrePantalla: string = 'sinNombre';
  @Input() idRequest: number = 0;
  goodSelected: boolean = false;
  jsonBody: any = {};
  goodSettings = {
    ...TABLE_SETTINGS,
    actions: false,
  };
  selectedGoodSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };

  constructor(
    private modalService: BsModalService,
    //private activatedRoute: ActivatedRoute,

    //private goodService: GoodService,
    private genericService: GenericService,
    //private goodProcessService: GoodProcessService,
    private requestService: RequestService,
    private rejectedGoodService: RejectedGoodService,
    private affairService: AffairService,
    //private goodsInvService: GoodsInvService,
    private goodResDevInvService: AppliGoodResDevViewService,
    private goodService: GoodService
  ) {
    super();
    this.goodSettings.columns = GOODS_RES_DEV_INV_COLUMNS;
    this.selectedGoodSettings.columns = SELECT_GOODS_COLUMNS;
  }

  ngOnInit(): void {
    this.getInfoRequest();
    const self = this;
    this.goodSettings.columns = {
      addGood: {
        title: 'Agregar Bien',
        type: 'custom',
        sort: false,
        renderComponent: AddGoodsButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe(async (row: any) => {
            /*const process = await component.checkInfoProcess(row);
            if (process) {*/
            console.log('process', process);
            component.openReserveModal(row);
            /*}*/
          });
        },
      },
      viewFile: {
        title: 'Expediente',
        type: 'custom',
        sort: false,
        renderComponent: ViewFileButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            //component.requesInfo(row.requestId);
            //component.viewFile(row);
          });
        },
      },
      ...this.goodSettings.columns,
    };

    this.selectedGoodSettings.columns = {
      viewFile: {
        title: 'Expediente',
        type: 'custom',
        sort: false,
        renderComponent: ViewFileButtonComponent,
        onComponentInitFunction(instance: any, component: any = self) {
          instance.action.subscribe((row: any) => {
            //component.requesInfo(row.requestId);
          });
        },
      },
      /*goodGrouper: {
        title: 'Nombre del Bien Agrupador',
        type: 'custom',
        sort: false,
        renderComponent: GrouperGoodFieldComponent,
        onComponentInitFunction: (instance?: any, component: any = self) => {
          instance.input.subscribe((data: any) => {
            this.getGrouperGoodChanges(data);
          });
        },
      },*/
      ...this.selectedGoodSettings.columns,
    };
    //this.selectedGoodColumns = datagood;
  }

  getInfoRequest() {
    this.requestService.getById(this.idRequest).subscribe({
      next: response => {
        this.requestInfo = response;
        this.getProcessDetonate();
      },
      error: error => {},
    });
  }

  getProcessDetonate() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.nbOrigen'] = 'SAMI';
    params.getValue()['filter.id'] = this.requestInfo.affair;
    this.affairService.getAll(params.getValue()).subscribe({
      next: response => {
        this.processDet = response.data[0].processDetonate;
      },
      error: error => {},
    });
  }

  requesInfo(idRequest: number) {
    this.requestService.getById(idRequest).subscribe({
      next: response => {
        response.recordId;
        this.openModalDocument(idRequest, response.recordId);
      },
      error: error => {},
    });
  }

  openModalDocument(idRequest: number, recordId: number) {
    let config = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
    };

    config.initialState = {
      idRequest,
      recordId,
      callback: (next: boolean) => {},
    };

    this.modalService.show(ShowDocumentsGoodComponent, config);
  }

  getInfoGoods(filters: any) {
    this.jsonBody = {};
    if (
      this.processDet == 'DEVOLUCION' ||
      this.processDet == 'AMPARO' ||
      this.processDet == 'ABANDONO' ||
      this.processDet == 'DECOMISO' ||
      this.processDet == 'EXT_DOMINIO'
    ) {
      if (this.requestInfo.regionalDelegationId != 13) {
        this.params.getValue()[
          'filter.regionalDelegationId'
        ] = `$eq:${filters.regionalDelegationId}`;

        /*this.jsonBody.regionalDelegationId =
          this.requestInfo.regionalDelegationId; */
      }
    }

    if (this.processDet != 'RES_ESPECIE') {
      //params.getValue()['filter.origin'] = 'INVENTARIOS';
      //this.jsonBody.origin = 'INVENTARIOS';
    }

    if (this.processDet == 'AMPARO') {
      //params.getValue()['filter.origin'] = 'INVENTARIOS';
      this.jsonBody.origin = 'INVENTARIOS';
    }

    if (
      this.processDet == 'RES_ESPECIE' ||
      this.processDet == 'RES_PAGO_ESPECIE' ||
      this.processDet == 'RES_NUMERARIO'
    ) {
      //params.getValue()['filter.transfereeType'] = 'CE';
      this.jsonBody.transfereeType = 'CE';
    }

    if (
      this.processDet == 'ABANDONO' ||
      this.processDet == 'DECOMISO' ||
      this.processDet == 'EXT_DOMINIO'
    ) {
      //params.getValue()['filter.transfereeType'] = 'A';
      this.jsonBody.transfereeType = 'A';
    }

    for (const key in filters) {
      if (filters[key] != null && key != 'regionalDelegation') {
        //params.getValue()[key] = filters[key];
        this.jsonBody[key] = filters[key];
      }
    }

    //this.params = params;
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getGoods(filters);
    });
  }

  getGoods(info: any) {
    this.loading = true;
    if (info == false) {
      this.params = new BehaviorSubject<ListParams>(new ListParams());
      this.goodColumns = new LocalDataSource();
      this.goodTotalItems = 0;
      this.loading = false;
    } else {
      if (info.origin) {
        this.params.getValue()['filter.origin'] = `$eq:${info.origin}`;
      } else if (info.goodId) {
        this.params.getValue()['filter.goodId'] = `$eq:${info.goodId}`;
      } else if (info.uniqueKey) {
        this.params.getValue()['filter.uniqueKey'] = `$eq:${info.uniqueKey}`;
      }

      if (info.statusKey) {
        this.params.getValue()['filter.statusKey'] = `$eq:${info.statusKey}`;
      }
      if (info.warehouseCode) {
        this.params.getValue()[
          'filter.warehouseCode'
        ] = `$eq:${info.warehouseCode}`;
      }
      if (info.descriptionGood) {
        this.params.getValue()[
          'filter.descriptionGood'
        ] = `$eq:${info.descriptionGood}`;
      }
      if (info.stationId) {
        this.params.getValue()['filter.stationId'] = `$eq:${info.stationId}`;
      }
      if (info.fileId) {
        this.params.getValue()['filter.fileId'] = `$eq:${info.fileId}`;
      }
      if (info.authorityId) {
        this.params.getValue()[
          'filter.authorityId'
        ] = `$eq:${info.authorityId}`;
      }
      if (info.actFolio) {
        this.params.getValue()['filter.actFolio'] = `$eq:${info.actFolio}`;
      }
      if (info.transferFile) {
        this.params.getValue()[
          'filter.transferFile'
        ] = `$eq:${info.transferFile}`;
      }
      if (info.relevantTypeId) {
        this.params.getValue()[
          'filter.relevantTypeId'
        ] = `$eq:${info.relevantTypeId}`;
      }

      this.goodResDevInvService.getAll(this.params.getValue()).subscribe({
        next: response => {
          this.goodColumns.load(response.data);
          this.goodTotalItems = response.count;
          this.loading = false;
        },
        error: error => {
          this.loading = false;
        },
      });
    }
    /*const params = new BehaviorSubject<ListParams>(new ListParams());
    const filter = params.getValue();
    //delete this.jsonBody.regionalDelegationId
    let page = filters.page;
    let limit = filters.limit;
    this.loading = true;
    this.goodResDevInvService.getAll(this.jsonBody, page, limit).subscribe({
      next: (response: any) => {
        this.goodColumns.load(response.data);
        this.goodTotalItems = response.data.length;
        this.loading = false;
        const info = response.data.map(item => {
          return item.good;
        });
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    }); */
  }

  destinyInfo(idDestiny: number) {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.name'] = '$eq:Destino';
      params.getValue()['filter.keyId'] = idDestiny;
      this.genericService.getAll(params.getValue()).subscribe({
        next: response => {
          resolve(response.data[0].description);
        },
        error: error => {},
      });
    });
  }

  viewFile(file: any) {}

  /*checkInfoProcess(goodsResDev: IGoodsResDev) {
    return new Promise((resolve, reject) => {
      this.requestService.getById(this.idRequest).subscribe({
        next: response => {
          const params = new BehaviorSubject<ListParams>(new ListParams());
          params.getValue()['filter.nbOrigen'] = 'SAMI';
          params.getValue()['filter.id'] = response.affair;
          
        },
        error: error => {},
      });
    });
  } */

  openReserveModal(good: any) {
    if (this.processDet == 'DEVOLUCION' || this.processDet == 'RES_NUMERARIO') {
      const modalRef = this.modalService.show(ReserveGoodModalComponent, {
        initialState: { good: good, requestId: this.requestInfo.id },
        class: 'modal-md modal-dialog-centered',
        ignoreBackdropClick: true,
      });
      modalRef.content.onReserve.subscribe((data: boolean) => {
        if (data) this.addGood(data);
      });
    } else if (this.processDet != 'INFORMACION') {
      const modalRef = this.modalService.show(ReserveGoodModalComponent, {
        initialState: { good: good, requestId: this.requestInfo.id },
        class: 'modal-md modal-dialog-centered',
        ignoreBackdropClick: true,
      });
      modalRef.content.onReserve.subscribe((data: boolean) => {
        if (data) this.addGood(data);
      });
    } else {
      this.addGoodForInformation(good);
    }
  }

  addGood(good: any) {
    console.log(good);
    delete good.addGood;
    // good = Object.assign({ viewFile: '' }, good);
    this.selectedGoodColumns = [...this.selectedGoodColumns, good];
    this.selectedGoodTotalItems = this.selectedGoodColumns.length;

    if (this.processDet != 'RES_PAGO_ESPECIE') {
      this.hideResultTaxpayer(true);
    }
  }

  selectGoods(rows: any) {
    console.log(rows);
    if (rows.isSelected == false) {
      this.table.isAllSelected = false;
    }
    this.selectedGoods = rows.selected;
  }

  removeGoods() {
    if (this.selectedGoods.length == 0) {
      this.onLoadToast('warning', 'Seleccione al menos un registro');
      return;
    }
    this.alertQuestion(
      'question',
      '¿Desea eliminar los Bienes seleccionados?',
      '',
      'Eliminar'
    ).then(question => {
      if (question.isConfirmed) {
        const goodSelected = this.selectedGoods.length;
        this.selectedGoods.map(async (item: any, _i: number) => {
          const index = this.selectedGoodColumns.indexOf(item);
          const i = _i + 1;
          this.selectedGoodColumns.splice(index, 1);
          if (
            this.processDet == 'RES_ESPECIE' ||
            this.processDet == 'DEVOLUCION'
          ) {
            //elimina inventario
            this.deleteGoodDated(item);
          } else {
            // this.deleteGoodResDev(item);
          }

          if (goodSelected == i) {
            this.selectedGoodColumns = [...this.selectedGoodColumns];
            this.selectedGoodTotalItems = this.selectedGoodColumns.length;
            this.selectedGoods = [];
            this.onLoadToast('success', 'Los Bienes se eliminaron');
          }
        });

        /*this.selectedGoodColumns.forEach((g: any, i: number) => {
          this.selectedGoods.forEach((d: any, j: number) => {
            if (g.goodId == d.goodId) {
              this.selectedGoodColumns.splice(i, 1);
              this.selectedGoods.splice(j, 1);
            }
          });
        });
        this.selectedGoodColumns = [...this.selectedGoodColumns];
        this.selectedGoodTotalItems = this.selectedGoodColumns.length;
        console.log(this.selectedGoods, this.selectedGoodColumns);*/
      }
    });
  }

  openSiabSearch() {
    const modalRef = this.modalService.show(RequestSiabFormComponent, {
      initialState: {
        request: this.requestInfo,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  getGrouperGoodChanges(data: any) {
    const index = this.selectedGoodColumns.indexOf(data.data);
    if (index != -1) {
      if (data.text != '') {
        this.selectedGoodColumns[index]['goodGrouper'] = data.text;
      } else {
        this.selectedGoodColumns[index].goodGrouper = null;
      }
    }
  }

  hideResultTaxpayer(display: boolean) {
    const columnas = this.table.grid.getColumns();
    const columnaSelectRigth = columnas.find(
      (columna: any) => columna.id === 'resultTaxpayer'
    );
    columnaSelectRigth.hide = display;
  }

  assignGoodGrouper() {
    if (this.selectedGoods.length == 0) {
      this.onLoadToast('warning', 'Seleccione al menos un registro');
      return;
    }
    const modalRef = this.modalService.show(GrouperGoodFieldComponent, {
      initialState: { goodResDevs: this.selectedGoods },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.event.subscribe(next => {
      if (next != undefined) {
        next.map((item: any) => {
          const index = this.selectedGoodColumns.indexOf(item);
          this.selectedGoodColumns[index].goodGrouper = item.goodGrouper;
        });
      }
      this.selectedGoodColumns = [...this.selectedGoodColumns];
    });
  }

  deleteGoodResDev(good: any) {
    return new Promise((resolve, reject) => {
      this.rejectedGoodService.deleteGoodsResDev(good.goodresdevId).subscribe({
        next: res => {
          resolve(res);
        },
        error: error => {
          reject(error);
          this.onLoadToast('error', 'No se pudieron eliminar los Bienes');
        },
      });
    });
  }

  async deleteGoodDated(goodDevRes: any) {
    if (goodDevRes.inventoryNumber != null) {
      if (goodDevRes.reservationId != null) {
        //mandar a llamar el endpoint de ProcesosXxsaeFacade (eliminarReservaBIen)
        /* metodo */
        //si la respuesta del endpoint ProcesosXxsaeFacade fue exitosa
        const goodDeleted = await this.deleteGoodResDev(goodDevRes);
      } else {
        const goodDeleted = await this.deleteGoodResDev(goodDevRes);
      }
    } else {
      const good: any = await this.findGoodById(goodDevRes.goodId);
      if (good) {
        const body: any = {
          id: good.id,
          goodId: good.goodId,
          goodResdevId: null,
          compensation: null,
        };
        await this.updateGood(body);
      }
      const goodDeleted = await this.deleteGoodResDev(goodDevRes);
    }
  }

  findGoodById(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `$eq:${id}`;
      this.goodService
        .getAll(params)
        .pipe(
          map(x => {
            return x.data[0];
          })
        )
        .subscribe({
          next: resp => {
            resolve(resp);
          },
        });
    });
  }

  updateGood(body: any) {
    return new Promise((resolve, reject) => {
      this.goodService.update(body).subscribe({
        next: res => {
          console.log('bien actualizado');
          resolve(true);
        },
        error: error => {
          reject(false);
          this.onLoadToast('error', 'No se pudieron actualizar los Bienes');
        },
      });
    });
  }

  addGoodForInformation(good: any) {
    let goodResDev: IGoodsResDev = {};
    goodResDev.applicationId = this.idRequest; //this.good.solicitudId;
    goodResDev.goodId = good.goodId;
    goodResDev.inventoryNumber = good.inventoryNum;
    goodResDev.jobNumber = good.officeNum;
    goodResDev.proceedingsId = good.fileId;
    goodResDev.proceedingsType = good.fileType;
    goodResDev.uniqueKey = good.uniqueKey;
    goodResDev.descriptionGood = good.goodDescription;
    goodResDev.unitExtent = good.unitMeasurement;
    goodResDev.amountToReserve = good.quantity;
    (goodResDev.amount = 0), (goodResDev.statePhysical = good.physicalStatus);
    goodResDev.stateConservation = good.conservationStatus;
    goodResDev.fractionId = good.fractionId;
    goodResDev.relevantTypeId = good.typeRelevantId;
    goodResDev.destination = good.destination;
    goodResDev.delegationRegionalId = good.regionalDelegationId;
    goodResDev.cveState = good.stateKey;
    goodResDev.transfereeId = good.transferId;
    goodResDev.stationId = good.stationId;
    goodResDev.authorityId = good.authorityId;
    goodResDev.codeStore = good.warehouseCode;
    goodResDev.proceedingsType = good.fileType;
    goodResDev.locatorId = good.locatorId;
    goodResDev.inventoryItemId = good.inventoryItemId;
    goodResDev.organizationId = good.organizationId;
    goodResDev.invoiceRecord = good.folioAct;
    goodResDev.subinventory = good.destination;
    //goodResDev.origin = good.origin;
    goodResDev.naturalness =
      good.inventoryNum != null ? 'INVENTARIOS' : 'GESTION';

    console.log(goodResDev);
    this.rejectedGoodService.createGoodsResDev(goodResDev).subscribe({
      next: resp => {
        this.onLoadToast('success', 'Se agrego el bien');
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo crear el bien');
        console.log(error);
      },
    });
  }
}
