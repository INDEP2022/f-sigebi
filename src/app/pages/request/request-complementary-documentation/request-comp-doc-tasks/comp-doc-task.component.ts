import { inject } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, of } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequestDocument } from 'src/app/core/models/requests/document.model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared';
import Swal from 'sweetalert2';

export abstract class CompDocTasksComponent extends BasePage {
  protected abstract regDocForm: boolean;
  protected abstract regDocView: boolean;
  protected abstract searchRequestSimGoods: boolean;
  protected abstract searchAssociateFile: boolean;
  protected abstract selectGoods: boolean;
  protected abstract guidelines: boolean;
  protected abstract docRequest: boolean;
  protected abstract expRequest: boolean;
  protected abstract selectGoodForEyeVisit: boolean;
  protected abstract validateGoodForEyeVisit: boolean;
  protected abstract resultVisits: boolean;
  protected abstract viewSelectedGoods: boolean;
  protected abstract resultEyeVisitReport: boolean;
  protected abstract makeResultPaperReport: boolean;
  protected abstract dictumValidate: boolean;
  protected abstract notifyReport: boolean;
  protected abstract saveRequest: boolean;
  protected abstract turnReq: boolean;
  protected abstract createReport: boolean;
  protected abstract rejectReq: boolean;
  protected abstract RequestEconomicResourcesReport: boolean;
  protected abstract title: string;
  protected abstract complementaryDoc: boolean;
  protected abstract requestInfo: IRequest;
  protected abstract typeVisit: string;
  protected abstract listGoodSelectedTitle: string;

  protected abstract sendEmail: boolean;
  protected abstract destinyJob: boolean;
  protected abstract verifyCompliance: boolean; //NUEVO VERIFICAR
  protected abstract btnAprove: boolean; //NUEVO VERIFICAR
  protected abstract btnDecline: boolean; //NUEVO VERIFICAR
  protected abstract dictumReturn: boolean; //NUEVO VERIFICAR BOTON NUEVO

  docTemplate: IRequestDocument[];

  private rejectedService = inject(RejectedGoodService);

  constructor() {
    super();
  }

  titleView(affair: number, process: string) {
    if (affair == 13) {
      this.title = `DOCUMENTACIÓN COMPLEMENTARIA: Registro de Documentación Complementaria, No. Solicitud ${this.requestInfo.id}`;
      this.complementaryDoc = true;
    } else if (affair == 40) {
      if (process == 'RERegistroSolicitudes' || process == 'register-request') {
        this.title = `RESARCIMIENTO EN ESPECIE: Registro de Documentación Complementaria, No. Solicitud: #: ${this.requestInfo.id}`;
      }
      if (process == 'RERevisionLineamientos') {
        this.title = `Revisión de Lineamientos Resarcimiento (EN ESPECIE), No. Solicitud ${this.requestInfo.id}, Contribuyente, PAMA.`;
      }
      if (process == 'REGenerarResultadoAnalisis') {
        this.title = `Generar Resultado de Análisis Resarcimiento (EN ESPECIE), No. Solicitud ${this.requestInfo.id}, Contribuyente, PAMA`;
      }
      if (process == 'BSValidarDictamen') {
        this.title = `Validar Dictamen Resarcimiento (EN ESPECIE), No. Solicitud ${this.requestInfo.id}, Contribuyente, PAMA`;
      }
    } else if (affair == 41) {
      if (process == 'IBRegistroSolicitudes' || process == 'register-request') {
        this.title = `INFORMACIÓN DE BIENES: Registro de Documentación Complementaria, No. Solicitud: ${this.requestInfo.id}`;
      }
      if (process == 'IBGenerarSolicitudInformacion') {
        this.title = `Generar Solicitud de Información y Oficio de Respuesta, No. Solicitud: ${this.requestInfo.id}`;
      }
      if (process == 'IBRevisionOficioRespuesta') {
        this.title = `Revisión del Oficio de Respuesta de Información, No. Solicitud: ${this.requestInfo.id}`;
      }
    }
  }

