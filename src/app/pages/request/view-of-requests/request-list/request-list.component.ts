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
    id: 43437,
    title: 'Registro de solicitud (Captura de Solicitud) con folio 43437',
    noRequest: 45009,
    numTask: 260301,
    noInstance: 820169,
    created: 'tester_nsbxt',
    process: 'SolicitudeTransferencia',
  },
  {
    id: 43437,
    title: 'Verificacion de solicitud (Captura de Solicitud) con folio 43437',
    noRequest: 45009,
    numTask: 260301,
    noInstance: 820169,
    created: 'tester_nsbxt',
    process: 'VerificarCumplimiento',
  },
  {
    id: 43691,
    title: 'Clasificación de bienes (Captura de Solicitud) con folio 43691',
    noRequest: 43691,
    numTask: 260301,
    noInstance: 820169,
    created: 'tester_nsbxt',
    process: 'ClassifyAssets',
  },
  {
    id: 43437,
    title: 'Registro de solicitud (Captura de Solicitud) con folio 43437',
    noRequest: 45009,
    numTask: 260301,
    noInstance: 820169,
    created: 'tester_nsbxt',
    process: 'SolicitudeTransferencia',
  },
  {
    title: 'Realizar programación con folio: R-METROPOLITANA-PROFECO-8409',
    noRequest: 8409,
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
      'BIENES SIMILARES: Programar Visita Ocular, No. Solicitud: 1852, Contribuyente: LETICIA GARCÍA, PAMA: 235324SDA',
    noRequest: 45011,
    numTask: 260302,
    noInstance: 820170,
    created: 'tester_nsbxt',
    process: 'ProgramarVisitaOcular',
  },
  {
    title:
      'BIENES SIMILARES: Notificar a Transferente, No. Solicitud 1851, Contribuyente: LETICIA GARCÍA, PAMA: 235324SDA',
    noRequest: 1851,
    numTask: 260302,
    noInstance: 820170,
    created: 'tester_nsbxt',
    process: 'NotificacionTransferente',
  },
  {
    title:
      'BIENES SIMILARES: Validar Resultado Visita Ocular, No. Solicitud: 1851, Contribuyente: LETICIA GARCÍA, PAMA: 235324SDA',
    noRequest: 45011,
    numTask: 260302,
    noInstance: 820170,
    created: 'tester_nsbxt',
    process: 'ValidarResultadoVisitaOcular',
  },
  {
    title:
      'BIENES SIMILARES: Elaborar Oficio de Respuesta, No. Solicitud: 1851, Contribuyente: LETICIA GARCÍA, PAMA: 235324SDA',
    noRequest: 45011,
    numTask: 260302,
    noInstance: 820170,
    created: 'tester_nsbxt',
    process: 'ElaborarOficio',
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
      'Captura de orden de servicio (Programación de entrega: E-METROPOLITANA-335) con folio: METROPOLITANA-1545-OS',
    noRequest: 5464,
    numTask: 212324,
    noInstance: 4502344,
    created: 'tester_nsbxt',
    process: 'OrdenServicioEntrega',
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
      'Generar Resultado de Análisis Resarcmieniento (NUMERARIO), No. Solicitud: 1896, Contribuyente CARLOS G. PALMA',
    noRequest: 1896,
    numTask: 212029,
    noInstance: 450060,
    created: 'tester_nsbxt',
    process: 'RE_ResultadoAnalisis',
  },
  {
    title:
      'Validar Dictamen Resarcmieniento (NUMERARIO), No. Solicitud: 1896, Contribuyente CARLOS G. PALMA',
    noRequest: 1896,
    numTask: 212035,
    noInstance: 450060,
    created: 'tester_nsbxt',
    process: 'RE_ValidarDictamen',
  },
  {
    title:
      'Notificación al Contribuyente (Resarcmieniento NUMERARIO), No. Solicitud: 1896, Contribuyente CARLOS G. PALMA',
    noRequest: 1896,
    numTask: 212036,
    noInstance: 450060,
    created: 'tester_nsbxt',
    process: 'RE_Notificar',
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
  {
    title:
      'DECOMISO: Registro de Documentación Complementaria, No. Solicitud: 1824',
    noRequest: 1824,
    numTask: 211928,
    noInstance: 430103,
    created: 'tester_nsbxt',
    process: 'DC_Decomiso',
  },
  {
    title:
      'ABANDONO: Registro de Documentación Complementaria, No. Solicitud: 1831',
    noRequest: 1831,
    numTask: 211945,
    noInstance: 430132,
    created: 'tester_nsbxt',
    process: 'DC_Abandono',
  },
  {
    title:
      'EXTINCIÓN DE DOMINIO: Registro de Documentación Complementaria, No. Solicitud: 1835',
    noRequest: 1835,
    numTask: 211955,
    noInstance: 430143,
    created: 'tester_nsbxt',
    process: 'DC_Extincion',
  },
  {
    title:
      'AMPARO: Registro de Documentación Complementaria, No. Solicitud: 1835',
    noRequest: 1836,
    numTask: 211955,
    noInstance: 430143,
    created: 'tester_nsbxt',
    process: 'AP_Amparo',
  },
  {
    title:
      'Notificación al contribuyente (Resarcimiento en especie), No solicitud 1899, contribuyente: Leticia Garcia, PAMA: 235324SDA',
    noRequest: 1899,
    numTask: 211956,
    noInstance: 430144,
    created: 'tester_nsbxt',
    process: 'Notification_Taxpayer',
  },
];

