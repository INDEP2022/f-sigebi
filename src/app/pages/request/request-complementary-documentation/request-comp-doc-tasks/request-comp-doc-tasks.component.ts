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
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ITask } from 'src/app/core/models/ms-task/task-model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import Swal from 'sweetalert2';
import { SendRequestEmailComponent } from '../../destination-information-request/send-request-email/send-request-email.component';
import { RequestHelperService } from '../../request-helper-services/request-helper.service';
import { CreateReportComponent } from '../../shared-request/create-report/create-report.component';
import { MailFieldModalComponent } from '../../shared-request/mail-field-modal/mail-field-modal.component';
import { RejectRequestModalComponent } from '../../shared-request/reject-request-modal/reject-request-modal.component';
import { getConfigAffair } from './catalog-affair';
import { CompDocTasksComponent } from './comp-doc-task.component';

@Component({
  selector: 'app-request-comp-doc-tasks',
  templateUrl: './request-comp-doc-tasks.component.html',
  styles: [],
})
export class RequestCompDocTasksComponent
  extends CompDocTasksComponent
  implements OnInit {
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
  requestInfo: IRequest;
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
    dictudDataReg: false, //DATOS DEL DICTAMENT REGISTRAR
    registerAppointment: false, //REGISTRAR CITA
    orderEntry: false, //ORDEN DE INGRESO
  };

  /* INJECTIONS
  ============== */
  private requestService = inject(RequestService);
  private requestHelperService = inject(RequestHelperService);
  private affairService = inject(AffairService);
  private bsModalRef = inject(BsModalRef);
  private authService = inject(AuthService);
  private taskService = inject(TaskService);

  //private rejectedService = inject(RejectedGoodService)

  /*  */

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    super();
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
    this.updateInfo = true;
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

  openReport(): void {
    const initialState: Partial<CreateReportComponent> = {
      signed: this.signedReport,
      process: this.process,
      requestId: this.requestId.toString(),
    };

    const modalRef = this.modalService.show(CreateReportComponent, {
      initialState: initialState,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.refresh.subscribe(next => {
      if (next) {
        // Perform actions if necessary, e.g., this.getCities();
      }
    });
  }

  turnRequest() {
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
      if (data) {
        console.log(data);
        this.taskRechazar(data);
      }
    });
  }

  expedientEventTrigger() {
    this.requestHelperService.currentExpedient.subscribe({
      next: resp => {
        if (resp == true) {
          const requestId = Number(this.route.snapshot.paramMap.get('request'));
          this.staticTabs.tabs[0].active = true;
          this.getRequestInfo(requestId);
        }
      },
    });
  }

  closeSearchRequestSimGoodsTab(recordId: number) {
    console.log(recordId);
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
      if (question) {
        //Cerrar tarea//
        let response = await this.updateTask(this.taskInfo.id);
        if (response) {
          this.msgModal(
            'Se finalizo la solicitud con el Folio Nº '.concat(
              `<strong>${this.requestId}</strong>`
            ),
            'Solicitud finalizada',
            'success'
          );
          this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
        }
      }
    });
  }

  getAffair(id: string | number) {
    this.affairService.getByIdAndOrigin(id, 'SAMI').subscribe({
      next: data => {
        this.processDetonate = data.processDetonate;
        console.log(this.processDetonate);
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
    debugger;
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

  updateRequest() {
    this.updateInfo = true;

    this.msgModal(
      'Se guardó la solicitud con el Folio Nº '.concat(
        `<strong>${this.requestId}</strong>`
      ),
      'Solicitud Guardada',
      'success'
    );
  }

  /** VALIDAR */
  async generateTask() {
    if (!this.validateTurn()) return;

    /** VERIFICAR VALIDACIONES PARA REALIZAR LA TAREA*/
    this.loadingTurn = true;
    const { title, url, type, subtype, ssubtype, process, close } =
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
      task['taskDefinitionId'] = this.taskInfo.id;
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
        'Se turno la solicitud con el Folio Nº '.concat(
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

    this.updateTask(this.taskInfo.taskDefinitionId, 'PROCESO');

    this.requestInfo.rejectionComment = data.comment;

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
      };
      this.taskService.update(id, taskForm).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => { },
      });
    });
  }

  validateTurn() {
    switch (this.process) {
      //GESTIONAR DEVOLUCIÓN RESARCIMIENTO
      case 'register-request-return':
        if (!this.validate.regdoc) {
          this.showError('Registre la información de la solicitud');
          return false;
        }

        if (!this.validate.goods) {
          this.showError('Seleccione los bienes de la solicitud');
          return false;
        }

        if (!this.requestInfo.recordId) {
          this.showError('Asocie el expediente de la solicitud');
          return false;
        }

        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }

        break;
      case 'verify-compliance-return':
        if (!this.validate.vercom) {
          this.showError('Verifique el cumplimiento de los artículos');
          return false;
        }

        if (!this.validate.opinion) {
          //this.showError('Genere el Dictamen de Devolución');
          //return false;
        }

        break;
      case 'approve-return':
        let getEstimatedRowCount = 0;
        let contenido = '';
        let docNameUcm = '';

        if (getEstimatedRowCount == 0 || isNullOrEmpty(contenido)) {
          //this.showError('Es necesario generar el Dictamen de Devolución');
          //return false;
        }

        if (isNullOrEmpty(docNameUcm)) {
          //this.showError('Es necesario firmar el Dictamen de Devolución');
          //return false;
        }

        break;

      //GESTIONAR BINES SIMILARES RESARCIMIENTO
      case 'register-request-similar-goods':
        if (!this.validate.regdoc) {
          this.showError('Registre la información de la solicitud');
          return false;
        }

        if (!this.requestInfo.recordId) {
          this.showError('Asocie el expediente de la solicitud');
          return false;
        }

        if (!this.validate.goods) {
          this.showError('Seleccione los bienes de la solicitud');
          return false;
        }

        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }

        break;

      case 'notify-transfer-similar-goods':
        if (!this.validate.signedNotify) {
          //this.showError('Firme el reporte de notificación');
          //return false;
        }

        break;

      case 'eye-visit-similar-goods':
        break;

      case 'validate-eye-visit-similar-goods':
        //Validar aprobacion de visita ocular

        break;

      case 'validate-opinion-similar-goods':
        if (!this.validate.signedVisit) {
          //this.showError('Firme el reporte de visita ocular');
          //return false;
        }

        break;

      //RESARCIMIENTO EN ESPECIE: REGISTRO DE DOCUMENTACIÓN
      case 'register-request-compensation':
        if (!this.validate.regdoc) {
          this.showError('Registre la información de la solicitud');
          return false;
        }

        if (!this.requestInfo.recordId) {
          //this.showError('Asocie solicitud de bienes');
          //return false;
        }

        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }

        break;

      case 'review-guidelines-compensation':
        if (!this.validate.guidelines) {
          //this.showError('Verifique las observaciones de lineamientos');
          //return false;
        }

        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }

        if (!this.validate.genDictum) {
          //this.showError('Genera el dictamen de resarcimiento');
          //return false;
        }

        break;

      case 'analysis-result-compensation':
        if (!this.validate.guidelines) {
          this.showError('Verifique las observaciones de lineamientos');
          return false;
        }

        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }

        if (!this.validate.signedDictum) {
          this.showError('Firme el dictamen de resarcimiento');
          return false;
        }
        break;

      case 'validate-opinion-compensation':
        if (!this.validate.goods) {
          this.showError('Seleccione los bienes de la solicitud');
          return false;
        }

        if (!this.validate.guidelines) {
          this.showError('Verifique las observaciones de lineamientos');
          return false;
        }

        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }

        if (!this.validate.genValDictum) {
          this.showError('Genera la validación del dictamen de resarcimiento');
          return false;
        }

        break;

      case 'notification-taxpayer-compensation':
        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }

        if (!this.validate.signedValDictum) {
          this.showError('Firme la validación del dictamen de resarcimiento');
          return false;
        }

        break;

      //CASOS INFORMACION DE BIENES
      case 'register-request-compensation':
        if (!this.validate.regdoc) {
          this.showError('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showError('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.goods) {
          this.showError('Seleccione los bienes de la solicitud');
          return false;
        }
        break;

      case 'review-guidelines-compensation':
        if (!this.validate.sendEmail) {
          this.showError('Enviar el correo de notificación al contribuyente');
          return false;
        }
        if (!this.validate.genOffice) {
          this.showError('Generar el oficio destino');
          return false;
        }
        break;

      case 'analysis-result-compensation':
        if (!this.validate.signedOffice) {
          this.showError('Firmar el oficio destino');
          return false;
        }
        break;

      /*NUMERARIO*/

      case 'register-request-economic-compensation':
        if (!this.validate.regdoc) {
          this.showError('Registre la información de la solicitud');
          return false;
        }
        if (!this.requestInfo.recordId) {
          this.showError('Asocie el expediente de la solicitud');
          return false;
        }
        if (!this.validate.goods) {
          this.showError('Seleccione los bienes de la solicitud');
          return false;
        }
        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }

        break;
      case 'request-economic-resources':
        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }
        /*if (!this.validate.genEconomicResources) {
          this.showError('Generar la solicitud de recursos económicos');
          return false;
        }*/

        break;
      case 'review-economic-guidelines':
        if (!this.validate.guidelines) {
          //this.showError('Verifique las observaciones de lineamientos');
          //return false;
        }
        if (!this.validate.genDictum) {
          //this.showError('Generar el dictamen de resarcimiento');
          //return false;
        }
        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }

        break;
      case 'generate-results-economic-compensation':
        if (!this.validate.signedDictum) {
          //this.showError('Firme el dictamen de resarcimiento');
          //return false;
        }
        if (!this.validate.guidelines) {
          //this.showError('Verifique las observaciones de lineamientos');
          //return false;
        }
        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }
        break;
      case 'validate-dictum-economic':
        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }
        if (!this.validate.dictudData) {
          //this.showError('Registre datos del dictamen');
          //return false;
        }
        if (!this.validate.genValDictum) {
          //this.showError('Genera la validación del dictamen de resarcimiento');
          //return false;
        }
        break;
      case 'delivery-notify-request':
        if (!this.validate.dictudData) {
          //this.showError('Registre datos del dictamen');
          //return false;
        }
        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }
        if (!this.validate.signedNotify) {
          //this.showError('Firme el reporte de notificación');
          //return false;
        }
        break;
      case 'register-taxpayer-date':
        if (!this.validate.registerAppointment) {
          //this.showError('Registre datos de la cita');
          //return false;
        }
        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }
        break;
      case 'register-pay-orde':
        if (!this.validate.orderEntry) {
          //this.showError('Registre datos de orden de pago');
          //return false;
        }
        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }
        break;
      case 'generate-compensation-act':
        if (!this.validate.files) {
          this.showError('Suba la documentación de la solicitud');
          return false;
        }
        if (!this.validate.genDictum) {
          //this.showError('Genera el dictamen de resarcimiento');
          //return false;
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
    console.log(event);
    this.validate.files = event.isValid;
    //Agreagar validaciones en especifico
  }

  onVerifyCom(event) {
    console.log(event);
    this.validate.vercom = event.isValid;
    //Agreagar validaciones en especifico
  }

  showError(text) {
    this.onLoadToast('error', 'Error', text);
  }

  onSaveGuidelines(row) {
    console.log(row);
    this.validate.guidelines = true;
  }

  btnRequestAprobar() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea solicitar la aprobación de la solicitud con folio: ' +
      this.requestId
    ).then(question => {
      if (question.isConfirmed) {
        //Cerrar tarea//
        this.generateTask();
      }
    });
  }

  btnRequestReview() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea solicitar la revisión de la solicitud con folio: ' +
      this.requestId
    ).then(question => {
      if (question.isConfirmed) {
        //Cerrar tarea//
        this.generateTask();
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
    });

    //Finalizar la orden de servicio
    //Turnamos la solicitud
  }

  createDictumReturn() { }
}

export function isNullOrEmpty(value: any): boolean {
  return value === null || value === undefined || (value + '').trim() === '';
}