  mapTask(process: string, affair?: number) {
    console.log('affair', affair);
    this.disableTabs();
    switch (process) {
      case 'register-request':
        if (affair == 13) {
          this.regDocForm = true;
          this.regDocView = false;
          this.searchRequestSimGoods = true;
          this.selectGoods = false;
          this.viewSelectedGoods = false;
          this.guidelines = false;
          this.docRequest = false;
          this.expRequest = true;
          this.saveRequest = true;
          this.dictumValidate = false;
          this.notifyReport = false;
          this.selectGoodForEyeVisit = false;
          this.validateGoodForEyeVisit = false;

          this.turnReq = true;
          this.createReport = false;
          this.rejectReq = false;
        } else if (affair == 10) {

          this.searchRequestSimGoods = true;
          this.regDocForm = true;
          this.selectGoods = true;
          this.expRequest = true;
          this.searchAssociateFile = true;
          this.selectGoodForEyeVisit = false;
          this.validateGoodForEyeVisit = false;

          this.turnReq = true;

        } else if (affair == 33) {
          //RESARCIMIENTO EN ESPECIES
          this.regDocForm = true;
          this.searchRequestSimGoods = true;
          this.selectGoods = true;
          this.expRequest = true;
          this.saveRequest = true;
        } else if (affair == 25) {
          //NUMERARIO DECOMISADO DEVUELTO
          this.regDocForm = true;
          this.searchRequestSimGoods = true;
          this.selectGoods = true;
          this.expRequest = true;
          this.saveRequest = true;
          this.turnReq = true;
        } else if (affair == 40) {
          //RESARCIMIENTO EN ESPECIE
          this.regDocForm = true;
          this.searchRequestSimGoods = true;
          this.selectGoods = true;
          this.expRequest = true;
          this.saveRequest = true;
          this.turnReq = true;
        } else if (affair == 41) {
          //INFORMACION DE BIENES
          this.regDocForm = true;
          this.searchRequestSimGoods = true;
          this.selectGoods = true;
          this.expRequest = true;
          this.saveRequest = true;
          this.turnReq = true;
        }

        break;
      case 'similar-good-register-documentation':
        this.regDocForm = true;
        this.regDocView = false;
        this.searchRequestSimGoods = true;
        this.selectGoods = true;
        this.viewSelectedGoods = false;
        this.guidelines = false;
        this.docRequest = false;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = false;
        this.notifyReport = false;
        this.selectGoodForEyeVisit = false;
        this.validateGoodForEyeVisit = false;

        this.turnReq = true;
        this.createReport = false;
        this.rejectReq = false;
        break;

      case 'guidelines-review':
        this.regDocForm = false;
        this.regDocView = true;
        this.searchRequestSimGoods = false;
        this.selectGoods = false;
        this.viewSelectedGoods = true;
        this.guidelines = true;
        this.docRequest = false;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = false;
        this.notifyReport = false;
        this.selectGoodForEyeVisit = false;
        this.validateGoodForEyeVisit = false;

        this.turnReq = true;
        this.createReport = true;
        this.rejectReq = false;

        break;
      case 'analysis-result':
        this.regDocForm = false;
        this.regDocView = true;
        this.searchRequestSimGoods = false;
        this.selectGoods = true;
        this.viewSelectedGoods = false;
        this.guidelines = true;
        this.docRequest = false;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = false;
        this.notifyReport = false;
        this.selectGoodForEyeVisit = false;
        this.validateGoodForEyeVisit = false;

        this.turnReq = true;
        this.createReport = true;
        this.rejectReq = true;

        break;
      case 'dictum-validate':
        this.regDocForm = false;
        this.regDocView = true;
        this.searchRequestSimGoods = false;
        this.selectGoods = true;
        this.viewSelectedGoods = false;
        this.guidelines = true;
        this.docRequest = false;
        this.expRequest = true;
        this.saveRequest = true;
        this.dictumValidate = true;
        this.notifyReport = false;
        this.selectGoodForEyeVisit = false;
        this.validateGoodForEyeVisit = false;

        this.turnReq = true;
        this.createReport = true;
        this.rejectReq = true;
        break;
      /*case 'BSRegistroSolicitudes':
        //registro del formulario
        this.regDocForm = true;
        //buscar solicitudes de bienes
        this.searchRequestSimGoods = true;
        //seleccionar bienes
        this.selectGoods = true;
        //expedientes
        this.expRequest = true;
        this.saveRequest = true;
        break;*/
      case 'BSNotificarTransferente':
        this.listGoodSelectedTitle = 'Bienes Seleccionados';
        //ver registro
        this.regDocView = true;
        //visualizar los bienes seleccioandos
        this.viewSelectedGoods = true;
        this.docRequest = true;
        this.expRequest = true;
        this.saveRequest = true;
        this.notifyReport = true;
        this.turnReq = true;
        break;
      case 'BSVisitaOcular':
        this.typeVisit = 'selectGood';
        this.regDocView = true;
        this.docRequest = true;
        this.expRequest = true;
        this.saveRequest = true;
        this.selectGoodForEyeVisit = true;
        this.turnReq = true;
        break;
      case 'BSValidarVisitaOcular':
        this.regDocView = true;
        this.docRequest = true;
        this.expRequest = true;
        this.saveRequest = true;
        this.validateGoodForEyeVisit = true;
        this.resultEyeVisitReport = true;
        this.turnReq = true;
        break;
      case 'BSElaborarOficioRespuesta':
        this.typeVisit = 'resultGood';
        this.regDocView = true;
        this.docRequest = true;
        this.expRequest = true;
        this.saveRequest = true;
        this.resultVisits = true;
        this.turnReq = true;
        this.makeResultPaperReport = true;
        break;
      case 'RERegistroDocComplementaria':
        this.regDocForm = true;
        this.searchRequestSimGoods = true;
        this.selectGoods = true;
        this.docRequest = true;
        this.expRequest = true;
        this.saveRequest = true;
        this.turnReq = true;
        break;
      case 'RevisonLineamientos':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.guidelines = true;
        this.docRequest = true;
        this.expRequest = true;
        this.createReport = true;
        this.saveRequest = true;
        this.turnReq = true;

        if (affair == 25) {
          this.regDocView = true;
          this.viewSelectedGoods = true;
          this.guidelines = true;
          this.docRequest = true;
          this.expRequest = true;
          this.createReport = true;
          this.saveRequest = true;
          this.turnReq = true;
        }
        break;
      case 'GRAnalisisResarcimiento':
        this.regDocView = true;
        this.selectGoods = true;

        this.guidelines = true;
        this.docRequest = true;
        this.expRequest = true;
        this.createReport = true;
        this.saveRequest = true;
        this.rejectReq = true;
        this.turnReq = true;
        break;
      /* case 'RNRegistroDocumenComple':
        //registro del formulario
        this.regDocForm = true;
        //buscar solicitudes de bienes
        this.searchRequestSimGoods = true;
        //seleccionar bienes
        this.selectGoods = true;
        //expedientes
        this.expRequest = true;
        this.saveRequest = true;
        this.turnReq = true;
        break; */
      case 'RNSolicitudRecursosEcono':
        this.listGoodSelectedTitle = 'Bienes Seleccionados';
        //ver registro
        this.regDocView = true;
        //visualizar los bienes seleccioandos
        this.viewSelectedGoods = true;
        this.docRequest = true;
        this.expRequest = true;
        this.saveRequest = true;
        this.RequestEconomicResourcesReport = true;
        this.turnReq = true;
        break;

      /** CASOS DE USO DEVOLUCION */
      case 'register-request-return':
        this.title = `DEVOLUCIÓN: Registro de Documentación Complementaria, No. Solicitud: ${this.requestInfo.id}`;
        this.regDocForm = true;
        this.searchAssociateFile = true;
        this.selectGoods = true;
        this.expRequest = true;
        this.turnReq = true;
        this.searchRequestSimGoods = false;
        this.selectGoodForEyeVisit = false;
        this.validateGoodForEyeVisit = false;

        break;
      case 'verify-compliance-return':
        this.title = ` DEVOLUCIÓN: Verificar Cumplimiento, No. Solicitud ${this.requestInfo.id}, Contribuyente, PAMA`;
        this.regDocView = true;
        this.verifyCompliance = true; //AGREGAR  VERIFICAR CUMPLIMIENTO DE BIENES (TAB) VALIDAR
        this.selectGoods = true;
        this.expRequest = true;

        this.btnAprove = true; //AGREGAR SOLICITAR APROBACIÓN (BOTON) validateDocument verificar
        this.dictumReturn = true; //AGREGAR DICTAMEN DEVOLUCIÓN (BOTON) validar Nuevo botón

        this.turnReq = false;
        this.searchAssociateFile = false;
        this.searchRequestSimGoods = false;
        this.selectGoodForEyeVisit = false;
        this.validateGoodForEyeVisit = false;

        break;
      case 'approve-return':
        this.title = `Aprobar Devolución, No. Solicitud ${this.requestInfo.id}, Contribuyente, PAMA`;
        this.regDocView = true;
        this.selectGoods = true;
        this.expRequest = true;
        this.verifyCompliance = true; //AGREGAR  VERIFICAR CUMPLIMIENTO DE BIENES (TAB) VALIDAR

        this.btnAprove = true;
        this.dictumReturn = true; //AGREGAR DICTAMEN DEVOLUCIÓN (BOTON) validar Nuevo botón
        this.btnDecline = true;

        this.turnReq = false;
        this.regDocForm = false;
        this.searchAssociateFile = false;
        this.searchRequestSimGoods = false;
        this.selectGoodForEyeVisit = false;
        this.validateGoodForEyeVisit = false;

        break;

      /** CASOS DE BIENES SIMILARES */
      case 'register-request-similar-goods':
        this.title = `BIENES SIMILARES: Registro de Documentación Complementaria, No. Solicitud: ${this.requestInfo.id}`;
        this.regDocForm = true;
        this.selectGoods = true;
        this.searchAssociateFile = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.turnReq = true;

        this.docRequest = false;
        this.viewSelectedGoods = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.notifyReport = false;
        this.regDocView = false;
        this.selectGoodForEyeVisit = false;
        this.validateGoodForEyeVisit = false;
        this.createReport = false;
        this.rejectReq = false;
        break;

      case 'notify-transfer-goods':
        this.title = `BIENES SIMILARES: Notificar a Transferente, No. Solicitud:  ${this.requestInfo.id}, Contribuyente USARIO CARGIA, PAMA 159743CV `;
        this.regDocView = true;
        this.selectGoods = true;
        this.expRequest = true;

        this.notifyReport = true;
        this.saveRequest = true;
        this.turnReq = true;

        this.docRequest = false;
        this.searchAssociateFile = false;
        this.viewSelectedGoods = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.regDocView = false;
        this.selectGoodForEyeVisit = false;
        this.validateGoodForEyeVisit = false;
        this.createReport = false;
        this.rejectReq = false;

        break;
      case 'eye-visit-goods':
        this.title = `BIENES SIMILARES: Programar Visita Ocular, No. Solicitud:  ${this.requestInfo.id}, Contribuyente USARIO CARGIA, PAMA 159743CV`;
        this.regDocView = true;
        this.selectGoods = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.turnReq = true;

        this.notifyReport = false;
        this.docRequest = false;
        this.searchAssociateFile = false;
        this.viewSelectedGoods = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.regDocView = false;
        this.selectGoodForEyeVisit = false;
        this.validateGoodForEyeVisit = false;
        this.createReport = false;
        this.rejectReq = false;

        break;
      case 'validate-eye-visit-goods':
        this.title = `BIENES SIMILARES: Validar Resultado Visita Ocular, No. Solicitud: ${this.requestInfo.id}, Contribuyente USARIO CARGIA, PAMA 159743CV`;
        this.regDocView = true;
        this.expRequest = true;
        this.validateGoodForEyeVisit = true;

        this.resultEyeVisitReport = true;
        this.saveRequest = true;
        this.turnReq = true;

        this.selectGoods = false;
        this.notifyReport = false;
        this.docRequest = false;
        this.searchAssociateFile = false;
        this.viewSelectedGoods = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.regDocView = false;
        this.selectGoodForEyeVisit = false;
        this.createReport = false;
        this.rejectReq = false;

        break;
      case 'validate-opinion-assets':
        this.regDocForm = true;
        this.expRequest = true;
        this.resultVisits = true;

        this.resultEyeVisitReport = true;
        this.saveRequest = true;
        this.turnReq = true;

        this.validateGoodForEyeVisit = false;
        this.selectGoods = false;
        this.notifyReport = false;
        this.docRequest = false;
        this.searchAssociateFile = false;
        this.viewSelectedGoods = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.regDocView = false;
        this.selectGoodForEyeVisit = false;
        this.createReport = false;
        this.rejectReq = false;

        break;

      /** CASOS DE RESARCIMIENTO */

      case 'register-request-compensation':
        this.regDocForm = true;
        this.searchRequestSimGoods = true;
        this.selectGoods = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.turnReq = true;
        break;

      case 'response-office-compensation':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.guidelines = true;
        this.expRequest = true;
        this.docRequest = true;

        this.createReport = true;
        this.saveRequest = true;
        this.turnReq = true;

        this.searchRequestSimGoods = false;

        if (affair == 25) {
          this.regDocView = true;
          this.viewSelectedGoods = true;
          this.guidelines = true;
          this.docRequest = true;
          this.expRequest = true;
          this.createReport = true;
          this.saveRequest = true;
          this.turnReq = true;
        }

        break;

      case 'analysis-result-compensation':
        this.regDocView = true;
        this.selectGoods = true;
        this.guidelines = true;
        this.expRequest = true;

        this.createReport = true;
        this.saveRequest = true;
        this.rejectReq = true;
        this.turnReq = true;

        this.docRequest = true; //VERIFICAR

        break;

      case 'validate-dictum-compensation':
        this.regDocView = true;
        this.selectGoods = true;
        this.guidelines = true;
        this.dictumValidate = true; //AGREGAR DATOS DEL DICTAMEN (TAB)
        this.expRequest = true;

        this.createReport = true;
        this.saveRequest = true;
        this.rejectReq = true;
        this.turnReq = true;

        this.docRequest = true; //VERIFICAR
        break;

      case 'notify-compensation':
        this.regDocView = true;
        this.selectGoods = true;
        this.guidelines = true;
        this.dictumValidate = true; //AGREGAR DATOS DEL DICTAMEN (TAB)
        this.expRequest = true;

        this.saveRequest = true;
        this.turnReq = true;
        this.notifyReport = true; //VERIFICAR FUNCIÓN

        this.docRequest = true; //VERIFICAR
        this.createReport = false;
        this.rejectReq = false;

        break;

      /** CASOS DE INFORMACION DE BIENES */

      case 'register-request-information-goods':
        this.regDocForm = true;
        this.searchAssociateFile = true;
        this.selectGoods = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.turnReq = true;

        this.resultEyeVisitReport = false;
        this.resultVisits = false;
        this.validateGoodForEyeVisit = false;
        this.notifyReport = false;
        this.docRequest = false;
        this.viewSelectedGoods = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.regDocView = false;
        this.createReport = false;
        this.rejectReq = false;
        break;

      case 'request-information-office':
        this.regDocView = true;
        this.selectGoods = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.turnReq = true;
        this.sendEmail = true; //AGREGAR ENVIAR CORREO DE SOLICITUD (BOTON)
        this.destinyJob = true; //AGREGAR OFICIO DESTINO (BOTON)

        this.searchAssociateFile = false;
        this.resultEyeVisitReport = false;
        this.resultVisits = false;
        this.validateGoodForEyeVisit = false;
        this.notifyReport = false;
        this.docRequest = false;
        this.viewSelectedGoods = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.regDocView = false;
        this.createReport = false;
        this.rejectReq = false;
        break;
      case 'response-office':
        this.regDocView = true;
        this.selectGoods = true;
        this.expRequest = true;

        this.saveRequest = true;
        //AGREGAR FINALIZAR (BOTON) VALIDAR BOTON EXISTENTE
        this.destinyJob = true; //AGREGAR OFICIO DESTINO (BOTON)

        this.turnReq = false;
        this.searchAssociateFile = false;
        this.resultEyeVisitReport = false;
        this.resultVisits = false;
        this.validateGoodForEyeVisit = false;
        this.notifyReport = false;
        this.docRequest = false;
        this.viewSelectedGoods = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.regDocView = false;
        this.createReport = false;
        this.rejectReq = false;

        break;

      default:
        break;
    }
  }