//AP_Amparo
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
    const request = event.data;
    //si se optiene el nombre por el titulo
    /*let array1 = request.title.split('(');
    let array2 = array1[1].split(')');
    let value = array2[0];
    console.log(value);*/

    switch (event.data.process) {
      case 'SolicitudProgramacion':
        // en el caso de que se retorne una solicitud de programación
        this.router.navigate([
          'pages/request/programming-request/return-to-programming/:id',
          event.data.noRequest,
        ]);
        break;

      case 'OrderServiceProccess':
        this.router.navigate([
          'pages/request/reception-service-order/service-order-request-capture',
          event.data.noRequest,
        ]);
        break;
      // ---------------------- SOLICITUDES DE BIENES SIMILARES
      case 'RegistroSolicitudes':
        // en el caso de que el proceso seleccionado sea Bienes Similares
        this.router.navigate([
          'pages/request/manage-similar-goods/register-request-goods',
          event.data.noRequest,
          1,
        ]);
        break;
      case 'ProgramarVisitaOcular':
        // en el caso de que el proceso seleccionado sea Programar Visita Ocular
        this.router.navigate([
          'pages/request/manage-similar-goods/schedule-eye-visits/',
          event.data.noRequest,
          2,
        ]);
        break;
      case 'ValidarResultadoVisitaOcular':
        // en el caso de que el proceso seleccionado sea Programar Visita Ocular
        this.router.navigate([
          'pages/request/manage-similar-goods/receive-validation-of-eye-visit-result/',
          event.data.noRequest,
          3,
        ]);
        break;
      case 'NotificacionTransferente':
        // en el caso de que el proceso seleccionado sea Bienes Similares
        this.router.navigate([
          'pages/request/manage-similar-goods/transf-notification',
          event.data.noRequest,
          4,
        ]);
        break;
      case 'ElaborarOficio':
        // en el caso de que el proceso seleccionado sea Bienes Similares
        this.router.navigate([
          'pages/request/manage-similar-goods/prepare-response-office',
          event.data.noRequest,
          5,
        ]);
        break;
      // ---------------------- SOLICITUDES DE BIENES SIMILARES
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

      case 'RE_ResultadoAnalisis':
        // en el caso de que sea el proceso de generar resultado de analisis de recursos economicos
        this.router.navigate([
          'pages/request/economic-compensation/analysis-result',
          event.data.noRequest,
        ]);
        break;

      case 'RE_ValidarDictamen':
        // en el caso de que sea el proceso de validar dictamen de recursos economicos
        this.router.navigate([
          'pages/request/economic-compensation/validate-dictum',
          event.data.noRequest,
        ]);
        break;

      case 'RE_Notificar':
        // en el caso de que sea el proceso de notificación de solicitud de entrega de recursos economicos
        this.router.navigate([
          'pages/request/economic-compensation/delivery-request-notif',
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
          event.data.id,
        ]);
        break;
      case 'VerificarCumplimiento':
        // en el caso de que sea una solicitud de programacion
        this.router.navigate([
          'pages/request/transfer-request/verify-compliance',
          event.data.noRequest,
        ]);
        break;
      case 'ClassifyAssets':
        // en el caso de que sea una solicitud de programacion
        this.router.navigate([
          'pages/request/transfer-request/classify-assets',
          event.data.noRequest,
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

      case 'DC_Decomiso':
        // en el caso de que sea el proceso de registrar solicitud de decomiso
        this.router.navigate([
          'pages/request/register-documentation/single/forfeiture',
          event.data.noRequest,
        ]);
        break;

      case 'DC_Abandono':
        // en el caso de que sea el proceso de registrar solicitud de abandono
        this.router.navigate([
          'pages/request/register-documentation/single/abandonment',
          event.data.noRequest,
        ]);
        break;

      case 'DC_Extincion':
        // en el caso de que sea el proceso de registrar solicitud de extincion
        this.router.navigate([
          'pages/request/register-documentation/single/extinction',
          event.data.noRequest,
        ]);
        break;

      case 'OrdenServicioEntrega':
        this.router.navigate([
          'pages/request/delivery-service-order/service-delivery-request-capture',
          event.data.noRequest,
        ]);
        break;

      case 'OrdenServicioEntrega':
        this.router.navigate([
          'pages/request/delivery-service-order/service-delivery-request-capture',
          event.data.noRequest,
        ]);
        break;

      case 'AP_Amparo':
        // en el caso de que sea el proceso de registrar solicitud de Amparo
        this.router.navigate([
          'pages/request/register-documentation-amparo/single/forfeiture',
          event.data.noRequest,
        ]);
        break;

      case 'Notification_Taxpayer':
        //En el caso que sea recibir la notificación del contibuyente resarcimiento (especie)
        this.router.navigate(['pages/request/notification-request-delivery/']);
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
