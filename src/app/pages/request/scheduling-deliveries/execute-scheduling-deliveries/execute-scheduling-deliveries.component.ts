import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, takeUntil } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { CertificatesDeliveryService } from 'src/app/core/services/ms-delivery-constancy/certificates-delivery.service';
import { CertificatesGoodsService } from 'src/app/core/services/ms-delivery-constancy/certificates-goods.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { JSON_TO_CSV } from 'src/app/pages/admin/home/constants/json-to-csv';
import { DeliveriesConstancyFormComponent } from '../deliveries-constancy-form/deliveries-constancy-form.component';
import { DocumentConstanceModalComponent } from '../document-constance-modal/document-constance-modal.component';
import { PhotosConstanceModalComponent } from '../photos-constance-modal/photos-constance-modal.component';
import { TypeDeliveryModelComponent } from '../type-delivery-model/type-delivery-model.component';
import {
  CONSTANCY_DELIVERY_COLUMNS,
  GOOD_DELIVERY_COLUMN,
  PROG_DELIVERY_GOOD_TYPE_REST_COLUMNS,
} from './columns/good-delivery-columns';

@Component({
  selector: 'app-execute-scheduling-deliveries',
  templateUrl: './execute-scheduling-deliveries.component.html',
  styleUrls: ['./execute-scheduling-deliveries.scss'],
})
export class ExecuteSchedulingDeliveriesComponent
  extends BasePage
  implements OnInit
{
  @ViewChild('table', { static: false }) table: any;
  @ViewChild('table2', { static: false }) table2: any;
  showSearchForm: boolean = true;
  constancyDelivered: boolean = false;
  constancyNoDelivered: boolean = false;
  constancyNoAcept: boolean = false;
  constancyNoRetired: boolean = false;
  showDetailProgDestruc: boolean = true;

  statusProgramming: string = '';

  programmingDetailPanel: any = {};
  GoodDeliverySettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };
  goodDeliveryArray: any = [];
  goodParams = new BehaviorSubject<ListParams>(new ListParams());
  devgoodTotalItems: number = 0;
  goodDeliveryColumns = GOOD_DELIVERY_COLUMN;

  constancyDeliverySettings: any = {
    ...TABLE_SETTINGS,
    selectMode: '',
    columns: CONSTANCY_DELIVERY_COLUMNS,
  };
  constancyDeliveryArray: any = [];
  constancyParams = new BehaviorSubject<ListParams>(new ListParams());
  constancyTotalItems: number = 0;
  constancyDeliveryColumns = CONSTANCY_DELIVERY_COLUMNS;
  loadingT2: boolean = false;

  progDelivGoodTypeRestSettings: any = {
    ...TABLE_SETTINGS,
    selectMode: '',
    actions: false,
    columns: PROG_DELIVERY_GOOD_TYPE_REST_COLUMNS,
  };
  progDelivGoodTypeRestArray: any = [];
  progDelivGoodTypeRestParams = new BehaviorSubject<ListParams>(
    new ListParams()
  );
  progDelivGoodTypeRestTotalItems: number = 0;
  progDelivGoodTypeRestColumns = PROG_DELIVERY_GOOD_TYPE_REST_COLUMNS;
  loadingEEB: boolean = false;
  listObservation: any = [];
  goodRestSelected: any = {};

  goodDeliveredSelected: any = [];
  regDelegationId: number = null;
  bsModelRef: BsModalRef;
  jsonToCsv = JSON_TO_CSV;
  constanceSelected: any = {};
  is: boolean = false;

  private programmingService = inject(ProgrammingGoodService);
  private transferenteService = inject(TransferenteService);
  private certifiDeliveryService = inject(CertificatesDeliveryService);
  private excelService = inject(ExcelService);
  private wcontet = inject(WContentService);
  private certifiGoodsService = inject(CertificatesGoodsService);

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.getSchedulingDelivery();
    this.GoodDeliverySettings.columns = GOOD_DELIVERY_COLUMN;

    this.goodParams.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      if (this.programmingDetailPanel.id) {
        this.getProgrammingGoodDelivery(data);
      }
    });

    this.goodDeliveryColumns.amountDelivered = {
      ...this.goodDeliveryColumns.amountDelivered,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setamountDelivered(data);
        });
      },
    };

    this.goodDeliveryColumns.amountNotDelivered = {
      ...this.goodDeliveryColumns.amountNotDelivered,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setamountNotDelivered(data);
        });
      },
    };

    this.goodDeliveryColumns.anountNotAccelted = {
      ...this.goodDeliveryColumns.anountNotAccelted,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setanountNotAccelted(data);
        });
      },
    };

    this.goodDeliveryColumns.amountNotWhithdrawn = {
      ...this.goodDeliveryColumns.amountNotWhithdrawn,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setamountNotWhithdrawn(data);
        });
      },
    };

    this.constancyDeliverySettings = {
      ...TABLE_SETTINGS,
      columns: CONSTANCY_DELIVERY_COLUMNS,
      actions: {
        delete: true,
        edit: true,
        columnTitle: 'Acciones',
        position: 'right',
      },

      edit: {
        editButtonContent:
          '<i class="fa fa-eye text-primary mx-2 mr-2" tooltip="Vista Previa" containerClass="tooltip-style"></i>',
      },
      delete: {
        deleteButtonContent:
          '<i class="fa fa-times text-info mx-2" tooltip="Cerrar Constancia" containerClass="tooltip-style"></i>',
      },
    };

    this.constancyParams.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      if (this.programmingDetailPanel.id) {
        this.getCertificateDelivery(data);
      }
    });

    this.progDelivGoodTypeRestColumns.approveCheck = {
      ...this.progDelivGoodTypeRestColumns.approveCheck,
      onComponentInitFunction: this.approvedSelected.bind(this),
    };

    this.progDelivGoodTypeRestColumns.observation = {
      ...this.progDelivGoodTypeRestColumns.observation,
      onComponentInitFunction: (instance?: any) => {
        instance.input.subscribe((data: any) => {
          this.setObservations(data);
        });
      },
    };
    this.progDelivGoodTypeRestParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
        if (
          this.programmingDetailPanel.id &&
          (this.statusProgramming == 'APROBAR_NO_ENT_ESP' ||
            this.statusProgramming == 'APROBAR_NO_ENT_NUM')
        ) {
          this.getProgrammingGoodDelivery(data);
        }
      });

    //this.constancyDeliveryArray = testdata;
  }

  certificateDelivery(constancy: number) {
    if (this.goodDeliveredSelected.length == 0) {
      this.onLoadToast('info', 'Debe tener al menos un bien seleccionado');
    }
    const typeEvent = this.programmingDetailPanel.typeEvent;
    const comply = this.validateBeforeOpenModal(constancy);
    if (comply != true) return;

    const certificateDelivery = this.modalService.show(
      DeliveriesConstancyFormComponent,
      {
        initialState: {
          goods: this.goodDeliveredSelected,
          typeConstancy: constancy,
          typeEvent: typeEvent,
          progEntrega: this.programmingDetailPanel,
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );

    certificateDelivery.content.event.subscribe((data: any) => {
      console.log(data);
      const typeEvent = this.programmingDetailPanel.typeEvent;
      this.loadingT2 = true;
      const typeReceptor = data.receiverType;
      if (typeEvent == 1 && typeReceptor == 'CLIENTE') {
        this.constancyDeliveryArray['identificator'] = data.clientIden;
        this.constancyDeliveryArray['IdennNum'] = data.clientIdennNum;
        this.constancyDeliveryArray['name'] = data.cliente;
      } else if (typeEvent != 1 && typeReceptor != 'CLIENTE') {
        this.constancyDeliveryArray['identificator'] = data.repLegalIden;
        this.constancyDeliveryArray['IdennNum'] = data.repLegalIdenNum;
        this.constancyDeliveryArray['name'] = data.repLegal;
      }

      this.constancyDeliveryArray = [...this.constancyDeliveryArray];
      this.loadingT2 = false;
    });
  }

  newDocument() {
    if (
      this.constanceSelected == null ||
      this.constanceSelected.certificateId == null
    ) {
      this.onLoadToast('info', 'Es necesario seleccionar una constancia');
      return;
    }

    if (
      this.constanceSelected.closing == null ||
      this.constanceSelected.closing == 'N'
    ) {
      this.onLoadToast(
        'info',
        'Para adjuntar documentos es necesario cerrar la constancia'
      );
      return;
    }

    const newDocument = this.modalService.show(
      DocumentConstanceModalComponent,
      {
        initialState: {
          certificate: this.constanceSelected,
          goodDelivery: this.programmingDetailPanel,
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
  }

  editConstancy() {
    let config: ModalOptions = {
      initialState: {
        goods: this.goodDeliveredSelected,
        typeEvent: +this.programmingDetailPanel.typeEvent,
        progEntrega: this.programmingDetailPanel,
        constanceForm: this.constanceSelected,
        edit: true,
        callback: (next: boolean) => {
          if (next) {
            debugger;
            this.getSchedulingDelivery();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModelRef = this.modalService.show(
      DeliveriesConstancyFormComponent,
      config
    );
    this.bsModelRef.content.event.subscribe((data: any) => {
      console.log(data);
      if (data == true) {
        this.getCertificateDelivery(new ListParams());
      }
    });
  }

  deleteConstancy(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar esta constancía?'
    ).then(question => {
      if (question.isConfirmed) {
        alert('Eliminado');
      }
    });
  }

  getSchedulingDelivery() {
    const params = new ListParams();
    params['filter.id'] = `$eq:${16894}`; //16896
    this.programmingService
      .getProgrammingDelivery(params)
      .pipe(
        map((x: any) => {
          return x.data[0];
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.programmingDetailPanel.id = resp.id;
          this.programmingDetailPanel.typeEvent = resp.typeEvent;
          this.programmingDetailPanel.folio = resp.folio;
          this.programmingDetailPanel.store = resp.store;
          this.programmingDetailPanel.client = resp.client;
          this.programmingDetailPanel.startDate = resp.startDate;
          this.programmingDetailPanel.endDate = resp.endDate;
          this.programmingDetailPanel.typeUser = resp.typeUser;
          this.programmingDetailPanel.emailAddressCenterTe =
            resp.emailAddressCenterTe;
          this.programmingDetailPanel.status = resp.status;
          this.programmingDetailPanel.officeDestructionNumber =
            resp.officeDestructionNumber;
          this.programmingDetailPanel.metodDestruction = resp.metodDestruction;
          this.programmingDetailPanel.locationDestruction =
            resp.locationDestruction;
          this.programmingDetailPanel.addressee = resp.addressee;
          this.programmingDetailPanel.term = resp.term;
          this.programmingDetailPanel.taxpayerName = resp.taxpayerName;
          this.programmingDetailPanel.chargeAddressee = resp.chargeAddressee;
          this.programmingDetailPanel.company = resp.company;
          this.programmingDetailPanel.legalRepresentativeName =
            resp.legalRepresentativeName;
          this.programmingDetailPanel.placeDestruction = resp.placeDestruction;

          this.getTransferent(resp.transferId);

          this.getProgrammingGoodDelivery(new ListParams());
          this.getCertificateDelivery(new ListParams());
        },
      });
  }

  private getTransferent(id: number | string) {
    this.transferenteService.getById(id).subscribe({
      next: resp => {
        this.programmingDetailPanel.transferId = resp.nameTransferent;
      },
    });
  }

  getProgrammingGoodDelivery(params: ListParams) {
    this.loading = true;
    this.loadingEEB = true;
    params[
      'filter.programmingDeliveryId'
    ] = `$eq:${this.programmingDetailPanel.id}`;
    this.programmingService.getProgrammingDeliveryGood(params).subscribe({
      next: (resp: any) => {
        console.log(resp);
        resp.data.map((item: any) => {
          item['faltante'] =
            Number(item.amountGood) -
            (Number(item.sunGoodEnt) +
              Number(item.sumGoodNoEnt) +
              Number(item.sumGoodNoAce) +
              Number(item.sumGoodNoRet));
        });

        //
        this.goodDeliveryArray = resp.data;
        this.devgoodTotalItems = resp.count;
        this.loading = false;
        this.setProgramDeliveryGoodColumns();

        //
        resp.data.map((item: any) => {
          item.approveCheck =
            item.approveEnEsp == null || item.approveEnEsp == 'N'
              ? false
              : true;
        });
        this.progDelivGoodTypeRestArray = resp.data;
        this.progDelivGoodTypeRestTotalItems = resp.count;
        this.loadingEEB = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  setProgramDeliveryGoodColumns() {
    setTimeout(() => {
      const table = this.table.grid.getColumns();
      const cantNoAcep = table.find((x: any) => x.id == 'anountNotAccelted');
      const sumNoAcep = table.find((x: any) => x.id == 'sumGoodNoAce');
      const cantNoRet = table.find((x: any) => x.id == 'amountNotWhithdrawn');
      const sumNoRet = table.find((x: any) => x.id == 'sumGoodNoRet');

      if (Number(this.programmingDetailPanel.typeEvent) != 1) {
        cantNoAcep.hide = true;
        sumNoAcep.hide = true;
        cantNoRet.hide = true;
        sumNoRet.hide = true;
      }
    }, 300);
  }

  updateProgrammingGoodDelivery(body: any) {
    return new Promise((resolve, reject) => {
      this.programmingService
        .updateProgrammingDeliveryGood(body.id, body)
        .subscribe({
          next: resp => {
            resolve(resp);
          },
          error: error => {
            reject(error);
            this.onLoadToast('error', 'No se actualizo los bienes entregados');
            this.loadingEEB = false;
          },
        });
    });
  }

  selectRows(event: any) {
    console.log(event.selected);
    /*const index = this.goodDeliveryArray.indexOf(event.data);

    const table = document.getElementById('table');
    const tbody = table.children[0].children[1].children;
    const ele: any = tbody[index];
    const cantEnt =
      ele.children[11].children[0].children[0].children[0].children[0]
        .children[0].children[0].children[0];
    cantEnt.disabled = true;*/

    this.goodDeliveredSelected = event.selected;
  }

  setamountDelivered(data: any) {
    this.goodDeliveryArray.map((item: any) => {
      if (item.id == data.row.id) {
        item.amountDelivered = data.data;
      }
    });
  }

  setamountNotDelivered(data: any) {
    this.goodDeliveryArray.map((item: any) => {
      if (item.id == data.row.id) {
        item.amountNotDelivered = data.data;
      }
    });
  }

  setanountNotAccelted(data: any) {
    this.goodDeliveryArray.map((item: any) => {
      if (item.id == data.row.id) {
        item.anountNotAccelted = data.data;
      }
    });
  }

  setamountNotWhithdrawn(data: any) {
    this.goodDeliveryArray.map((item: any) => {
      if (item.id == data.row.id) {
        item.amountNotWhithdrawn = data.data;
      }
    });
  }

  validateBeforeOpenModal(typeConstancy: number): any {
    for (let index = 0; index < this.goodDeliveredSelected.length; index++) {
      const item = this.goodDeliveredSelected[index];
      const typeEvent = this.programmingDetailPanel.typeEvent;
      if (typeEvent === 1 && item.commercialEvent == null) {
        this.onLoadToast(
          'info',
          'El bien debe tener un evento comercial. Consulte a su administrador.'
        );
        return false;
      }

      let lsColumna = null;
      let lsColumnaTot = null;
      switch (+typeConstancy) {
        case 1:
          lsColumna = item.amountDelivered;
          lsColumnaTot = item.sunGoodEnt;
          break;
        case 2:
          lsColumna = item.amountNotDelivered;
          lsColumnaTot = item.sumGoodNoEnt;
          break;
        case 3:
          lsColumna = item.anountNotAccelted;
          lsColumnaTot = item.sumGoodNoAce;
          break;
        default:
          lsColumna = item.amountNotWhithdrawn;
          lsColumnaTot = item.sumGoodNoRet;
          break;
      }
      if (lsColumna <= 0) {
        this.onLoadToast(
          'info',
          `El bien ${item.goodId} - ${item.inventoryNumber} - tiene un valor menor o igual a cero`
        );
        return false;
      }

      const goodAdded =
        item.sunGoodEnt +
        item.sumGoodNoEnt +
        item.sumGoodNoAce +
        item.sumGoodNoRet;
      const totalGood = item.amountGood;

      if (goodAdded > totalGood) {
        this.onLoadToast(
          'info',
          `El bien ${item.goodId} - ${item.inventoryNumber} - excede la cantidad permitida`
        );
        return false;
      }

      return true;
    }
  }

  getCertificateDelivery(params: ListParams) {
    this.loadingT2 = true;
    const progDeliveryId = this.programmingDetailPanel.id;
    params['filter.deliveryScheduleId'] = `$eq:${progDeliveryId}`;
    this.certifiDeliveryService.getAll(params).subscribe({
      next: (resp: any) => {
        const typeEvent = this.programmingDetailPanel.typeEvent;
        resp.data.map((item: any) => {
          const typeReceptor = item.receiverType;
          if (typeEvent == 1 && typeReceptor == 'CLIENTE') {
            item['identificator'] = item.clientIden;
            item['IdennNum'] = item.clientIdennNum;
            item['name'] = item.cliente;
          } else if (typeEvent != 1 && typeReceptor != 'CLIENTE') {
            item['identificator'] = item.repLegalIden;
            item['IdennNum'] = item.repLegalIdenNum;
            item['name'] = item.repLegal;
          }
        });
        this.constancyDeliveryArray = resp.data;
        this.constancyTotalItems = resp.count;
        this.displayCloseConstanceIcon();
        this.loadingT2 = false;
      },
      error: error => {
        console.log(error);
        if (error.status != 400) {
          this.onLoadToast(
            'error',
            'Ocurrio un error al cargar los certificados de constancia'
          );
        }
        this.loadingT2 = false;
        this.constancyDeliveryArray = [];
        this.constancyTotalItems = 0;
      },
    });
  }

  displayCloseConstanceIcon() {
    setTimeout(() => {
      const table = document.getElementById('table2');
      const tbody = table.children[0].children[1].children;
      for (let index = 0; index < tbody.length; index++) {
        const ele: any = tbody[index];
        const isclose = this.constancyDeliveryArray[index].closing;
        if (isclose != null && isclose != 'N') {
          console.log(ele.children[6].children[1].children[1].hidden);
          ele.children[6].children[1].children[1].hidden = true;
        }
      }
    }, 300);
  }

  delivery(executionType: string, causa?: string) {
    if (
      this.goodDeliveredSelected.length == 0 ||
      this.goodDeliveredSelected > 1
    ) {
      this.onLoadToast(
        'info',
        'Debe tener un bien seleccionado para la ejecucide entrega'
      );
      return;
    }
    let colDestino = '';

    if (executionType == 'entragados') {
      colDestino = 'amountDelivered'; //Cantidad Entregados
    } else {
      if (causa == 'NO ENTREGADOS') {
        colDestino = 'amountNotDelivered'; //CantidadNoEntregados
      } else if (causa == 'NO ACEPTADOS') {
        colDestino = 'anountNotAccelted'; //CantidadNoAceptados
      } else {
        colDestino = 'amountNotWhithdrawn'; //CantidadNoRetirados
      }
    }

    this.goodDeliveredSelected.map((item: any) => {
      const goodTotal = item.amountGood;
      const sumGoods =
        Number(item.sunGoodEnt) +
        Number(item.sumGoodNoAce) +
        Number(item.sumGoodNoEnt) +
        Number(item.sumGoodNoRet);
      const total = goodTotal - sumGoods;
      const body: any = {};
      body['id'] = item.id;
      body[colDestino] = total;
      console.log(body);
      //Consultar si lo que se actualizara esta correcto
      //this.updateProgrammingGoodDelivery(body)
    });
  }

  noDelivery(executionType: string) {
    if (
      this.goodDeliveredSelected.length == 0 ||
      this.goodDeliveredSelected > 1
    ) {
      this.onLoadToast(
        'info',
        'Debe tener un bien seleccionado para la ejecucide entrega'
      );
      return;
    }

    this.openTypeReason(executionType);
  }

  openTypeReason(executionType: string) {
    const typeEvent = this.programmingDetailPanel.typeEvent;
    let config: ModalOptions = {
      initialState: {
        typeEvent,
        callback: (next: boolean) => {
          if (next) {
          }
        },
      },
      class: 'modal-sm modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModelRef = this.modalService.show(
      TypeDeliveryModelComponent,
      config
    );
    this.bsModelRef.content.event.subscribe((data: any) => {
      console.log(data);
      this.delivery(executionType, data.type);
    });
  }

  async exportCsv() {
    const filename: string = 'Bienes';
    const params = new ListParams();
    params.limit = 100;
    const goodsFile: any = await this.getAsyncProgrammingDeliveryGood(params);
    //type: 'csv',
    this.excelService.export(goodsFile, { filename });
  }

  getAsyncProgrammingDeliveryGood(params: ListParams) {
    return new Promise((resolve, reject) => {
      params[
        'filter.programmingDeliveryId'
      ] = `$eq:${this.programmingDetailPanel.id}`;

      this.programmingService.getProgrammingDeliveryGood(params).subscribe({
        next: (resp: any) => {
          resolve(resp.data);
        },
        error: error => {},
      });
    });
  }

  preview(event: any) {
    console.log(event);
  }

  close(event: any) {
    this.loadingT2 = true;
    let body: any = {};
    body.certificateId = event.certificateId;
    body.closing = 'Y';
    //actializar certificates-delivery
    this.certifiDeliveryService.update(body).subscribe({
      next: resp => {
        const index = this.constancyDeliveryArray.indexOf(event);
        if (index != -1) {
          this.constancyDeliveryArray[index].closing = 'Y';
          this.constancyDeliveryArray = [...this.constancyDeliveryArray];
          //luego actualizar los botones
          this.displayCloseConstanceIcon();
        }
        this.onLoadToast('success', 'Constancia cerrada');
        this.loadingT2 = false;
      },
      error: error => {
        this.onLoadToast('error', 'No se pudo cerrar la constancia');
        this.loadingT2 = false;
      },
    });
  }

  selectConstance(event: any) {
    if (event.isSelected == false) {
      this.constanceSelected = {};
      return;
    }
    this.constanceSelected = event.data;
  }

  async finalizeDelivery() {
    let lbNoEnt: boolean = false;

    const params1 = new ListParams();
    params1['filter.closing'] = `$eq:N`;
    const constDeliveryClosed: any = await this.getAllCertificates(params1);

    if (
      this.constancyDeliveryArray.length == 0 &&
      constDeliveryClosed.count > 0
    ) {
      this.onLoadToast('info', 'Todas las constancias deben estar cerradas');
      return;
    }

    let noHaveField: number = 0;
    const constDelivery: any = await this.getAllCertificates(new ListParams());

    //Todo:call endpoint who verify if certifi have documents

    const params3 = new ListParams();
    params3.limit = 100;
    const listProgGoods: any = await this.getAllProgramminDeliveryGoods(
      params3
    );
    for (let index = 0; index < listProgGoods.length; index++) {
      const item = listProgGoods[index];

      if (item.sumGoodNoEnt > 0) {
        lbNoEnt = true;
        item.status = 'BIENES_NO_ENTREGADOS';
      }

      const total =
        Number(item.amountGood) -
        (Number(item.sunGoodEnt) -
          Number(item.sumGoodNoRet) -
          Number(item.sumGoodNoAce) -
          Number(item.sumGoodNoEnt));
      item.amountNotRescheduled = total;

      const body: any = {};
      body.id = item.id;
      body.id = item.amountNotRescheduled;
      body.status = item.status;

      const updated = await this.updateProgrammingGoodDelivery(body);
    }

    //Todo: Averiguar donde se encuentra el EstatusProgramming para actualizarlo
    //abrir el modal de turnado
  }

  haveDocuments() {
    return new Promise(async (resolve, reject) => {
      let noHaveField: number = 0;
      const constDelivery: any = await this.getAllCertificates(
        new ListParams()
      );

      constDelivery.data.map(async (item: any, _i: number) => {
        const index = _i + 1;
        const param = new ListParams();
        param['filter.certificateId'] = `$eq:${item.certificateId}`;
        const certifyGood: any = await this.getConstancyGood(param);
        /*this.doSomthing(certifyGood)
          .then((result:any) => {
            console.log(result)
          })*/

        certifyGood.data.map(async (item2: any) => {
          const body: any = {};
          body.xidBien = item2.goodId;
          body.xtipoDocumento = 19;
          const fields: any = await this.getDocumentConstance(body);

          const have = fields.data.filter((x: any) => {
            return Number(x.xtipoDocumento) == 19;
          });
          noHaveField = have.length == 0 ? noHaveField + 1 : noHaveField;
          console.log(noHaveField);
        });
        if (constDelivery.data.length == index) {
          resolve(noHaveField);
        }
      });
    });
  }

  getAllCertificates(params: ListParams) {
    return new Promise((resolve, reject) => {
      const progDeliveryId = this.programmingDetailPanel.id;
      params['filter.deliveryScheduleId'] = `$eq:${progDeliveryId}`;
      this.certifiDeliveryService
        .getAll(params)
        .pipe(
          catchError((e: any) => {
            if (e.status == 400) return of({ data: [], count: 0 });
            throw e;
          })
        )
        .subscribe({
          next: resp => {
            resolve(resp);
          },
        });
    });
  }

  getAllProgramminDeliveryGoods(params: ListParams) {
    return new Promise((resolve, reject) => {
      params[
        'filter.programmingDeliveryId'
      ] = `$eq:${this.programmingDetailPanel.id}`;
      this.programmingService.getProgrammingDeliveryGood(params).subscribe({
        next: (resp: any) => {
          resolve(resp.data);
        },
      });
    });
  }

  getConstancyGood(params: ListParams) {
    return new Promise((resolve, reject) => {
      this.certifiGoodsService.getAll(params).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }

  getDocumentConstance(body: any) {
    //5319436
    return new Promise((resolve, reject) => {
      this.wcontet.getDocumentos(body).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }

  finalizeClassify() {}

  finalizeVerify() {}

  photos() {
    let typeDoc = null;
    let nomProcess = null;

    if (this.goodRestSelected.id == null) {
      this.onLoadToast('info', 'Debe tener un bien seleccionado');
      return;
    }
    if (this.statusProgramming == 'APROBAR_NO_ENT_ESP') {
      typeDoc = 209;
      nomProcess = 'Aprobar RestituciEspecie';
    } else if (this.statusProgramming == 'RESTITUCION_BIENES') {
      typeDoc = 208;
      nomProcess = 'RestituciBienes';
    } else {
      typeDoc = 209;
      nomProcess = 'Bienes No Entregados';
    }
    const newDocument = this.modalService.show(PhotosConstanceModalComponent, {
      initialState: {
        //certificate: this.constanceSelected,
        progGood: this.goodRestSelected,
        typeDoc: typeDoc,
        nomProcess: nomProcess,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  selectGoodTypeRestRows(event: any) {
    if (event.isSelected == false) {
      this.goodRestSelected = [];
      return;
    }
    this.goodRestSelected = event.data;
  }

  approvedSelected(event: any) {
    event.toggle.subscribe(async (data: any) => {
      this.loadingEEB = true;
      const body: any = {};
      body.id = data.row.id;
      body.approveEnEsp = event.toggle == true ? 'Y' : 'N';
      const updated = await this.updateProgrammingGoodDelivery(body);
      if (updated) {
        this.loadingEEB = false;
      }
    });
  }

  setObservations(event: any) {
    const index = this.progDelivGoodTypeRestArray.indexOf(event.data);
    this.progDelivGoodTypeRestArray[index].observation =
      this.progDelivGoodTypeRestArray[index].observation != ''
        ? event.text
        : null;

    const idx = this.listObservation.indexOf(
      this.progDelivGoodTypeRestArray[index]
    );
    if (this.listObservation.length == 0 || idx == -1) {
      this.listObservation.push(this.progDelivGoodTypeRestArray[index]);
    } else {
      this.listObservation[idx].observation =
        this.progDelivGoodTypeRestArray[index].observation;
    }
  }

  save() {
    if (
      this.statusProgramming == 'APROBAR_NO_ENT_ESP' ||
      this.statusProgramming == 'APROBAR_NO_ENT_NUM'
    )
      console.log(this.listObservation[0].observation);
    this.listObservation.map(async (item: any, _i: number) => {
      const index = _i + 1;
      const body: any = {};
      body.id = item.id;
      body.observation = item.observation;

      const updated = await this.updateProgrammingGoodDelivery(body);

      if (this.listObservation.length == index) {
        this.onLoadToast('success', 'Entrega de bienes actualizado');
      }
    });
  }
}