  getGoodResDev(params: ListParams) {
    return new Promise((resolve, reject) => {
      this.rejectedService
        .getAll(params)
        .pipe(
          catchError(err => {
            if (err.status == 400) {
              return of({ data: [], count: 0 });
            }
            throw err;
          })
        )
        .subscribe({
          next: resp => {
            resolve(resp);
          },
          error: error => {
            reject(
              'error no se pudo obtener los bienes de la tabla good-res-dev'
            );
          },
        });
    });
  }

  turnResquestMessage(requestId: number, email?: string) {
    Swal.fire({
      title: `Desea turnar la solicitud con el folio: ${requestId}`,
      text: 'Usted va a transferir una solicitud que no es comercio exterior a un TE',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#9B2348',
      cancelButtonColor: '#B28D5C',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        this.onLoadToast('success', 'Solicitud turnada con éxito', '');
      }
    });
  }
  private disableTabs() {
    this.regDocForm = false;
    this.regDocView = false;
    this.searchRequestSimGoods = false;
    this.selectGoods = false;
    this.viewSelectedGoods = false;
    this.guidelines = false;
    this.docRequest = false;
    this.expRequest = false;
    this.saveRequest = false;
    this.dictumValidate = false;
    this.notifyReport = false;
    this.selectGoodForEyeVisit = false;
    this.validateGoodForEyeVisit = false;
    this.resultEyeVisitReport = false;
    this.turnReq = false;
    this.createReport = false;
    this.rejectReq = false;
    this.makeResultPaperReport = false;
  }

  nextProcess(process: string, reject = false) {

    let title = '';
    let next = '';
    let url = '';
    let type = '';
    let subtype = '';
    let ssubtype = '';
    let finish = false;

    switch (process) {

      /** CASOS DE USO DEVOLUCION */
      case 'register-request-return':
        title = `DEVOLUCIÓN: Verificar Cumplimiento, No. Solicitud ${this.requestInfo.id}, Contribuyente, PAMA`;
        next = 'DVerificarCumplimiento';
        url = 'pages/request/request-comp-doc/tasks/verify-compliance-return';
        type = 'DOCUMENTACION_COMPLEMENTARIA';
        subtype = 'Registro_documentacion';
        ssubtype = 'TURNAR_SOLICITUD_DEVOLUCION';
        break;
      case 'verify-compliance-return':
        title = `Aprobar Devolución, No. Solicitud ${this.requestInfo.id}, Contribuyente, PAMA`;
        next = 'DAprobarDevolucion'
        url = 'pages/request/request-comp-doc/tasks/approve-return';
        break;
      case 'approve-return':
        finish = true;
        break;

      /** CASOS DE BIENES SIMILARES */
      case 'register-request-similar-goods':
        title = `BIENES SIMILARES: Notificar a Transferente, No. Solicitud:  ${this.requestInfo.id}, Contribuyente USARIO CARGIA, PAMA 159743CV `;
        next = 'BSNotificarTransferente';
        url = 'pages/request/request-comp-doc/tasks/notify-transfer-similar-goods';
        type = 'DOCUMENTACION_COMPLEMENTARIA';
        subtype = 'Registro_documentacion';
        ssubtype = 'TURNAR_SOLICITUD_DEVOLUCION';
        break;
      case 'notify-transfer-similar-goods':
        title = `BIENES SIMILARES: Programar Visita Ocular, No. Solicitud:  ${this.requestInfo.id}, Contribuyente USARIO CARGIA, PAMA 159743CV`;
        next = 'BSVisitaOcular'
        url = 'pages/request/request-comp-doc/tasks/eye-visit-similar-goods';
        break;
      case 'eye-visit-similar-goods':
        title = `BIENES SIMILARES: Validar Resultado Visita Ocular, No. Solicitud: ${this.requestInfo.id}, Contribuyente USARIO CARGIA, PAMA 159743CV`;
        next = 'BSValidarVisitaOcular'
        url = 'pages/request/request-comp-doc/tasks/validate-eye-visit-similar-goods';
        break;
      case 'validate-eye-visit-similar-goods':
        title = `BIENES SIMILARES: Validar Resultado Visita Ocular, No. Solicitud: ${this.requestInfo.id}, Contribuyente USARIO CARGIA, PAMA 159743CV`;
        next = 'BSValidarVisitaOcular'
        url = 'pages/request/request-comp-doc/tasks/validate-opinion-similar-goods';
        break;
      case 'validate-opinion-similar-goods':
        break;

      /** CASOS RESARCIMIENTO ESPECIE */
      case 'register-request-compensation':
        title = `Revisión de Lineamientos Resarcimiento (EN ESPECIE), No. Solicitud ${this.requestInfo.id}, Contribuyente, PAMA.`;
        next = 'RERevisionLineamientos';
        url = 'pages/request/request-comp-doc/tasks/review-guidelines-compensation';
        type = 'DOCUMENTACION_COMPLEMENTARIA';
        subtype = 'Registro_documentacion';
        ssubtype = 'TURNAR_RESARCIMIENTO_ESPECIE';
        break;
      case 'review-guidelines-compensation':
        title = `Generar Resultado de Análisis Resarcimiento (EN ESPECIE), No. Solicitud ${this.requestInfo.id}, Contribuyente, PAMA`;
        next = 'REGenerarResultadoAnalisis';
        url = 'pages/request/request-comp-doc/tasks/analysis-result-compensation';
        break;
      case 'analysis-result-compensation':
        title = `Generar Resultado de Análisis Resarcimiento (EN ESPECIE), No. Solicitud ${this.requestInfo.id}, Contribuyente, PAMA`;
        next = 'REGenerarResultadoAnalisis';
        url = 'pages/request/request-comp-doc/tasks/validate-opinion-compensation';
        break;
      case 'validate-opinion-compensation':
        title = `Validar Dictamen Resarcimiento (EN ESPECIE), No. Solicitud ${this.requestInfo.id}, Contribuyente, PAMA`;
        next = 'BSValidarDictamen';
        url = 'pages/request/request-comp-doc/tasks/notification-taxpayer-compensation';
        break;
      case 'notification-taxpayer-compensation':
        break;

      /** CASOS INFORMACION DE BIENES */
      case 'register-request-compensation':
        title = `Generar Solicitud de Información y Oficio de Respuesta, No. Solicitud: ${this.requestInfo.id}`;
        next = 'IBGenerarSolicitudInformacion';
        url = 'pages/request/request-comp-doc/tasks/review-guidelines-compensation';
        type = 'DOCUMENTACION_COMPLEMENTARIA';
        subtype = 'Registro_documentacion';
        ssubtype = 'TURNAR_RESARCIMIENTO_ESPECIE';
        break;
      case 'review-guidelines-compensation':
        title = `Revisión del Oficio de Respuesta de Información, No. Solicitud: ${this.requestInfo.id}`;
        next = 'IBRevisionOficioRespuesta';
        url = 'pages/request/request-comp-doc/tasks/analysis-result-compensation';
        break;
      case 'analysis-result-compensation':

        break;

    }

    if (reject) {
      ssubtype = 'REJECT';
    }

    return {
      title: title,
      urlNb: url,
      processName: next,
      finish: finish,
      subtype: subtype,
      ssubtype: ssubtype,
      type: type
    };
  }

}
