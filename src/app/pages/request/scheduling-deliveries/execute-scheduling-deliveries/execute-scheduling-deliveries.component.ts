import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { CertificatesDeliveryService } from 'src/app/core/services/ms-delivery-constancy/certificates-delivery.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { JSON_TO_CSV } from 'src/app/pages/admin/home/constants/json-to-csv';
import { DeliveriesConstancyFormComponent } from '../deliveries-constancy-form/deliveries-constancy-form.component';
import { DocumentConstanceModalComponent } from '../document-constance-modal/document-constance-modal.component';
import { TypeDeliveryModelComponent } from '../type-delivery-model/type-delivery-model.component';
import {
  CONSTANCY_DELIVERY_COLUMNS,
  GOOD_DELIVERY_COLUMN,
} from './columns/good-delivery-columns';

const testdata = [
  {
    certificateId: 1,
    folio: 'hjhjhjhjh',
  },
];
@Component({
  selector: 'app-execute-scheduling-deliveries',
  templateUrl: './execute-scheduling-deliveries.component.html',
  styleUrls: ['./execute-scheduling-deliveries.scss'],
})
export class ExecuteSchedulingDeliveriesComponent
  extends BasePage
  implements OnInit
{
  @ViewChild('table2', { static: false }) table2: any;
  showSearchForm: boolean = true;
  constancyDelivered: boolean = false;
  constancyNoDelivered: boolean = false;
  constancyNoAcept: boolean = false;
  constancyNoRetired: boolean = false;

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
      let certifyArray: any = {};
      const typeReceptor = data.receiverType;
      certifyArray.certificateId = data.certificateId;
      certifyArray.folio = data.folio;
      certifyArray.certificateType = data.certificateType;
      certifyArray.closing = data.closing;

      if (typeEvent == 1 && typeReceptor == 'CLIENTE') {
        certifyArray.identificator = data.clientIden;
        certifyArray.IdennNum = data.clientIdennNum;
        certifyArray.name = data.cliente;
      } else if (typeEvent != 1 && typeReceptor != 'CLIENTE') {
        certifyArray.identificator = data.repLegalIden;
        certifyArray.IdennNum = data.repLegalIdenNum;
        certifyArray.name = data.repLegal;
      }

      this.constancyDeliveryArray = [
        ...this.constancyDeliveryArray,
        certifyArray,
      ];
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

  editConstancy(data: any) {
    let config: ModalOptions = {
      initialState: {
        data,
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
          this.programmingDetailPanel.delRegId = resp.delRegId;
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
    params[
      'filter.programmingDeliveryId'
    ] = `$eq:${this.programmingDetailPanel.id}`;
    this.programmingService.getProgrammingDeliveryGood(params).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.goodDeliveryArray = resp.data;
        this.devgoodTotalItems = resp.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
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
            this.onLoadToast('error', 'No se actualizo el bien entregado');
          },
        });
    });
  }

  selectRows(event: any) {
    console.log(event.selected);
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
      if (typeEvent == 1 && item.commercialEvent == null) {
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
          let certifyArray: any = {};
          const typeReceptor = item.receiverType;
          certifyArray.certificateId = item.certificateId;
          certifyArray.folio = item.folio;
          certifyArray.certificateType = item.certificateType;
          certifyArray.closing = item.closing; //boton cerra constancia ???

          if (typeEvent == 1 && typeReceptor == 'CLIENTE') {
            certifyArray.identificator = item.clientIden;
            certifyArray.IdennNum = item.clientIdennNum;
            certifyArray.name = item.cliente;
          } else if (typeEvent != 1 && typeReceptor != 'CLIENTE') {
            certifyArray.identificator = item.repLegalIden;
            certifyArray.IdennNum = item.repLegalIdenNum;
            certifyArray.name = item.repLegal;
          }
          this.constancyDeliveryArray.push(certifyArray);
        });
        this.constancyDeliveryArray = [...this.constancyDeliveryArray];
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
    /*body.userCreation = "sigebiadmon";
    body.userModification = "sigebiadmon";
    body.creationDate = "2023-08-25";
    body.modificationDate = "2023-08-25";*/
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
    console.log(event);
    this.constanceSelected = event.data;
  }
}
