import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ISamplingOrderService } from 'src/app/core/models/ms-order-service/sampling-order-service.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { BasePage } from '../../../../../core/shared/base-page';
import { UploadExpedientServiceOrderFormComponent } from '../upload-expedient-service-order-form/upload-expedient-service-order-form.component';
import { LIST_ORDERS_SELECTED_COLUMNS } from './columns/list-orders-selected-columns';

@Component({
  selector: 'app-list-service-orders',
  templateUrl: './list-service-orders.component.html',
  styles: [],
})
export class ListServiceOrdersComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() orders: any[];
  @Input() SampleOrderId: number = null;
  //sampleOrderId: number = 3;
  paragraphs = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  rowSelected: any[] = [];

  private orderService = inject(OrderServiceService);
  private authService = inject(AuthService);
  private excelService = inject(ExcelService);

  constructor(private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: LIST_ORDERS_SELECTED_COLUMNS,
    };

    this.getSamplingOrder();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setOrderService();
  }

  setOrderService() {
    if (this.orders.length == 0) return;

    const orderServiceExisted = this.paragraphs['data'];
    this.loading = true;
    if (orderServiceExisted.length == 0) {
      this.paragraphs.load(this.orders);
      this.orders.map(async (item: any, _i: number) => {
        const index = _i + 1;
        this.insertOrderServices(item);
        if (this.orders.length == index) {
          this.onLoadToast('success', 'Registros ingresados');
          this.loading = false;
        }
      });
    } else {
      for (let i = 0; i < this.orders.length; i++) {
        const ele = this.orders[i];
        const index = orderServiceExisted.indexOf(ele);
        if (index != -1) {
          this.onLoadToast(
            'error',
            `La orden de servicio ${ele.orderServiceId} ya esta registrado`
          );
          break;
        } else {
          orderServiceExisted.push(ele);
        }
      }
      this.paragraphs.load(orderServiceExisted);
      this.orders.map(async (item: any, _i: number) => {
        const index = _i + 1;
        this.insertOrderServices(item);
        if (this.orders.length == index) {
          this.onLoadToast('success', 'Registros ingresados');
          this.loading = false;
        }
      });
    }

    this.orders = [];
  }

  rowsSelected(event: any) {
    this.rowSelected = event.selected;
  }

  eliminar() {
    this.rowSelected.map(async (item: any, _i: number) => {
      const i = _i + 1;
      let index = this.orders.indexOf(item);
      this.paragraphs['data'].splice(index, 1);

      const del = await this.deleteSamplingOrderService(
        this.SampleOrderId,
        item.orderServiceId
      );
      if (this.rowSelected.length == i) {
        this.onLoadToast('success', 'Orden eliminada');
        this.paragraphs.refresh();
      }
    });
  }

  uploadExpedient() {
    if (this.rowSelected.length == 0 || this.rowSelected.length > 1) {
      this.onLoadToast('info', 'Seleccione solo un registro');
      return;
    }

    this.openModal(
      UploadExpedientServiceOrderFormComponent,
      'sample-request',
      this.rowSelected
    );
  }

  openModal(component: any, typeComponent?: string, data?: any[]) {
    let config: ModalOptions = {
      initialState: {
        data: data,
        typeComponent: typeComponent,
        callback: (next: boolean) => {
          //if (next){ this.getData();}
        },
      },
      class: 'modalSizeXL modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(component, config);
  }

  insertOrderServices(order: any) {
    return new Promise((resolve, reject) => {
      const user = this.authService.decodeToken();
      const body: ISamplingOrderService = {
        sampleOrderId: this.SampleOrderId,
        orderServiceId: order.orderServiceId,
        userCreation: user.username,
        creationDate: moment(new Date()).format('YYYY-MM-DD'),
        userModification: user.username,
        modificationDate: moment(new Date()).format('YYYY-MM-DD'),
      };
      this.orderService.createSamplingOrderService(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject('error');
          console.log(error);
          this.onLoadToast(
            'error',
            'No se pudo guardar las ordenes de servicio'
          );
        },
      });
    });
  }

  getSamplingOrder() {
    this.loading = true;
    const params = new ListParams();
    params['filter.sampleOrderId'] = `$eq:${this.SampleOrderId}`;
    this.orderService.getAllSamplingOrderService(params).subscribe({
      next: async (resp: any) => {
        let body: any = [];
        const result = resp.data.map(async (item: any) => {
          const ordServ: any = await this.getOrderService(item.orderServiceId);
          body.push({
            orderServiceId: ordServ.id,
            orderServiceFolio: ordServ.serviceOrderFolio,
            orderServiceType: ordServ.serviceOrderType,
            contractNumber: ordServ.contractNumber,
            requestId: ordServ.applicationId,
            costService: ordServ.serviceCost,
          });
        });

        Promise.all(result).then(() => {
          this.paragraphs.load(body);
          this.totalItems = resp.count;
          this.loading = false;
        });
      },
    });
  }

  getOrderService(id: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `$eq:${id}`;
      this.orderService.getAllOrderService(params).subscribe({
        next: resp => {
          resolve(resp.data[0]);
        },
      });
    });
  }

  deleteSamplingOrderService(sampleOrderId: number, orderServiceId: number) {
    return new Promise((resolve, reject) => {
      this.orderService
        .deleteSamplingOrderService(sampleOrderId, orderServiceId)
        .subscribe({
          next: resp => {
            resolve(resp);
          },
          error: error => {
            reject(error);
            console.log(error);
            this.onLoadToast(
              'error',
              `No se pudo eliminar la orden de servicio No. ${orderServiceId}`
            );
          },
        });
    });
  }

  downloadExcel() {
    const filename: string = 'MuestreoOrdenes';
    const file = this.paragraphs['data'];
    //type: 'csv'
    this.excelService.export(file, { filename });
  }
}
