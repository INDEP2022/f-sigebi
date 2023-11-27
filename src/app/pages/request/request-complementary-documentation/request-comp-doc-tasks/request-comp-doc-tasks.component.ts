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
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { RequestHelperService } from '../../request-helper-services/request-helper.service';
import { CreateReportComponent } from '../../shared-request/create-report/create-report.component';
import { MailFieldModalComponent } from '../../shared-request/mail-field-modal/mail-field-modal.component';
import { RejectRequestModalComponent } from '../../shared-request/reject-request-modal/reject-request-modal.component';
import { CompDocTasksComponent } from './comp-doc-task.component';
import { de } from 'date-fns/locale';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import Swal from 'sweetalert2';
import { ITask } from 'src/app/core/models/ms-task/task-model';

@Component({
  selector: 'app-request-comp-doc-tasks',
  templateUrl: './request-comp-doc-tasks.component.html',
  styles: [],
})
export class RequestCompDocTasksComponent
  extends CompDocTasksComponent
  implements OnInit {
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
  screenWidth: number;
  public typeDoc: string = '';
  public updateInfo: boolean = false;
  typeModule: string = '';
  displayExpedient: boolean = false;
  complementaryDoc: boolean = false;
  typeVisit: string = '';
  affair: number = null;
  taskId: number = 0;

  /**
   * email del usuairo
   */
  emailForm: FormGroup = new FormGroup({});

  loadingTurn = false

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
        console.log(this.process, this.affair);
        this.mapTask(this.process, resp.data[0].affair);
        this.titleView(resp.data[0].affair, this.process);
        this.getAffair(resp.data[0].affair);
        this.closeSearchRequestSimGoodsTab(resp.data[0].recordId);
      },
    });
    this.contributor = 'CARLOS G. PALMA';
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

  openReport(context?: Partial<CreateReportComponent>): void {
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

  turnRequest() {
    this.alertQuestion(
      'question',
      `¿Desea turnar la solicitud con Folio ${this.requestId}?`,
      '',
      'Turnar'
    ).then(async question => {
      if (question.isConfirmed) {

        console.log(this.affair, this.process);

        if (this.process == 'similar-good-register-documentation') {
          this.onLoadToast('success', 'Solicitud turnada con éxito', '');
        } else if (this.process == 'register-request') {

          let val = this.affair.toString();
          switch (val) {
            case "10": //GESTIONAR DEVOLUCIÓN RESARCIMIENTO
              this.generateTask(this.affair);
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

  rejectRequest(): void {
    const modalRef = this.modalService.show(RejectRequestModalComponent, {
      initialState: {
        title: 'Confirmar Rechazo',
        message: '¿Está seguro que desea rechazar el análisis?',
        requestId: this.requestId,
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onReject.subscribe((data: boolean) => {
      if (data) {
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
      '¿Desea finalizar la tarea registro de documentación complementaria?'
    ).then(question => {
      if (question) {
        //Cerrar tarea//
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

  getValuesForTurn(affair): any {

    let title = '';
    let url = '';
    let process = '';
    switch (affair) {

      case "10": //GESTIONAR DEVOLUCIÓN RESARCIMIENTO
        title =
          'DEVOLUCIÓN: Verificar Cumplimiento, No. Solicitud ' + this.requestId + ', Contribuyente, PAMA';
        url = 'pages/request/request-comp-doc/tasks/register-request';
        process = 'DVerificarCumplimiento';
        return { title: title, urlNb: url, processName: process };

      case "33": //GESTIONAR BINES SIMILARES RESARCIMIENTO
        title =
          'BIENES SIMILARES Notificacion a transferente,No. Solicitud:';
        url = 'pages/request/request-comp-doc/tasks/register-request';
        process = 'BSRegistroSolicitudes';
        return { title: title, urlNb: url, processName: process };

      case "40": //RESARCIMIENTO EN ESPECIE: REGISTRO DE DOCUMENTACIÓN
        title =
          'Revisión de Lineamientos Resarcimiento (EN ESPECIE), No. Solicitud ' + this.requestId + ', Contribuyente, PAMA:';
        url = 'pages/request/request-comp-doc/tasks/register-request';
        process = 'RERegistroSolicitudes';
        return { title: title, urlNb: url, processName: process };

      case "41": //INFORMACIÓN DE BIENES: REGISTRO DE DOCUMENTACIÓN COMPLEMENTARIA
        title =
          'Generar Solicitud de Información y Oficio de Respuesta, No. Solicitud' + this.requestId;
        url = 'pages/request/request-comp-doc/tasks/register-request';
        process = 'IBRegistroSolicitudes';
        return { title: title, urlNb: url, processName: process };

      default:
        break;
    }
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
  async generateTask(affair) {

    const { title, urlNb, processName, finish, type, subtype, ssubtype
    } = this.nextProcess(affair, this.process);

    this.loadingTurn = true;
    const _task = JSON.parse(localStorage.getItem('Task'));
    await this.closeTask();

    const createTask = await this.generateFirstTask(processName);
    if (createTask) {

      //Estableciendo valores a transferente, emisora y autoridad
      let idTransferente = this.requestInfo.transferenceId;
      let idEmisora = this.requestInfo.stationId;
      let idAuthoridad = this.requestInfo.authorityId;
      let nickName = '';
      let userName = '';

      /** VALIDAR DATOS */
      //const requestResult: any = await this.updateTurnedRequest(this.requestInfo);
      if (true) {
        const actualUser: any = this.authService.decodeToken();
        let body: any = {};
        body['idTask'] = this.taskId;
        body['userProcess'] = actualUser.username;

        /** VALIDAR DATOS */
        body['type'] = type;
        body['subtype'] = subtype;
        body['ssubtype'] = ssubtype;

        let task: any = {};
        task['id'] = _task.id;
        task['assignees'] = nickName;
        task['assigneesDisplayname'] = userName;
        task['reviewers'] = actualUser.username;
        task['creator'] = actualUser.username;
        task['taskNumber'] = Number(this.requestId);
        task['title'] = title;
        task['programmingId'] = 0;
        task['requestId'] = this.requestId;
        task['expedientId'] = 0;
        task['urlNb'] = urlNb;
        task['processName'] = processName;
        task['idstation'] = idEmisora;
        task['idTransferee'] = idTransferente;
        task['idAuthority'] = idAuthoridad;
        task['idDelegationRegional'] = actualUser.department;
        body['task'] = task;

        let orderservice: any = {};
        orderservice['pActualStatus'] = 'REGISTRO_SOLICITUD';
        orderservice['pNewStatus'] = 'REGISTRO_SOLICITUD';
        orderservice['pIdApplication'] = this.requestId;
        orderservice['pCurrentDate'] = new Date().toISOString();
        orderservice['pOrderServiceIn'] = '';

        body['orderservice'] = orderservice;

        const taskResult = await this.createTaskOrderService(body);
        if (taskResult) {
          this.loadingTurn = false;
          this.msgModal(
            'Se turnó la solicitud con el Folio Nº'
              .concat(`<strong>${this.requestId}</strong>`),
            'Solicitud Creada',
            'success'
          );
          this.router.navigate(['/pages/siab-web/sami/consult-tasks']);
        }
      }
    }
  }

  /** VALIDAR */
  async generateFirstTask(processName) {

    //POR_TURNAR

    return new Promise(async (resolve, reject) => {
      this.loadingTurn = true;

      this.requestId = this.requestId;
      const user: any = this.authService.decodeToken();
      let task: any = {};
      task['id'] = 0;
      task['assignees'] = user.username;
      task['assigneesDisplayname'] = user.username;
      task['creator'] = user.username;
      task['taskNumber'] = Number(this.requestId);
      task['title'] = 'Verificar Cumplimiento con folio: ' + this.requestId;
      task['programmingId'] = 0;
      task['requestId'] = this.requestId;
      task['expedientId'] = 0;
      task['processName'] = processName;
      task['idDelegationRegional'] = user.department;
      task['urlNb'] = 'pages/request/request-comp-doc/create';
      const taskResult: any = await this.createOnlyTask(task);
      if (taskResult) {

        this.taskId = Number(taskResult.data[0].id);

        this.loadingTurn = false;
      }
      resolve(true);

    });
  }

  /** VALIDAR */
  createOnlyTask(task: any) {
    return new Promise((resolve, reject) => {
      this.taskService.createTask(task).subscribe({
        next: resp => {
          if (resp.length == 0) {
            this.onLoadToast(
              'error',
              'Error al crear tarea',
              'El servicio de crear tareas no esta funcionando por el momento'
            );
            reject(false);
          } else {
            resolve(resp);
          }
        },
        error: error => {
          this.onLoadToast(
            'error',
            'Error al crear tarea',
            'El servicio de crear tareas no esta funcionando por el momento'
          );
          reject(false);
        },
      });
    });
  }

  /** VALIDAR */
  updateTurnedRequest(form: any) {
    return new Promise((resolve, reject) => {
      form.requestStatus = 'A_TURNAR';
      form.receiptRoute = 'FISICA';
      form.affair = form.affair;
      form.typeOfTransfer = 'MANUAL';
      //form.regionalDelegationId = this.delegationId;
      //form.originInfo = 'SOL_TRANSFERENCIA'
      //let date = this.requestForm.controls['applicationDate'].value;
      //form.applicationDate = date.toISOString();

      this.requestService.update(form.id, form).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          this.loadingTurn = false;
          this.msgModal('error', 'Error', 'Error al guardar la solicitud');
          reject(error.error);
        },
      });
    });
  }

  /** VALIDAR */
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

  closeTask() {
    return new Promise((resolve, reject) => {
      const task = JSON.parse(localStorage.getItem('Task'));
      const taskForm: ITask = {
        State: 'FINALIZADA',
      };
      this.taskService.update(task.id, taskForm).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => { },
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

}
