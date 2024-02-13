import { Location } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
//Components
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ITask } from 'src/app/core/models/ms-task/task-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { ReportgoodService } from 'src/app/core/services/ms-reportgood/reportgood.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import Swal from 'sweetalert2';
import { DELEGATION_COLUMNS_REPORT } from '../../../../../app/pages/siab-web/commercialization/report-unsold-goods/report-unsold-goods/columns';
import { SendRequestEmailComponent } from '../../destination-information-request/send-request-email/send-request-email.component';
import { ChangeLegalStatusComponent } from '../../economic-compensation/change-legal-status/change-legal-status.component';
import { AnnexJAssetsClassificationComponent } from '../../generate-sampling-supervision/assets-classification/annex-j-assets-classification/annex-j-assets-classification.component';
import { ShowReportComponentComponent } from '../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { UploadReportReceiptComponent } from '../../programming-request-components/execute-reception/upload-report-receipt/upload-report-receipt.component';
import { RequestHelperService } from '../../request-helper-services/request-helper.service';
import { CreateReportComponent } from '../../shared-request/create-report/create-report.component';
import { MailFieldModalComponent } from '../../shared-request/mail-field-modal/mail-field-modal.component';
import { RejectRequestModalComponent } from '../../shared-request/reject-request-modal/reject-request-modal.component';
import { getConfigAffair } from './catalog-affair';
import { CompDocTasksComponent } from './comp-doc-task.component';
import * as moment from 'moment';

