import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ISamplingOrder } from 'src/app/core/models/ms-order-service/sampling-order.model';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { TABLE_SETTINGS } from '../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { BasePage } from '../../../../../core/shared/base-page';
import { UploadExpedientServiceOrderFormComponent } from '../../sampling-service-orders/upload-expedient-service-order-form/upload-expedient-service-order-form.component';
import { SERVICE_ORDERS_COLUMNS } from './columns/service-orders-columns';

@Component({
  selector: 'app-list-service-orders',
  templateUrl: './list-service-orders.component.html',
  styles: [],
})
export class ListServiceOrdersComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() sampleOrderId: number = 0;
  @Input() searchForm: any;
  paragraphs = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  loadingReport: boolean = false;
  rowSelected: any = [];
  allOrderService: ISamplingOrder[] = [];
  private orderService = inject(OrderServiceService);
  private excelService = inject(ExcelService);

  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef,
    private requestService: RequestService
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: SERVICE_ORDERS_COLUMNS,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.sampleOrderId > 0 && !this.searchForm) {
      this.getSamplingOrder();
    }
    if (this.allOrderService.length > 0) {
      this.loading = true;

      if (this.searchForm.id) {
        const filterOrderId = this.allOrderService.filter((item: any) => {
          if (item.orderServiceId == this.searchForm.id) return item;
        });
        if (filterOrderId.length > 0) {
          this.paragraphs.load(filterOrderId);
          this.totalItems = filterOrderId.length;
          this.loading = false;
        } else {
          if (this.searchForm)
            this.alert('warning', 'Advertencia', 'No se encontraron registros');

          this.loading = false;
        }
      }

      if (this.searchForm.serviceOrderFolio) {
        const filterFolOrder = this.allOrderService.filter((item: any) => {
          if (item.orderServiceFolio == this.searchForm.serviceOrderFolio)
            return item;
        });
        if (filterFolOrder.length > 0) {
          this.paragraphs.load(filterFolOrder);
          this.totalItems = filterFolOrder.length;
          this.loading = false;
        } else {
          if (this.searchForm)
            this.alert('warning', 'Advertencia', 'No se encontraron registros');

          this.loading = false;
        }
      }

      if (this.searchForm.applicationId) {
        const filterFolOrder = this.allOrderService.filter((item: any) => {
          if (item.requestId == this.searchForm.applicationId) return item;
        });
        if (filterFolOrder.length > 0) {
          this.paragraphs.load(filterFolOrder);
          this.totalItems = filterFolOrder.length;
          this.loading = false;
        } else {
          if (this.searchForm)
            this.alert('warning', 'Advertencia', 'No se encontraron registros');

          this.loading = false;
        }
      }

      if (this.searchForm.id && this.searchForm.serviceOrderFolio) {
        const filterOrderIdFolio = this.allOrderService.filter((item: any) => {
          if (
            item.orderServiceId == this.searchForm.id &&
            item.orderServiceFolio == this.searchForm.serviceOrderFolio
          )
            return item;
        });
        if (filterOrderIdFolio.length > 0) {
          this.paragraphs.load(filterOrderIdFolio);
          this.totalItems = filterOrderIdFolio.length;
          this.loading = false;
        } else {
          if (this.searchForm)
            this.alert('warning', 'Advertencia', 'No se encontraron registros');

          this.loading = false;
        }
      }

      if (
        this.searchForm.id &&
        this.searchForm.serviceOrderFolio &&
        this.searchForm.applicationId
      ) {
        const filterOrderIdFolio = this.allOrderService.filter((item: any) => {
          if (
            item.orderServiceId == this.searchForm.id &&
            item.orderServiceFolio == this.searchForm.serviceOrderFolio &&
            item.requestId == this.searchForm.applicationId
          )
            return item;
        });
        if (filterOrderIdFolio.length > 0) {
          this.paragraphs.load(filterOrderIdFolio);
          this.totalItems = filterOrderIdFolio.length;
          this.loading = false;
        } else {
          if (this.searchForm)
            this.alert('warning', 'Advertencia', 'No se encontraron registros');

          this.loading = false;
        }
      }
    }
  }

  getSamplingOrder() {
    this.loading = true;
    this.params.getValue()[
      'filter.sampleOrderId'
    ] = `$eq:${this.sampleOrderId}`;
    this.orderService
      .getAllSamplingOrderService(this.params.getValue())
      .subscribe({
        next: async (resp: any) => {
          let body: any = [];
          const result = resp.data.map(async (item: any) => {
            const ordServ: any = await this.getOrderService(
              item.orderServiceId,
              this.searchForm
            );
            const recordId: any = await this.getRequest(ordServ.applicationId);
            if (ordServ.length != 0) {
              body.push({
                orderServiceId: ordServ.id,
                orderServiceFolio: ordServ.serviceOrderFolio,
                orderServiceType: ordServ.serviceOrderType,
                contractNumber: ordServ.contractNumber,
                requestId: ordServ.applicationId,
                costService: ordServ.serviceCost,
                recordId: recordId,
              });
            }
          });

          Promise.all(result).then(() => {
            this.paragraphs.load(body);
            this.allOrderService = body;
            this.totalItems = resp.count;
            this.loading = false;
          });
        },
      });
  }

  getRequest(id: number) {
    return new Promise((resolve, reject) => {
      this.requestService.getById(id).subscribe({
        next: response => {
          resolve(response.recordId);
        },
      });
    });
  }

  getOrderService(orderServiceId: number, search: any) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.id'] = `$eq:${orderServiceId}`;

      for (const key in search) {
        const element = search[key];
        if (element != null && key != 'id') {
          params[`filter.${key}`] = `$eq:${element}`;
        }
      }
      this.orderService
        .getAllOrderService(params)
        .pipe(
          catchError((e: any) => {
            if (e.status == 400) return of({ data: [], count: 0 });
            return e;
          })
        )
        .subscribe({
          next: (resp: any) => {
            if (resp.count > 0) {
              resolve(resp.data[0]);
            } else {
              resolve([]);
            }
          },
        });
    });
  }

  rowsSelected(event: any) {
    this.rowSelected = event.selected;
  }

  searchExpedients() {
    if (this.rowSelected.length > 0) {
      let request: string = '';

      this.rowSelected.map(item => {
        request += `${item.requestId} `;
      });
      let config = {
        ...MODAL_CONFIG,
        class: 'modalSizeXL modal-dialog-centered',
      };
      config.initialState = {
        request: request,
        callback: () => {},
      };
      this.modalService.show(UploadExpedientServiceOrderFormComponent, config);
    } else {
      this.alert(
        'warning',
        'Acción Invalida',
        'Se require seleccionar una orden de servicio'
      );
    }
  }

  openModal(component: any, data?: any, typeComponent?: string) {
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
    this.bsModalRef = this.modalService.show(component, config);
  }

  reportOrderService() {
    this.paragraphs.getElements().then(data => {
      if (data.length > 0) {
        this.loadingReport = true;
        const params = new BehaviorSubject<ListParams>(new ListParams());
        params.getValue()['filter.sampleOrderId'] = `$eq:${this.sampleOrderId}`;
        this.orderService.generateReportOrder(params.getValue()).subscribe({
          next: response => {
            this.downloadExcel(response.base64File, 'Ordenes_de_servicio.xlsx');
            this.loadingReport = false;
          },
          error: () => {
            this.loadingReport = false;
            this.alert(
              'warning',
              'Advertencia',
              'No fue posible generar el reporte'
            );
          },
        });
      } else {
        this.alert(
          'warning',
          'Advertencia',
          'Se requiere tener ordenes de servcio realacionadas al muestreo'
        );
      }
    });
  }

  downloadExcel(excel: any, nameReport: string) {
    const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excel}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.target = '_blank';
    downloadLink.download = nameReport;
    downloadLink.click();
    this.alert('success', 'Acción Correcta', 'Archivo generado');
  }
}
