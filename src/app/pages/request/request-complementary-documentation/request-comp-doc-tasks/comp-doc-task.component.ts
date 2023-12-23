import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IRequestDocument } from 'src/app/core/models/requests/document.model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared';
import Swal from 'sweetalert2';
import { REPORT_DOCUMENTS } from '../../shared-request/create-report/documents';

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
  protected abstract signedReport: boolean;
  protected abstract editReport: boolean;
  protected abstract registAppointment: boolean;
  protected abstract orderEntry: boolean;
  protected abstract compensationAct: boolean;
  protected abstract viewGuidelines: boolean;
  protected abstract orderView: boolean;
  protected abstract selectGoodsNot: boolean;
  protected abstract selectGoodNotForEyeVisit: boolean;
  protected abstract steap1: boolean;
  protected abstract steap2: boolean;
  protected abstract steap3: boolean;
  protected abstract isEdit: boolean;
  protected abstract btnGrouper: boolean;

  protected abstract sendEmail: boolean;
  protected abstract destinyJob: boolean;
  protected abstract verifyCompliance: boolean; //NUEVO VERIFICAR
  protected abstract btnAprove: boolean; //NUEVO VERIFICAR
  protected abstract btnDecline: boolean; //NUEVO VERIFICAR
  protected abstract dictumReturn: boolean; //NUEVO VERIFICAR BOTON NUEVO
  protected abstract btnRequestAprove: boolean; //NUEVO VERIFICAR BOTON NUEVO
  protected abstract finish: boolean; //NUEVO VERIFICAR BOTON NUEVO
  protected abstract reportValidateDictum: boolean; //NUEVO VERIFICAR BOTON NUEVO
  protected abstract dictumRegister: boolean; //NUEVO VERIFICAR BOTON NUEVO

  protected abstract legalStatus: boolean; //NUEVO VERIFICAR BOTON NUEVO
  protected abstract requestReview: boolean; //NUEVO VERIFICAR BOTON NUEVO

  protected abstract reportTable: string;
  protected abstract reportId: string;
  protected abstract formatReport: boolean;
  protected abstract signReport: boolean;

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
    } else if (affair == 27) {
      this.title = `PROCESO DE ABANDONO : Registro de Documentación Complementaria, No. Solicitud:   ${this.requestInfo.id} `;
    } else if (affair == 15) {
      this.title = `DECOMISO : Registro de Documentación Complementaria, No. Solicitud:   ${this.requestInfo.id} `;
    } else if (affair == 16) {
      this.title = `EXTINCIón DE DOMINIO : Registro de Documentación Complementaria, No. Solicitud:   ${this.requestInfo.id} `;
    }
  }

  mapTask(process: string, affair?: number, contributor: string = '') {
    this.typeVisit = 'viewGoods';
    this.reportTable = 'SOLICITUDES';

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
        } else if (affair == 15) {
          ///DECOMISO
          this.regDocForm = true;
          this.searchRequestSimGoods = true;
          this.selectGoods = true;
          this.expRequest = true;
          this.saveRequest = true;
          this.turnReq = true;
        } else if (affair == 16) {
          //EXTINCION DE DOMINIO
          this.regDocForm = true;
          this.searchRequestSimGoods = true;
          this.selectGoods = true;
          this.expRequest = true;
          this.saveRequest = true;
          this.turnReq = true;
        } else if (affair == 27) {
          ///PROCESO DE ABANDONO
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
        this.regDocView = true;
        this.verifyCompliance = true; //AGREGAR  VERIFICAR CUMPLIMIENTO DE BIENES (TAB) VALIDAR
        this.selectGoodForEyeVisit = true;

        this.expRequest = true;

        this.btnRequestAprove = true;
        this.dictumReturn = true;

        this.turnReq = false;
        this.searchAssociateFile = false;
        this.searchRequestSimGoods = false;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.DICTAMEN_DE_DEVOLUCION;
        this.signedReport = false;
        this.editReport = true;

        break;
      case 'approve-return':
        this.regDocView = true;
        this.expRequest = true;
        this.verifyCompliance = true;
        this.selectGoodForEyeVisit = true;

        this.btnAprove = true;
        this.dictumReturn = true;
        this.btnDecline = true;

        this.signedReport = true;

        this.turnReq = false;
        this.regDocForm = false;
        this.searchAssociateFile = false;
        this.searchRequestSimGoods = false;
        this.validateGoodForEyeVisit = false;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.DICTAMEN_DE_DEVOLUCION;
        this.signedReport = true;
        this.editReport = false;

        break;

      /** CASOS DE BIENES SIMILARES */
      case 'register-request-similar-goods':
        this.regDocForm = true;
        this.selectGoods = true;
        this.searchAssociateFile = true;
        this.expRequest = true;
        this.btnGrouper = true;

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

      case 'notify-transfer-similar-goods':
        this.regDocView = true;
        this.selectGoodForEyeVisit = true;
        this.expRequest = true;
        this.btnGrouper = true;
        this.notifyReport = true;
        this.saveRequest = true;
        this.turnReq = true;

        this.signedReport = true;
        this.docRequest = false;
        this.searchAssociateFile = false;
        this.viewSelectedGoods = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.validateGoodForEyeVisit = false;
        this.createReport = false;
        this.rejectReq = false;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.NOTIFICACION_EXISTENCIA_BIENES;
        this.signedReport = true;
        this.editReport = true;

        break;
      case 'eye-visit-similar-goods':
        this.regDocView = true;
        this.selectGoodForEyeVisit = true;
        this.expRequest = true;
        this.typeVisit = 'selectGood';
        this.btnGrouper = true;
        this.saveRequest = true;
        this.turnReq = true;

        this.signedReport = true;
        this.docRequest = false;
        this.searchAssociateFile = false;
        this.viewSelectedGoods = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.createReport = false;
        this.rejectReq = false;

        break;
      case 'validate-eye-visit-similar-goods':
        this.typeVisit = 'selectGood';
        this.regDocView = true;
        this.expRequest = true;
        this.validateGoodForEyeVisit = true;
        this.btnGrouper = true;
        this.resultEyeVisitReport = true;
        this.saveRequest = true;
        this.turnReq = true;

        this.signedReport = true;

        this.selectGoods = false;
        this.notifyReport = false;
        this.docRequest = false;
        this.searchAssociateFile = false;
        this.viewSelectedGoods = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.selectGoodForEyeVisit = false;
        this.createReport = false;
        this.rejectReq = false;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.ACTA_RESULTADO_VISITA_OCULAR;
        this.signedReport = true;
        this.editReport = true;

        break;

      case 'response-letter-similar-goods':
        this.typeVisit = 'resultGood';
        this.regDocView = true;
        this.expRequest = true;
        this.resultVisits = true;
        this.finish = true;
        this.btnGrouper = true;
        this.resultEyeVisitReport = true;
        this.saveRequest = true;
        this.turnReq = false;

        this.signedReport = true;

        this.validateGoodForEyeVisit = false;
        this.selectGoods = false;
        this.notifyReport = false;
        this.docRequest = false;
        this.searchAssociateFile = false;
        this.viewSelectedGoods = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.selectGoodForEyeVisit = false;
        this.createReport = false;
        this.rejectReq = false;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.RESULTADO_VISITAS_OCULARES;
        this.signedReport = true;
        this.editReport = true;

        break;

      //RESARCIMIENTO EN ESPECIE: REGISTRO DE DOCUMENTACIÓN
      case 'register-request-compensation':
        this.regDocForm = true;
        this.searchRequestSimGoods = true;
        this.selectGoods = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.turnReq = true;
        break;

      case 'review-guidelines-compensation':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.guidelines = true;
        this.expRequest = true;
        this.docRequest = true;

        this.createReport = true;
        this.saveRequest = true;
        this.turnReq = true;

        this.searchRequestSimGoods = false;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.DICTAMEN_RESARCIMIENTO;
        this.signedReport = false;
        this.editReport = true;

        break;

      case 'analysis-result-compensation':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.viewGuidelines = true;
        this.expRequest = true;

        this.createReport = true;
        this.saveRequest = true;
        this.rejectReq = true;
        this.turnReq = true;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.DICTAMEN_RESARCIMIENTO;
        this.signedReport = true;
        this.editReport = false;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.DICTAMEN_RESARCIMIENTO;
        this.signedReport = true;
        this.editReport = false;

        break;

      case 'validate-opinion-compensation':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.viewGuidelines = true;
        this.dictumValidate = true; //AGREGAR DATOS DEL DICTAMEN (TAB)
        this.expRequest = true;

        this.createReport = true;
        this.saveRequest = true;
        this.rejectReq = true;
        this.turnReq = true;

        this.signedReport = false;

        this.docRequest = true; //VERIFICAR

        this.steap1 = true;
        this.isEdit = true;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.DOCUMENTO_VALIDACION_DICTAMEN;
        this.signedReport = false;
        this.editReport = true;

        break;

      case 'notification-taxpayer-compensation':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.viewGuidelines = true;
        this.dictumRegister = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.finish = true;
        this.notifyReport = true; //VERIFICAR FUNCIÓN

        this.signedReport = true;

        this.docRequest = true;
        this.createReport = false;
        this.rejectReq = false;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.NOTIFICACION_CONTRIBUYENTE;
        this.signedReport = true;
        this.editReport = true;

        this.steap1 = true;
        this.steap2 = true;
        this.isEdit = true;

        break;

      /** CASOS DE INFORMACION DE BIENES */

      case 'register-request-information-goods':
        this.regDocForm = true;
        this.searchAssociateFile = true;
        this.selectGoods = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.turnReq = true; //AGREGAR OFICIO DESTINO (BOTON)

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

      case 'response-office-information-goods':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.turnReq = true;
        this.destinyJob = true;
        this.sendEmail = true;

        this.resultEyeVisitReport = false;
        this.docRequest = false;
        this.listGoodSelectedTitle = 'Listado de Bienes';
        this.searchRequestSimGoods = false;
        this.dictumValidate = false;
        this.createReport = false;
        this.rejectReq = false;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.OFICIO_DESTINO_BIENES;
        this.signedReport = false;
        this.editReport = true;

        break;
      case 'review-office-information-goods':
        this.regDocView = true;
        this.expRequest = true;
        this.viewSelectedGoods = true;

        this.saveRequest = true;
        this.destinyJob = true;
        this.finish = true;

        this.turnReq = false;
        this.searchAssociateFile = false;
        this.resultEyeVisitReport = false;
        this.resultVisits = false;
        this.validateGoodForEyeVisit = false;
        this.notifyReport = false;
        this.docRequest = false;
        this.searchRequestSimGoods = false;
        this.guidelines = false;
        this.dictumValidate = false;
        this.createReport = false;
        this.rejectReq = false;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.OFICIO_DESTINO_BIENES;
        this.signedReport = true;
        this.editReport = false;

        break;

      case 'confiscation':
        this.regDocForm = true;
        this.searchAssociateFile = true;
        this.selectGoods = true;
        this.expRequest = true;
        break;

      case 'extinction':
        this.regDocForm = true;
        this.searchAssociateFile = true;
        this.selectGoods = true;
        this.expRequest = true;
        break;

      case 'abandon':
        this.regDocForm = true;
        this.searchAssociateFile = true;
        this.selectGoods = true;
        this.expRequest = true;

        break;

      /* RESARCIMIENTO NUMERARIO */

      case 'register-request-economic':
        this.regDocForm = true;
        this.searchAssociateFile = true;
        this.selectGoods = true;
        this.expRequest = true;

        this.turnReq = true;
        this.saveRequest = true;

        break;

      case 'request-economic-resources':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.expRequest = true;

        this.RequestEconomicResourcesReport = true;
        this.saveRequest = true;
        this.turnReq = true;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.SOLICITUD_RECURSOS_ECONOMICOS;
        this.signedReport = true;
        this.editReport = true;
        break;

      case 'review-economic-guidelines':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.guidelines = true;
        this.expRequest = true;

        this.createReport = true;
        this.saveRequest = true;
        this.turnReq = true;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.DICTAMEN_RESARCIMIENTO;
        this.signedReport = false;
        this.editReport = true;

        break;

      case 'generate-results-economic':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.guidelines = true;
        this.expRequest = true;
        this.signedReport = true;

        this.createReport = true;
        this.saveRequest = true;
        this.rejectReq = true;
        this.turnReq = true;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.DICTAMEN_RESARCIMIENTO;
        this.signedReport = true;
        this.editReport = false;

        break;

      case 'validate-dictum-economic':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.viewGuidelines = true;
        this.dictumValidate = true;
        this.expRequest = true;

        this.reportValidateDictum = true;
        this.rejectReq = true;
        this.saveRequest = true;
        this.turnReq = true;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.DOCUMENTO_VALIDACION_DICTAMEN;
        this.signedReport = false;
        this.editReport = true;

        this.steap1 = true;
        this.steap2 = true;
        this.steap3 = false;
        this.isEdit = true;

        break;

      case 'delivery-notify-request':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.viewGuidelines = true;
        this.dictumRegister = true;
        this.expRequest = true;

        this.notifyReport = true;
        this.saveRequest = true;
        this.turnReq = true;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.NOTIFICACION_CONTRIBUYENTE;
        this.signedReport = true;
        this.editReport = true;

        this.steap1 = true;
        this.steap2 = true;
        this.steap3 = true;
        this.isEdit = false;

        break;

      case 'register-taxpayer-date':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.viewGuidelines = true;
        this.dictumRegister = true;
        this.registAppointment = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.turnReq = true;

        this.steap1 = true;
        this.steap2 = true;
        this.steap3 = true;
        this.isEdit = false;
        break;

      case 'register-pay-order':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.viewGuidelines = true;
        this.dictumRegister = true;
        this.orderEntry = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.turnReq = true;

        this.steap1 = true;
        this.steap2 = true;
        this.steap3 = false;
        this.isEdit = false;

        break;

      case 'generate-compensation-act':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.viewGuidelines = true;
        this.dictumRegister = true;
        this.orderView = true;
        this.expRequest = true;

        this.compensationAct = true;
        this.notifyReport = true;
        this.saveRequest = true;
        this.finish = true;

        //Configuracion de reporte
        this.reportId = REPORT_DOCUMENTS.ACTA_RESARCIMIENTO_ECONOMICO;
        this.signedReport = true;
        this.editReport = true;

        this.steap1 = true;
        this.steap2 = true;
        this.steap3 = false;
        this.isEdit = false;
        break;

      /*AMPARO*/
      case 'register-request-protection':
        this.regDocForm = true;
        this.searchAssociateFile = true;
        this.selectGoods = true;
        this.selectGoodsNot = true;

        this.expRequest = true;

        this.saveRequest = true;
        this.turnReq = true;

        break;
      case 'protection-regulation':
        this.regDocView = true;
        this.selectGoodForEyeVisit = true;
        this.selectGoodNotForEyeVisit = true;
        this.expRequest = true;

        this.legalStatus = true;
        this.saveRequest = true;
        this.requestReview = true;
        //Configuracion de reporte VALIDAR FUNCIONAMIENTO
        //this.reportId = REPORT_DOCUMENTS.SITUACION_JURIDICA_AMPARO;
        //this.signedReport = false;
        //this.editReport = true;

        break;
      case 'review-result-protection':
        this.regDocView = true;
        this.viewSelectedGoods = true;
        this.expRequest = true;

        this.rejectReq = true;
        this.saveRequest = true;
        this.btnAprove = true;
        //Configuracion de reporte VALIDAR FUNCIONAMIENTO
        //this.reportId = REPORT_DOCUMENTS.SITUACION_JURIDICA_AMPARO;
        //this.signedReport = false;
        //this.editReport = true;

        break;

      case 'register-compensation-documentation':
        this.regDocForm = true;
        this.searchAssociateFile = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.finish = true;

        break;

      //NUEVO

      case 'register-seizures':
        this.regDocForm = true;
        this.searchAssociateFile = true;
        this.selectGoods = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.finish = true;
        break;

      case 'register-abandonment-goods':
        this.regDocForm = true;
        this.searchAssociateFile = true;
        this.selectGoods = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.finish = true;
        break;

      case 'register-domain-extinction':
        this.regDocForm = true;
        this.searchAssociateFile = true;
        this.selectGoods = true;
        this.expRequest = true;

        this.saveRequest = true;
        this.finish = true;
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
}
