import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequestList } from 'src/app/core/models/catalogs/request-list.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { REQUEST_LIST_COLUMNS } from './request-list-columns';

var usuario: IRequestList[] = [
  {
    title: 'Registro de solicitud (Captura de Solicitud) con folio 45009',
    noRequest: 45009,
    numTask: 260301,
    noInstance: 820169,
    created: 'tester_nsbxt',
    process: 'SolicitudeTransferencia',
  },
  {
    title: 'Registo de solicitud (programar solicitud) con folio 45010',
    noRequest: 45010,
    numTask: 260302,
    noInstance: 820170,
    created: 'tester_nsbxt',
    process: 'SolicitudProgramacion',
  },
  {
    title:
      'BIENES SIMILARES: Registro de Documentación Complementaria, No. Solicitud: 1851',
    noRequest: 45010,
    numTask: 260302,
    noInstance: 820170,
    created: 'tester_nsbxt',
    process: 'RegistroSolicitudes',
  },
  {
    title:
      'RESARCIMIENTO NUMERARIO: Registro de Documentación Complementaria, No. Solicitud: 1896',
    noRequest: 1896,
    numTask: 212028,
    noInstance: 450060,
    created: 'tester_nsbxt',
    process: 'RE_RegistrarDocumentacion',
  },
  {
    title:
      'Solicitar Recursos Económicos, No. Solicitud: 1896, Contribuyente CARLOS G. PALMA',
    noRequest: 1896,
    numTask: 212097,
    noInstance: 450060,
    created: 'tester_nsbxt',
    process: 'RE_SolicitarRecursos',
  },
  {
    title: 'Solicitud orden de servicio (Captura de servicios)',
    noRequest: 5464,
    numTask: 212324,
    noInstance: 4502344,
    created: 'tester_nsbxt',
    process: 'OrderServiceProccess',
  },
  {
    title:
      'Revisión de Lineamientos de Resarcimiento (NUMERARIO), No. Solicitud: 1896, Contribuyente CARLOS G. PALMA',
    noRequest: 1896,
    numTask: 212097,
    noInstance: 450060,
    created: 'tester_nsbxt',
    process: 'RE_RevisarLineamientos',
  },
  {
    title:
      'Registrar Cita Contribuyente (Resarcimiento NUMERARIO), No. Solicitud: 1896, Contribuyente CARLOS G. PALMA',
    noRequest: 1896,
    numTask: 212097,
    noInstance: 450060,
    created: 'tester_nsbxt',
    process: 'RE_RegistrarCita',
  },
  {
    title:
      'Registrar Orden de Pago (Resarcimiento NUMERARIO), No. Solicitud: 1896, Contribuyente CARLOS G. PALMA',
    noRequest: 1896,
    numTask: 212044,
    noInstance: 450060,
    created: 'tester_nsbxt',
    process: 'RE_OrdenPago',
  },
  {
    title:
      'Generar Acta de Resarcimiento, No. Solicitud: 1896, Contribuyente CARLOS G. PALMA',
    noRequest: 1896,
    numTask: 212045,
    noInstance: 450060,
    created: 'tester_nsbxt',
    process: 'RE_GenerarActa',
  },
];

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: IRequestList[] = [];
  totalItems: number = 0;

  constructor(public modalService: BsModalService, public router: Router) {
    super();
    this.settings = { ...TABLE_SETTINGS, actions: false, selectMode: '' };
    this.settings.columns = REQUEST_LIST_COLUMNS;
    /* this.settings.actions = {
      columnTitle: 'Acciones',
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    }; */
  }

  ngOnInit(): void {
    this.paragraphs = usuario;
  }

  /* openCreateRequestForm(event?: IRequestList) {
    this.router.navigate(['pages/request/list/new-transfer-request']);
  } */

  openCreateProgrammingRequest() {
    this.router.navigate;
  }

  editRequest(event: any) {
    switch (event.data.process) {
      case 'SolicitudProgramación':
        // en el caso de que sea una solicitud de programacion
        this.router.navigate([
          'pages/request/perform-programming',
          event.data.noRequest,
        ]);
        break;

      case 'OrderServiceProccess':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.noRequest,
        ]);
        break;

      case 'RegistroSolicitudes':
        // en el caso de que el proceso seleccionado sea Bienes Similares
        this.router.navigate([
          'pages/request/manage-similar-goods/register-request-goods',
          event.data.noRequest,
        ]);
        break;
      case 'RE_RegistrarDocumentacion':
        // en el caso de que sea el proceso de registrar solicitud de resarcimiento economico
        this.router.navigate([
          'pages/request/economic-compensation/register-documentation',
          event.data.noRequest,
        ]);
        break;
      case 'RE_SolicitarRecursos':
        // en el caso de que sea el proceso de registrar solicitud de recursos economicos
        this.router.navigate([
          'pages/request/economic-compensation/economic-resources',
          event.data.noRequest,
        ]);
        break;

      case 'OrderServiceProccess':
        this.router.navigate([]);
        break;

      case 'SolicitudeTransferencia':
        // en el caso de que sea una solicitud de programacion de resarcimiento economico
        this.router.navigate([
          'pages/request/transfer-request/registration-request',
          1,
        ]);
        break;
      case 'RE_RevisarLineamientos':
        // en el caso de que sea el proceso de revision de lineamientos de resarcimiento economico
        this.router.navigate([
          'pages/request/economic-compensation/guidelines-revision',
          event.data.noRequest,
        ]);
        break;
      case 'RE_RegistrarCita':
        // en el caso de que sea el proceso de registrar cita contributente de resarcimiento economico
        this.router.navigate([
          'pages/request/economic-compensation/register-appointment',
          event.data.noRequest,
        ]);
        break;
      case 'RE_OrdenPago':
        // en el caso de que sea el proceso de registrar orden de pago de resarcimiento economico
        this.router.navigate([
          'pages/request/economic-compensation/payment-order',
          event.data.noRequest,
        ]);
        break;
      case 'RE_GenerarActa':
        // en el caso de que sea el proceso de registrar orden de pago de resarcimiento economico
        this.router.navigate([
          'pages/request/economic-compensation/compensation-act',

          event.data.noRequest,
        ]);
        break;
      default:
        break;
    }
  }

  private openModel(
    sizeModal: string,
    modalComponent: any,
    parameter?: IRequestList
  ): void {
    let config: ModalOptions = {
      initialState: {
        parameter: parameter,
        callback: (next: boolean) => {
          //if(next) this.getExample();
        },
      },
      class: `${sizeModal} modal-dialog-centered`,
      ignoreBackdropClick: true,
    };
    this.modalService.show(modalComponent, config);
  }
}