@Component({
  selector: 'app-request-comp-doc-tasks',
  templateUrl: './request-comp-doc-tasks.component.html',
  styles: [],
})
export class RequestCompDocTasksComponent
  extends CompDocTasksComponent
  implements OnInit {
  protected override btnGrouper: boolean;
  protected override formatReport: boolean;
  protected override signReport: boolean;
  protected override selectGoodNotForEyeVisit: boolean;
  protected override selectGoodsNot: boolean;
  protected override editReport: boolean;
  protected override reportTable: string;
  protected override reportId: string;
  protected override finish: boolean;
  protected override btnRequestAprove: boolean;
  protected override sendEmail: boolean;
  protected override destinyJob: boolean;
  protected override verifyCompliance: boolean;
  protected override btnAprove: boolean;
  protected override btnDecline: boolean;
  protected override dictumReturn: boolean;
  protected override searchAssociateFile: boolean;
  /* CALL TABS DINAMICALY */
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  /**
   * SET STATUS OF TABS
   **/
  regDocForm: boolean = false;
  regDocView: boolean = false;
  searchRequestSimGoods: boolean = false;
  selectGoods: boolean = false;
  guidelines: boolean = false;
  docRequest: boolean = false;
  expRequest: boolean = false;
  viewSelectedGoods: boolean = false;
  dictumValidate: boolean = false;
  notifyReport: boolean = false;
  selectGoodForEyeVisit: boolean = false;
  validateGoodForEyeVisit: boolean = false;
  resultEyeVisitReport: boolean = false;
  makeResultPaperReport: boolean = false;
  resultVisits: boolean = false;
  RequestEconomicResourcesReport: boolean = false;
  listGoodSelectedTitle: string = 'Listado de Bienes';
  reportValidateDictum: boolean = false;
  registAppointment: boolean = false;
  orderEntry: boolean = false;
  compensationAct: boolean = false;
  legalStatus: boolean = false;
  requestReview: boolean = false;
  viewGuidelines: boolean = false;
  dictumRegister: boolean = false;
  orderView: boolean = false;
  visible: boolean = false;
  steap1: boolean = false;
  steap2: boolean = false;
  steap3: boolean = false;
  isEdit: boolean = false;
  dictumInfo: boolean = false;

  readonly: boolean = true;

  /**
   * SET STATUS ACTIONS
   **/
  saveRequest: boolean = false;
  turnReq: boolean = false;
  createReport: boolean = false;
  rejectReq: boolean = false;

  requestId: number = null;
  contributor: string = '';
  processDetonate: string = '';
  process: string = '';
  title: string;
  requestInfo: any;
  taskInfo: any;
  screenWidth: number;
  public typeDoc: string = '';
  public updateInfo: boolean = false;
  typeModule: string = '';
  displayExpedient: boolean = false;
  complementaryDoc: boolean = false;
  typeVisit: string = '';
  affair: number = null;
  taskId: number = 0;

  signedReport: boolean = false;

  //test
  isDelegationsVisible: boolean = true;
  settingsTwo: any;
  dataThree: LocalDataSource = new LocalDataSource();
  dataCheckDelegation: any[] = [];
  paramsDelegation = new BehaviorSubject(new ListParams());
  totalItemsDelegation: number = 0;

  delegation: Object = null;

  dataPay: Object = null;

  /**
   * email del usuairo
   */
  emailForm: FormGroup = new FormGroup({});

  loadingTurn = false;
  nextTurn = true;
  validate = {
    //reportes firmar
    signedNotify: false, //FIRMA DE REPORTE DE NOTIFICACION
    signedVisit: false, //FIRMA DE REPORTE DE VISITA OCULAR
    signedDictum: false, //FIRMA DE DICTAMEN RESARCIMIENTO
    signedValDictum: false, //FIRMA DE VALIDACION DICTAMEN RESARCIMIENTO
    signedOffice: false, //FIRMA DE OFICIO DESTINO
    //reportes generar
    genDictum: false, //GENERAR DICTAMEN RESARCIMIENTO
    genOffice: false, //GENERAR OFFICIO DESTINO
    genEconomicResources: false, //GENERAR RECURSOS ECONOMICOS
    genValDictum: false, //GENERAR VALIDACION DICTAMEN
    opinion: false, //DICTAMEN DE DEVOLUCION

    //button
    sendEmail: false, //NOTIFICACION AL CONTRIBUYENTE

    //tabs
    regdoc: false, //REGISTRAR DOCUMENTACIÓN
    goods: false, //SELECCIONAR BIENES
    files: false, //EXPEDIENTE
    guidelines: false, //LINEAMINEOTS
    valvisits: false, //VALIDAR VISITA OCULAR
    vercom: false, //VERIFICAR CUMPLIMIENTO
    dictudData: false, //DATOS DEL DICTAMEN
    registerAppointment: false, //REGISTRAR CITA
    orderEntry: false, //ORDEN DE INGRESO
    programVisit: false, //ORDEN DE INGRESO
    legalStatus: false, //CAMBIO DE ESTATUS LEGAL
  };

  /* INJECTIONS
  ============== */
  private requestService = inject(RequestService);
  private requestHelperService = inject(RequestHelperService);
  private affairService = inject(AffairService);
  private bsModalRef = inject(BsModalRef);
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private wContentService = inject(WContentService);
  private sanitizer = inject(DomSanitizer);

  //private rejectedService = inject(RejectedGoodService)

  /*  */

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private reportgoodService: ReportgoodService,
    private fb: FormBuilder
  ) {
    super();
    this.settingsTwo = {
      ...this.settings,
      selectMode: 'multi',
      actions: false,
      columns: { ...DELEGATION_COLUMNS_REPORT },
    };
    this.screenWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
  }

  ngOnInit(): void {
    this.requestId = Number(this.route.snapshot.paramMap.get('request'));
    this.process = this.route.snapshot.paramMap.get('process');
    if (this.requestId) {
      this.getRequestInfo(this.requestId);
    }
    this.expedientEventTrigger();
    this.emailForm = this.fb.group({
      emailUser: [null],
    });

    this.expedientSelected(true);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    let screenWidth = window.innerWidth;
    this.screenWidth = screenWidth;
  }

  getRequestInfo(requestId: number) {
    const param = new FilterParams();
    param.addFilter('id', requestId);
    const filter = param.getParams();

    this.requestService.getAll(filter).subscribe({
      next: resp => {
        this.requestInfo = resp.data[0];
        this.affair = resp.data[0].affair;
        //this.requestId = resp.data[0].id;
        this.mapTask(this.process, resp.data[0].affair);
        this.titleView(resp.data[0].affair, this.process);
        this.getAffair(resp.data[0].affair);
        this.closeSearchRequestSimGoodsTab(resp.data[0].recordId);

        this.requestService.getById(requestId).subscribe({
          next: resp => {
            this.requestInfo.detail = resp;
          },
        });
      },
    });

    this.getTaskInfo();
  }

  getTaskInfo() {
    const _task = JSON.parse(localStorage.getItem('Task'));

    const param = new FilterParams();
    param.addFilter('id', _task.id);
    const filter = param.getParams();
    this.taskService.getAll(filter).subscribe({
      next: resp => {
        this.taskInfo = resp.data[0];
        this.title = this.taskInfo.title;
        //this.nextTurn = this.taskInfo.State.toUpperCase() != 'FINALIZADA';

        if (this.taskInfo.requestId != this.requestId) {
          this.router.navigateByUrl(
            this.taskInfo.urlNb + '/' + this.taskInfo.requestId
          );
        }
      },
    });
  }

  expedientSelected(event: any) {
    if (event == true) {
      this.displayExpedient = true;
      this.requestSelected(1);
    }
  }
  requestSelected(type: number) {
    this.typeDocumentMethod(type);
    this.updateInfo = !this.updateInfo;
    this.typeModule = 'doc-complementary';
  }

  typeDocumentMethod(type: number) {
    switch (type) {
      case 1:
        this.typeDoc = 'doc-request';
        break;
      case 2:
        this.typeDoc = 'doc-expedient';
        break;
      case 3:
        this.typeDoc = 'request-expedient';
        break;
      default:
        break;
    }
  }

  close() {
    this.location.back();
  }

  requestRegistered(request: any) { }

  async openReport(): Promise<void> {
    if (!this.nextTurn) {
      let report = await this.getStatusReport();
      this.showReport(report);
      return;
    }

    const initialState: Partial<CreateReportComponent> = {
      signReport: this.signedReport && this.nextTurn,
      editReport: this.editReport && this.nextTurn,
      tableName: this.reportTable,
      documentTypeId: this.reportId,
      process: this.process,
      requestId: this.requestId.toString(),
    };

    const modalRef = this.modalService.show(CreateReportComponent, {
      initialState: initialState,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.show.subscribe(response => {
      if (response) {
        this.showReport(response);
      }
    });

    modalRef.content.sign.subscribe(response => {
      if (response) {
        this.openSignature(response);
      }
    });

    modalRef.content.refresh.subscribe(response => {
      if (response.upload) {
        //this.requestInfo.detail.reportSheet = 'Y';
        //this.updateRequest(false);
      } else if (response.sign) {
        //this.requestInfo.detail.reportSheet = 'YY';
        //this.updateRequest(false);
      }
    });
  }

  async turnRequest() {
    if (this.process == 'register-taxpayer-date') {
      let result = await this.openDelegation();
      if (!result) return;
    }
    this.alertQuestion(
      'question',
      `¿Desea turnar la solicitud con Folio ${this.requestId}?`,
      '',
      'Turnar'
    ).then(async question => {
      if (question.isConfirmed) {
        this.generateTask();

        if (true) return;

        switch (this.process) {
          case 'register-request-return':
          case 'verify-compliance-return':
          case 'approve-return':
            return;
        }

        if (this.process == 'similar-good-register-documentation') {
          this.onLoadToast('success', 'Solicitud turnada con éxito', '');
        } else if (this.process == 'register-request') {
          let val = this.affair.toString();
          switch (val) {
            case '10': //GESTIONAR DEVOLUCIÓN RESARCIMIENTO
              this.generateTask();
              break;
            default:
              this.setEmailNotificationTask();
              break;
          }
        } else if (this.process == 'BSNotificarTransferente') {
          this.setEmailNotificationTask();
        } else if (this.process == 'BSVisitaOcular') {
          const turn = await this.turnEyeVisitor();
          if (turn == true) {
            this.turnResquestMessage(this.requestId);
          }
        } else if (this.process == 'BSValidarVisitaOcular') {
          const haveRerpot = await this.validateNotifyReport();
          if (haveRerpot == true) {
            this.turnResquestMessage(this.requestId);
          }
        } else if (this.process == 'BSElaborarOficioRespuesta') {
          alert('falta');
        } else {
          this.onLoadToast('success', 'Solicitud turnada con éxito', '');
        }
      }
    });
  }

  rejectRequest() {
    const modalRef = this.modalService.show(RejectRequestModalComponent, {
      initialState: {
        title: 'Confirmar Rechazo',
        message:
          'El resultado de la verificación y análisis documental será rechazado.',
        requestId: this.requestId,
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onReject.subscribe((data: boolean) => {
      this.taskRechazar(data);
    });
  }

  expedientEventTrigger() {
    this.requestHelperService.currentExpedient.subscribe({
      next: resp => {
        if (resp == true) {
          const requestId = Number(this.route.snapshot.paramMap.get('request'));
          if (!isNullOrEmpty(this.staticTabs.tabs)) {
            this.staticTabs.tabs[0].active = true;
          }
          this.getRequestInfo(requestId);
        }
      },
    });
  }

  closeSearchRequestSimGoodsTab(recordId: number) {
    if (recordId) {
      this.searchRequestSimGoods = false;
    }
  }

  endRequest() {
    this.alertQuestion(
      'question',
      'Confirmación',
      `¿Desea finalizar la solicitud con folio: ${this.requestId}`
    ).then(async question => {
      if (question.isConfirmed) {
        //Cerrar tarea//

        if (await this.validateTurn()) {
          let response = await this.updateTask(this.taskInfo.id);
          if (response) {
            this.msgModal(
              'se finalizó la solicitud con el Folio Nº '.concat(
                `<strong>${this.requestId}</strong>`
              ),
              'Solicitud finalizada',
              'success'
            );
            this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
          }
        }
      }
    });
  }

  getAffair(id: string | number) {
    this.affairService.getByIdAndOrigin(id, 'SAMI').subscribe({
      next: data => {
        this.processDetonate = data.processDetonate;
      },
      error: error => {
        console.log('no se encontraron datos en asuntos ', error);
      },
    });
  }

  openNotifyReport(context?: Partial<CreateReportComponent>) {
    const modalRef = this.modalService.show(CreateReportComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
      } //this.getCities();
    });
  }

  /* METODO PARA TURNAR REGISTRO DE DOCUMENTACION */
  //seleccionBienesBean.java muestraConfirmacion()
  turnRegistrationTask() {
    if (this.processDetonate == 'RES_ESPECIE') {
      //obtener los bienesinventarios que tengan el campo naturalidad == INVENTARIOS
      const email = this.emailForm.controls['emailUser'].value;
      const haveInventaryGood = true;
      if (haveInventaryGood != true) {
        if (email != null) {
          this.onLoadToast(
            'info',
            'Es necesario ingresar al menos un correo electrónico'
          );
        } else {
          //popupTurnar
        }
      } else {
        //popupTurnar
      }
    } else if (
      this.processDetonate == 'RES_NUMERARIO' ||
      this.processDetonate == 'RES_PAGO_ESPECIE'
    ) {
      //popupTurnar
    } else if (this.processDetonate == 'DEVOLUCION') {
      //popupTurnar
    } else {
      //popupTurnar
    }
  }
  /* FIN */

  /* METODO QUE ITERA LOS BIENES PARA TURNAR VISITA PROGRAMACION OCULAR */
  async turnEyeVisitor() {
    return new Promise(async (resolve, reject) => {
      console.log('verificando vienes oculares');
      let end = true;
      let _page: number = 1;
      let _limit: number = 100;
      let countLimit: number = 100;
      let params = new ListParams();
      params['filter.applicationId'] = `$eq:${this.requestId}`; //56817
      params.limit = _limit;
      let turnRequest: boolean = true;
      do {
        params.page = _page;
        const GRDResult: any = await this.getGoodResDev(params);
        const error: any = await this.verifyEyesVisit(GRDResult.data);
        if (error > 0 || GRDResult.count == 0) {
          end = false;
          turnRequest = false;
          this.onLoadToast(
            'error',
            'Es necesario establecer fechas/horas inicio y fin de la visita ocular'
          );
        }
        if (GRDResult.count >= countLimit) {
          _page = _page + 1;
          countLimit = countLimit + 100;
        } else {
          end = false;
        }
      } while (end);

      resolve(turnRequest);
    });
  }

  /* METODO QUE VERIFICA SI LOS BIENES EN PROGRAMACION OCULAR CUMPLEN */
  verifyEyesVisit(data: any) {
    return new Promise((resolve, reject) => {
      let count = 0;
      data.map((item: any) => {
        if (item.codeStore != null) {
          if (
            item.resultFinal != 'Y' ||
            item.startVisitDate == null ||
            item.endVisitDate == null
          ) {
            count++;
          }
        }
      });
      resolve(count);
    });
  }

  reportResultEyeVisit(context?: Partial<CreateReportComponent>): void {
    const modalRef = this.modalService.show(CreateReportComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
      } //this.getCities();
    });
  }

  async turnNotificationTask(email: string) {
    const params = new ListParams();
    params['filter.applicationId'] = `$eq:56817`; //`$eq:${this.requestId}`;
    //
    const goodResDevResult: any = await this.getGoodResDev(params);
    if (goodResDevResult.count == 0) {
      this.onLoadToast('error', 'No se han seleccionado bienes del Inventario');
    } else {
      //this.turnResquestMessage(this.requestId,email);
      const containGoodInv = await this.loopNotificationTask();
      //if(containGoodInv == true){
      if ((email != null || email != '') && containGoodInv == false) {
        this.turnResquestMessage(this.requestId, email);
      } else {
        this.onLoadToast(
          'error',
          'Es necesario ingresar al menos un correo electrónico'
        );
      }
      //}
    }
  }

  /* METODOS PARA VALIDAR EL TURNADO EN NOTIFICAR TRANSFERENTE */
  async loopNotificationTask() {
    return new Promise(async (resolve, reject) => {
      let end = true;
      let _page: number = 1;
      let _limit: number = 100;
      let countLimit: number = 100;
      let params = new ListParams();
      params['filter.applicationId'] = `$eq:56817`; //`$eq:${this.requestId}`; //56817
      params.limit = _limit;
      let containGoodInv: boolean = false;
      do {
        params.page = _page;
        const GRDResult: any = await this.getGoodResDev(params);
        const contain: any = await this.containInvGood(GRDResult.data);
        if (contain > 0) {
          end = false;
          containGoodInv = true;
        }
        if (GRDResult.count >= countLimit) {
          _page = _page + 1;
          countLimit = countLimit + 100;
        } else {
          end = false;
        }
      } while (end);
      resolve(containGoodInv);
    });
  }

  containInvGood(data: any) {
    return new Promise((resolve, reject) => {
      let count = 0;
      data.map((item: any) => {
        if (item.naturalness == 'INVENTARIOS') {
          count++;
        }
      });
      resolve(count);
    });
  }

  setEmailNotificationTask() {
    let config: ModalOptions = {
      initialState: {},
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.bsModalRef = this.modalService.show(MailFieldModalComponent, config);
    this.bsModalRef.content.event.subscribe((value: any) => {
      if (this.process == 'BSNotificarTransferente') {
        this.turnNotificationTask(value.email);
      }
    });
  }
  /* FIN METODO PARA TURNAR NOTIFICACIONES */

  /* METODO PARA VALIDAR VISITA OCULAR */
  validateNotifyReport() {
    return new Promise((resolve, reject) => {
      //si cuenta con reporte de notificacion devuelve true
      resolve(true);
    });
  }

  //Partial<CreateReportComponent>
  openRequestResourcesReport(context?: any) {
    const modalRef = this.modalService.show(CreateReportComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
      } //this.getCities();
    });
  }

  updateRequest(alert = true) {
    this.updateInfo = true;
    let request: any = { ...this.requestInfo.detail };

    this.requestService.update(this.requestId, request).subscribe({
      next: resp => {
        if (alert) {
          this.alert('success', 'Correcto', 'Registro Actualizado');
        }
      },
      error: error => {
        if (alert) {
          this.alert('error', 'Error', 'Error al guardar la solicitud');
        }
      },
    });
  }

  /** VALIDAR */
  async generateTask() {
    if (!(await this.validateTurn())) return;

    /** VERIFICAR VALIDACIONES PARA REALIZAR LA TAREA*/
    this.loadingTurn = true;
    const { title, url, type, subtype, ssubtype, process, close, rollBack } =
      getConfigAffair(
        this.requestId,
        this.affair,
        this.process,
        this.requestInfo
      );

    const user: any = this.authService.decodeToken();

    let body: any = {};

    body['userProcess'] = user.username;
    body['type'] = type;
    body['subtype'] = subtype;
    body['ssubtype'] = ssubtype;

    let task: any = {};

    if (close) {
      body['idTask'] = this.taskInfo.id;
    }

    if (rollBack) {
      task['taskDefinitionId'] = this.taskInfo.id;

      if (!isNullOrEmpty(this.taskInfo.taskDefinitionId)) {
        task['taskDefinitionName'] = this.taskInfo.taskDefinitionId;
      }
    } else {
      task['taskDefinitionId'] = this.taskInfo.taskDefinitionId;
    }

    task['id'] = 0;
    task['assignees'] = this.taskInfo.assignees;
    task['assigneesDisplayname'] = this.taskInfo.assigneesDisplayname;
    task['reviewers'] = user.username;
    task['creator'] = user.username;
    task['taskNumber'] = Number(this.requestId);
    task['title'] = title;
    task['programmingId'] = 0;
    task['requestId'] = this.requestId;
    task['expedientId'] = 0;
    task['urlNb'] = url;
    task['processName'] = process;
    task['idstation'] = this.taskInfo.idstation;
    task['idTransferee'] = this.taskInfo.idTransferee;
    task['idAuthority'] = this.taskInfo.idAuthority;
    task['idDelegationRegional'] = user.department;

    if (!isNullOrEmpty(this.delegation)) {
      task['satZoneCoordinator'] = this['addressOffice'];
    } else {
      task['satZoneCoordinator'] = '';
    }

    body['task'] = task;

    let orderservice: any = {};
    orderservice['pActualStatus'] = 'REGISTRO_SOLICITUD';
    orderservice['pNewStatus'] = 'REGISTRO_SOLICITUD';
    orderservice['pIdApplication'] = this.requestId;
    orderservice['pCurrentDate'] = new Date().toISOString();
    orderservice['pOrderServiceIn'] = '';

    body['orderservice'] = orderservice;

    const closeTask: any = await this.createTaskOrderService(body);

    if (closeTask && !isNullOrEmpty(closeTask.task)) {
      this.msgModal(
        'Se turnó la solicitud con el Folio Nº '.concat(
          `<strong>${this.requestId}</strong>`
        ),
        'Solicitud turnada',
        'success'
      );
      this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
    } else {
      this.msgModal(
        'No se pudo turnar la solicitud con el Folio Nº '.concat(
          `<strong>${this.requestId}</strong>`
        ),
        'Error',
        'error'
      );
    }
  }

  createTaskOrderService(body: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTaskWitOrderService(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          this.loadingTurn = false;
          this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
          reject(false);
        },
      });
    });
  }

  /** VALIDAR */
  msgModal(message: string, title: string, typeMsg: any) {
    Swal.fire({
      title: title,
      html: message,
      icon: typeMsg,
      showCancelButton: false,
      confirmButtonColor: '#9D2449',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        this.loadingTurn = false;
      }
    });
  }

  openSendEmail(): void {
    const modalRef = this.modalService.show(SendRequestEmailComponent, {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onSend.subscribe(next => {
      if (next) {
        console.log(next);
      }
    });
  }

  taskRechazar(data) {
    const _task = JSON.parse(localStorage.getItem('Task'));
    const user: any = this.authService.decodeToken();
    let body: any = {};

    body['idTask'] = _task.id;
    body['userProcess'] = user.username;
    body['type'] = 'DOCUMENTACION_COMPLEMENTARIA';
    body['subtype'] = 'Registro_documentacion';
    body['ssubtype'] = 'REJECT';

    if (!isNullOrEmpty(this.taskInfo.taskDefinitionName)) {
      this.updateTask(this.taskInfo.taskDefinitionName, 'PROCESO');
    } else if (!isNullOrEmpty(this.taskInfo.taskDefinitionId)) {
      this.updateTask(this.taskInfo.taskDefinitionId, 'PROCESO');
    }

    this.requestInfo.detail.rejectionComment = data.comment;
    this.updateRequest(false);

    this.taskService.createTaskWitOrderService(body).subscribe({
      next: async resp => {
        this.msgModal(
          'Se rechazo la solicitud con el Folio Nº '.concat(
            `<strong>${this.requestId}</strong>`
          ),
          'Solicitud rechazada',
          'success'
        );
        this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
        //VALIDAR NAVEGACION
      },
      error: error => {
        this.onLoadToast('error', 'Error', 'No se pudo rechazar la tarea');
      },
    });
  }

  updateTask(id, state = 'FINALIZADA') {
    return new Promise((resolve, reject) => {
      const taskForm: ITask = {
        State: state,
        taskDefinitionId: null,
        endDate: new Date(),
      };
      this.taskService.update(id, taskForm).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => { },
      });
    });
  }

  async validateTurn() {
    let reportLoad: any = {
      isValid: false,
      isSign: false,
    };

    switch (this.process) {
      //GESTIONAR DEVOLUCIÓN RESARCIMIENTO
      case 'register-request-return':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }

        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }

        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }

        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        break;
      case 'verify-compliance-return':
        if (!this.validate.vercom) {
          this.showWarning('Verifique el cumplimiento de los artículos');
          return false;
        }

        reportLoad = await this.getStatusReport();
        if (!reportLoad.isValid) {
          this.showWarning('Genere el Dictamen de Devolución');
          return false;
        }

        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        break;
      case 'approve-return':
        reportLoad = await this.getStatusReport();

        if (!reportLoad.isSigned) {
          this.showWarning('Firme el dictamen de resarcimiento');
          return false;
        }

        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        break;

      //GESTIONAR BINES SIMILARES RESARCIMIENTO
      case 'register-request-similar-goods':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }

        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }

        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }

        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        break;

      case 'notify-transfer-similar-goods':
        reportLoad = await this.getStatusReport();

        if (!reportLoad.isValid) {
          this.showWarning('Genere el reporte de notificación');
          return false;
        }

        if (!reportLoad.isSigned) {
          this.showWarning('Firme el reporte de notificación 3');
          return false;
        }

        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        break;

      case 'eye-visit-similar-goods':
        //INTEGRAR EXPEDIENTE
        //PROGRAMAR FECHAS

        if (!this.validate.programVisit) {
          this.showWarning(
            'Capture el periodo de los bienes para la visita ocular'
          );
          return false;
        }

        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        break;

      case 'validate-eye-visit-similar-goods':
        if (!this.validate.programVisit) {
          this.showWarning('Validar Resultado de visitas');
          return false;
        }

        reportLoad = await this.getStatusReport();
        if (!reportLoad.isValid) {
          this.showWarning(
            'Generar el reporte de resultado de la visita ocular'
          );
          return false;
        }

        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        //REGISTRO
        //VALIDAR RESULTADOS
        //INTEGRAR EXPEDIENTE
        //REPORTE RESULTADO VISITA OCULAR FIRMAR
        break;

      case 'validate-opinion-similar-goods':
        if (!this.validate.signedVisit) {
          this.showWarning('Firme el reporte de visita ocular');
          return false;
        }

        //REGISTRO
        //INTEGRAR EXPEDIENTE
        //REPORTE DE RESULTAOD FIRMAR
        break;

      //RESARCIMIENTO EN ESPECIE: REGISTRO DE DOCUMENTACIÓN
      case 'register-request-compensation':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }

        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie solicitud de bienes');
          return false;
        }

        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }

        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        break;

      case 'review-guidelines-compensation':
        if (!this.validate.guidelines) {
          this.showWarning('Verifique las observaciones de lineamientos');
          return false;
        }

        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        reportLoad = await this.getStatusReport();
        if (!reportLoad.isValid) {
          this.showWarning('Genera el dictamen de resarcimiento');
          return false;
        }

        break;

      case 'analysis-result-compensation':
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        reportLoad = await this.getStatusReport();
        if (!reportLoad.isSigned) {
          this.showWarning('Firme el dictamen de resarcimiento');
          return false;
        }
        break;

      case 'validate-opinion-compensation':
        reportLoad = await this.getStatusReport();
        if (!reportLoad.isValid) {
          this.showWarning(
            'Genera la validación del dictamen de resarcimiento'
          );
          return false;
        }

        break;

      case 'notification-taxpayer-compensation':
        //DATOS DEL DICTAMEN

        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        reportLoad = await this.getStatusReport();
        if (!reportLoad.isValid) {
          this.showWarning('Genere el reporte de notificación');
          return false;
        }

        if (!reportLoad.isSigned) {
          this.showWarning('Firme el reporte de notificación');
          return false;
        }

        break;

      //CASOS INFORMACION DE BIENES
      case 'register-request-information-goods':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;

      case 'response-office-information-goods':
        /*if (!this.validate.sendEmail) {
          this.showWarning('Enviar el correo de notificación al contribuyente');
          return false;
        }*/

        reportLoad = await this.getStatusReport();
        if (!reportLoad.isValid) {
          this.showWarning('Generar el oficio destino');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;

      case 'review-office-information-goods':
        reportLoad = await this.getStatusReport();
        if (!reportLoad.isSigned) {
          this.showWarning('Firmar el oficio destino');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;

      /*NUMERARIO*/

      case 'register-request-economic':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        break;
      case 'request-economic-resources':
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        reportLoad = await this.getStatusReport();
        if (!reportLoad.isValid) {
          this.showWarning('Generar la solicitud de recursos económicos');
          return false;
        }

        break;
      case 'review-economic-guidelines':
        if (!this.validate.guidelines) {
          this.showWarning('Verifique las observaciones de lineamientos');
          return false;
        }

        reportLoad = await this.getStatusReport();
        if (!reportLoad.isValid) {
          this.showWarning('Generar el dictamen de resarcimiento');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        break;
      case 'generate-results-economic':
        reportLoad = await this.getStatusReport();
        if (!reportLoad.isSigned) {
          this.showWarning('Firme el dictamen de resarcimiento');
          return false;
        }
        if (!this.validate.guidelines) {
          this.showWarning('Verifique las observaciones de lineamientos');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;
      case 'validate-dictum-economic':
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        if (!this.validate.dictudData) {
          this.showWarning('Registre datos del dictamen');
          return false;
        }

        reportLoad = await this.getStatusReport();
        if (!reportLoad.isValid) {
          this.showWarning(
            'Genera la validación del dictamen de resarcimiento'
          );
          return false;
        }

        break;
      case 'delivery-notify-request':
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        reportLoad = await this.getStatusReport();
        if (!reportLoad.isValid) {
          this.showWarning('Genera el reporte de notificación');
          return false;
        }

        if (!reportLoad.isSigned) {
          this.showWarning('Firme el reporte de notificación');
          return false;
        }
        break;
      case 'register-taxpayer-date':
        if (!this.validate.registerAppointment) {
          this.showWarning('Registre datos de la cita');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;
      case 'register-pay-order':
        if (!this.validate.orderEntry) {
          this.showWarning('Registre datos de orden de ingreso');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;
      case 'generate-compensation-act':
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        reportLoad = await this.getStatusReport();
        if (!reportLoad.isValid) {
          this.showWarning('Genera el acta de resarcimiento');
          return false;
        }

        reportLoad = await this.getStatusReport(1);
        if (!reportLoad.isValid) {
          this.showWarning('Genera el reporte de notificación');
          return false;
        }

        if (!reportLoad.isSigned) {
          this.showWarning('Firme el reporte de notificación');
          return false;
        }

        break;

      case 'register-domain-extinction':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;
      case 'register-seizures':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;
      case 'register-abandonment-goods':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;
      case 'register-protections-goods':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;

      case 'register-compensation-documentation':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;

      case 'register-request-protection':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;

      case 'protection-regulation':
        //reportLoad = await this.getStatusReport();
        if (this.requestInfo.detail.reportSheet != 'OCSJ') {
          this.showWarning('Genera el reporte de oficio jurídico');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;

      case 'register-compensation-documentation':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/
        break;

      case 'review-result-protection':
        if (!reportLoad.isSigned) {
          //this.showWarning('Firme el reporte de oficio jurídico');
          //return false;
        }
        /* if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }*/

        break;
      case 'register-seizures':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }
        if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }
        break;
      case 'register-abandonment-goods':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }
        if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }
        break;
      case 'register-protections-goods':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.goods) {
          this.showWarning('Seleccione los bienes de la solicitud');
          return false;
        }
        if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }
        break;

      case 'register-compensation-documentation':
        if (!this.validate.regdoc) {
          this.showWarning('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showWarning('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.files) {
          this.showWarning('Suba la documentación de la solicitud');
          return false;
        }
        break;
    }

    return true;
  }

  onChangeRegDoc(event) {
    this.validate.regdoc = event.isValid;
    //Agreagar validaciones en especifico
  }

  onSelectGoods(event) {
    this.validate.goods = event.isValid;
    //Agreagar validaciones en especifico
  }

  onSelectFiles(event) {
    this.validate.files = event.isValid;
    //Agreagar validaciones en especifico
  }

  onVerifyCom(event) {
    this.validate.vercom = event.atLeastOne; // event.isValid;
    //Agreagar validaciones en especifico
  }

  showError(text) {
    this.onLoadToast('error', 'Error', text);
  }

  showWarning(text) {
    this.onLoadToast('warning', 'Advertencia', text);
  }

  onGuidelines(event) {
    this.validate.guidelines = event.isValid;
    //Agreagar validaciones en especifico
  }

  onDictumData(event) {
    this.validate.dictudData = event.isValid;
    //Agreagar validaciones en especifico
  }

  onAppoiment(event) {
    this.validate.registerAppointment = event.isValid;
  }

  onSetData(event) { }

  onOrder(event) {
    this.validate.orderEntry = event.isValid;
  }

  onProgramVisit(event) {
    this.validate.programVisit = event.isValid;
    //Agreagar validaciones en especifico
  }

  handleDataPay(data: Object) {
    this.dataPay = data;
  }

  btnRequestAprobar() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea solicitar la aprobación de la solicitud con folio: ' +
      this.requestId
    ).then(async question => {
      if (question.isConfirmed) {
        //Cerrar tarea//
        if (await this.validateTurn()) {
          this.generateTask();
        }
      }
    });
  }

  btnRequestReview() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea solicitar la revisión de la solicitud con folio: ' +
      this.requestId
    ).then(async question => {
      if (question.isConfirmed) {
        //Cerrar tarea//
        if (await this.validateTurn()) {
          this.generateTask();
        }
      }
    });
  }

  btnAprobar() {
    this.alertQuestion(
      'question',
      'Confirmar Aprobación',
      `¿Desea APROBAR la solicitud con folio: ${this.requestId}?`
    ).then(async question => {
      if (question.isConfirmed) {
        //Cerrar tarea//
        if (await this.validateTurn()) {
          let response = await this.updateTask(this.taskInfo.id);

          if (response) {
            this.msgModal(
              'Se aprobo la solicitud con el Folio Nº '.concat(
                `<strong>${this.requestId}</strong>`
              ),
              'Solicitud aprobada',
              'success'
            );
            this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
          }
        }
      }
    });

    //Finalizar la orden de servicio
    //Turnamos la solicitud
  }

  openDelegation(context?: Partial<ChangeLegalStatusComponent>) {
    return new Promise<boolean>(resolve => {
      const modalRef = this.modalService.show(ChangeLegalStatusComponent, {
        initialState: {
          ...context,
          isDelegationsVisible: true,
          isJuridicVisible: false,
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      });

      modalRef.content.refresh.subscribe(res => {
        resolve(res);
      });
      modalRef.content.delegtion.subscribe(result => {
        this.delegation = result;
      });
    });
  }

  openModalLegal(context?: Partial<ChangeLegalStatusComponent>) {
    if (this.requestInfo.detail.reportSheet == 'OCSJ') {
      this.openSignature(0);
      return;
    }

    const modalRef = this.modalService.show(ChangeLegalStatusComponent, {
      initialState: {
        ...context,
        isDelegationsVisible: false,
        isJuridicVisible: true,
        requestId: this.requestId,
        docTypeId: this.reportId,
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.requestInfo.detail.reportSheet = 'OCSJ';
        this.updateRequest(false);
      }
    });
  }

  createDictumReturn() { }

  async showReport(data) {
    let report = await this.getStatusReport();
    report = report.isValid ? report.data[0] : report;

    if (isNullOrEmpty(report.ucmDocumentName)) {
      this.wContentService
        .downloadDinamycReport(
          'sae.rptdesign',
          this.reportTable,
          this.requestId.toString(),
          data.documentTypeId
        )
        .subscribe({
          next: response => {
            //let blob = this.dataURItoBlob(response);
            let file = new Blob([response], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            this.openPrevPdf(fileURL);
          },
          error: error => {
            this.showError('Vista previa no dipoonible');
          },
        });
    } else {
      this.wContentService.obtainFile(report.ucmDocumentName).subscribe({
        next: response => {
          let blob = this.dataURItoBlob(response);
          let file = new Blob([blob], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          this.openPrevPdf(fileURL);
        },
        error: error => { },
      });
    }
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'application/pdf' });
    return blob;
  }

  openPrevPdf(pdfurl: string) {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  getStatusReport(position = 0) {
    let params = new ListParams();

    let ids = this.reportId.split(',');
    params['filter.documentTypeId'] = `$eq:${ids[position]}`;
    params['filter.tableName'] = `$eq:${this.reportTable}`;
    params['filter.registryId'] = `$eq:${this.requestId}`;

    return new Promise<any>(resolve => {
      this.reportgoodService.getReportDynamic(params).subscribe({
        next: async resp => {
          if (resp.data.length > 0) {
            resolve({
              data: resp.data,
              isValid: resp.data.length > 0,
              isSigned: true//resp.data[0].signedReport == 'Y',
            });
          } else {
            resolve({
              isValid: false,
              isSigned: false,
            });
          }
        },
        error: err => {
          resolve({
            isValid: false,
            isSigned: false,
          });
        },
      });
    });
  }

  //Validar firmantes de reportes
  //En parametro validationocsp
  getStatusFirmantes() {

    console.log('getStatusFirmantes');

    //Servicio http://sigebimsqa.indep.gob.mx/electronicfirm/api/v1/signatories

    //validationocsp ? firmarReporte : na
  }

  openSignature(object) {
    this.openModal(
      AnnexJAssetsClassificationComponent,
      object.reportFolio,
      'sign-annexJ-assets-classification'
    );
  }

  openModal(component: any, idSample?: any, typeAnnex?: string): void {
    if (!this.signReport) {
      let config: ModalOptions = {
        initialState: {
          requestId: this.requestId,
          reportId: this.reportId,
          reportTable: this.reportTable,
          idSample: idSample,
          typeAnnex: typeAnnex,
          callback: async (typeDocument: number, typeSign: string) => {
            if (typeAnnex == 'sign-annexJ-assets-classification') {
              if (typeDocument && typeSign) {
                this.showReportInfo(idSample, typeDocument, typeSign, typeAnnex);
              }
            }
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(component, config);
    } else {
      this.showReportInfo(0, 0, '', '');
    }
  }

  showReportInfo(id: number, typeDocument: number, typeSign: string, typeAnnex: string) {
    const idTypeDoc = typeDocument;
    const idSample = id;
    const orderSampleId = id;
    const requestId = this.requestId;
    const typeFirm = typeSign;
    const tableName = this.reportTable; //this.tableName;
    const reportName = 'sae.rptdesign'; //this.tableName;
    const dynamic = true;
    const signed = !this.signReport; //!this.isSigned;

    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        idTypeDoc,
        idSample,
        orderSampleId,
        typeFirm,
        typeAnnex,
        dynamic,
        tableName,
        reportName,
        signed,
        requestId,
        callback: data => {
          if (typeFirm != 'electronica') {
            if (data) {
              this.uploadDocument(idSample, typeDocument);
            }
          } else if (typeFirm == 'electronica') {
            this.getStatusFirmantes();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReportComponentComponent, config);
  }

  uploadDocument(id, typeDocument) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      typeDoc: typeDocument,
      idSample: id,
      callback: async data => {
        if (data) {
          //this.getInfoSample();
          //reporte dinamico marcar como firmado
          this.firmarReporte();
        }
      },
    };

    this.modalService.show(UploadReportReceiptComponent, config);
  }

  //Reportes dinamicos
  //Firma de reportes

  async firmarReporte() {

    const user: any = this.authService.decodeToken();
    let report = await this.getStatusReport();
    report = report.data[0];
    report.signedReport = 'Y';
    report.modificationUser = user.username;
    report.modificationDate = moment(new Date()).format('YYYY-MM-DD');
    this.reportgoodService.saveReportDynamic(report).subscribe({
      next: resp => { },
      error: err => { },
    });

  }

}



export function isNullOrEmpty(value: any): boolean {
  return value === null || value === undefined || (value + '').trim() === '';
}
