import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { ExcelService } from 'src/app/common/services/excel.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
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
  @ViewChild('table', { static: false }) table: any;
  @Input() sampleOrderId: number = null;
  @Input() searchForm: any | null = null;
  paragraphs = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  rowSelected: any = [];

  private orderService = inject(OrderServiceService);
  private excelService = inject(ExcelService);

  constructor(
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
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
    //console.log(this.sampleOrderId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.searchForm != undefined) {
      //console.log(this.searchForm);
      this.getSamplingOrder();
    }
  }

  getSamplingOrder() {
    this.loading = true;
    const params = new ListParams();
    params['filter.sampleOrderId'] = `$eq:${this.sampleOrderId}`;
    if (this.searchForm.id != null && this.searchForm != '')
      params['filter.orderServiceId'] = `$eq:${this.searchForm.id}`;
    this.orderService.getAllSamplingOrderService(params).subscribe({
      next: async (resp: any) => {
        let body: any = [];
        const result = resp.data.map(async (item: any) => {
          const ordServ: any = await this.getOrderService(
            item.orderServiceId,
            this.searchForm
          );
          if (ordServ.length != 0) {
            body.push({
              orderServiceId: ordServ.id,
              orderServiceFolio: ordServ.serviceOrderFolio,
              orderServiceType: ordServ.serviceOrderType,
              contractNumber: ordServ.contractNumber,
              requestId: ordServ.applicationId,
              costService: ordServ.serviceCost,
            });
          }
        });

        Promise.all(result).then(() => {
          this.paragraphs.load(body);
          this.totalItems = resp.count;
          this.loading = false;

          this.setColumnsTable();
        });
      },
    });
  }

  setColumnsTable() {
    const table = this.table.grid.getColumns();
    table[6].hide = true;
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
    console.log(event.selected);
  }

  searchExpedients() {
    if (this.rowSelected.length == 0) {
      this.onLoadToast('info', 'Seleccione un registro');
      return;
    }
    this.openModal(
      UploadExpedientServiceOrderFormComponent,
      this.rowSelected,
      'review-results'
    );
    //this.openModal(UploadExpedientServiceOrderComponent, 'review-results');
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

  downloadFiles() {
    const filename: string = 'MuestreoOrdenes';
    const file = this.paragraphs['data'];
    //type: 'csv'
    this.excelService.export(file, { filename });
  }
}
