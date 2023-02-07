import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequestList } from 'src/app/core/models/catalogs/request-list.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { orderRequestData } from './data-order-request';
import { ORDER_LIST_COLUMNS } from './order-service-columns';

@Component({
  selector: 'app-delivery-scheduling-service-list',
  templateUrl: './delivery-scheduling-service-list.component.html',
  styles: [],
})
export class DeliverySchedulingServiceListComponent
  extends BasePage
  implements OnInit
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: IRequestList[] = [];
  totalItems: number = 0;
  data: any[] = orderRequestData;
  constructor(public router: Router) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: ORDER_LIST_COLUMNS,
    };
  }

  ngOnInit(): void {}

  editRequest(event: any) {
    switch (event.data.task) {
      case 'captureOrderService':
        this.router.navigate([
          'pages/request/delivery-service-order/capture-service-order',
          event.data.numberTask,
        ]);
        break;
      case 'validateOrderService':
        this.router.navigate([
          'pages/request/delivery-service-order/validate-service-order',
          event.data.numberTask,
        ]);
        break;
      case 'AprobateOrderService':
        this.router.navigate([
          'pages/request/delivery-service-order/aprobate-service-order',
          event.data.number,
        ]);
        break;
      case 'ReportImplementService':
        this.router.navigate([
          'pages/request/delivery-service-order/report-implement-service',
          event.data.number,
        ]);
        break;
      case 'ValidateReportImplement':
        this.router.navigate([
          'pages/request/delivery-service-order/validate-report-implement',
          event.data.number,
        ]);
        break;
      case 'AprobateReportImplementService':
        this.router.navigate([
          'pages/request/delivery-service-order/aprobate-report-implement-service',
          event.data.number,
        ]);
        break;

      case 'AprobateReportImplement':
        this.router.navigate([
          'pages/request/delivery-service-order/aprobate-report-implement',
          event.data.number,
        ]);
        break;

      case 'ProposalServiceRejected':
        this.router.navigate([
          'pages/request/delivery-service-order/proposal-service-rejected',
          event.data.number,
        ]);
        break;

      case 'JustifyServiceSent':
        this.router.navigate([
          'pages/request/delivery-service-order/justify-service-sent',
          event.data.number,
        ]);
        break;

      case 'JustifyServiceRejected':
        this.router.navigate([
          'pages/request/delivery-service-order/justify-service-rejected',
          event.data.number,
        ]);
        break;

      case 'ProposalReportImplementRejected':
        this.router.navigate([
          'pages/request/delivery-service-order/proposal-report-rejected',
          event.data.number,
        ]);
        break;

      case 'RejectOrderService':
        this.router.navigate([
          'pages/request/delivery-service-order/reject-order-service',
          event.data.number,
        ]);
        break;

      case 'CounterProposalReportImplementRejected':
        this.router.navigate([
          'pages/request/delivery-service-order/counter-proposal-implemet-sent',
          event.data.number,
        ]);
        break;

      default:
        break;
    }
  }
}
