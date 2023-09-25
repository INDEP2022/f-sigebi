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
    let obj2Storage = {};
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

      case 'PropuestaServicioINDEPEnviada':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 1,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'OrdenServicioAutorizado':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 2,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'OrdenFirmaPorDeleRegional':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 3,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'ReporteImplemenEnviadoINDEP':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 4,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'ReporteImplemenAutorizado':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 5,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'ReporteImplemenFirmadoDelegReg':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 6,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'AnexoWFirmaTercero':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 7,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'PropuestaServicioRechazo':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 8,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'JustifiPropuestaServiEnviado':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 9,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'JustifiPropuestaServicioRechazo':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 10,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'PropuestaReporteImplemenNoAceptada':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 11,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'JustificaPropuestaReporteImplemenEnviada':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 12,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'JustificaPropuestaReporteImplemenRechazo':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 13,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'ContrapropuestaServicioEnviado':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 14,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      case 'ContrapropuestaReporteImpleEnviada':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.number,
        ]);
        obj2Storage = {
          op: 15,
        };
        localStorage.setItem(`Task`, JSON.stringify(obj2Storage));
        break;
      default:
        break;
    }
  }
}
