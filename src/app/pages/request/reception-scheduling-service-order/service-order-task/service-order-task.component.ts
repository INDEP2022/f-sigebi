import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { catchError, of } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { FilterParams, ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { IOrderServiceDTO } from 'src/app/core/models/ms-order-service/order-service.mode';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ShowReportComponentComponent } from '../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { ConfirmProgrammingComponent } from '../../shared-request/confirm-programming/confirm-programming.component';
import { AnnexWFormComponent } from '../components/annex-w-form/annex-w-form.component';
import { RejectionCommentFormComponent } from '../components/rejection-comment-form/rejection-comment-form.component';
import { RejectionJustifyFormComponent } from '../components/rejection-justify-form/rejection-justify-form.component';
import { OrderSignatureModalComponent } from '../components/service-order-signature-modal/order-signature-modal.component';
import { getConfigService } from './service-order-task-case';
import { isNullOrEmpty } from '../../request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';
import { TaskService } from 'src/app/core/services/ms-task/task.service';
import { TypeSignatureModalComponent } from '../components/type-signature-modal/type-signature-modal..component';

@Component({
  selector: 'app-service-order-task',
  templateUrl: './service-order-task.component.html',
  styles: [
    `
      a.text-color:hover,
      a.text-color:active {
        color: #9d2449;
        cursor: pointer;
      }
    `,
  ],
})
export class ServiceOrderTaskComponent
  extends BasePage
  implements OnInit {
  claimRequest: boolean = false;
  form: FormGroup = new FormGroup({});
  ordServform: FormGroup = new FormGroup({});
  parentModal: BsModalRef;
  op: number = null;
  showForm: boolean = false;
  orderServiceId: number = null;
  lsProgramming: string = null;
  programmingId: number = null;
  process: string = null;
  programming: any = null;
  isUpdate: boolean = false;

  total: string = null;
  task: any = null;
  isApprove: boolean = false;
  title: string = '';
  typeOrder: string = 'reception';
  justificationRefused: boolean = false;
  readonly: boolean = true;
  typeTable: string = '';
  taskInfo: any = {};

  //private programmingService = inject(ProgrammingRequestService);
  //private router = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private orderEntryService = inject(orderentryService);
  private authService = inject(AuthService);
  private activeRouter = inject(ActivatedRoute);
  private modalService = inject(BsModalService);
  private programmingService = inject(ProgrammingRequestService);
  private orderService = inject(OrderServiceService);
  private signatoriesService = inject(SignatoriesService);
  private taskService = inject(TaskService);

  constructor(private router: Router) {
    super();
    this.configureProcess();
  }

  async ngOnInit(): Promise<void> {

    this.taskInfo = await this.getTask();
    this.title = this.taskInfo.title;

    this.prepareForm();
    this.getProgramming();
    this.getOrderService();

    //Crear tarea inicial
    //this.generateTask("service-order-request");
  }

  prepareForm() {

    this.form = this.fb.group({
      location: [
        { value: null, disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      address: [
        { value: null, disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
    });

    this.ordServform = this.fb.group({
      serviceOrderFolio: [null, [Validators.pattern(STRING_PATTERN)]],
      folioReportImplementation: [null, [Validators.pattern(STRING_PATTERN)]],
      shiftDate: [null, [Validators.pattern(STRING_PATTERN)]],
      shiftUser: [null, [Validators.pattern(STRING_PATTERN)]],
      contractNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      transportationZone: [null, [Validators.pattern(STRING_PATTERN)]],
      folioTlp: [null, [Validators.pattern(STRING_PATTERN)]],
      eyeVisit: [null, [Validators.pattern(STRING_PATTERN)]],
      reasonsNotPerform: [null, [Validators.pattern(STRING_PATTERN)]],
      userContainers: [null, [Validators.pattern(STRING_PATTERN)]],
      //
      transferLocation: [
        { value: null, disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      transferAddress: [
        { value: null, disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      //
      sourceStore: [
        { value: null, disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      originStreet: [
        { value: null, disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      originPostalCode: [
        { value: null, disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      colonyOrigin: [
        { value: null, disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      //
      notes: [{ value: null, disabled: true }, [Validators.pattern(STRING_PATTERN)]],
      observation: [{ value: null, disabled: true }, [Validators.pattern(STRING_PATTERN)]],
      justification: [null, [Validators.pattern(STRING_PATTERN)]],
      justificationReport: [null, [Validators.pattern(STRING_PATTERN)]],
      commentRejection: [{ value: null, disabled: true }, [Validators.pattern(STRING_PATTERN)]],
      programmingId: [null],
      id: [null],
    });

    this.form.disable();
    this.ordServform.disable();

  }

  async sendOrderService() {
    const orderServProvi: any = await this.getOrderServiceProvided();
    if (orderServProvi.count == 0) {
      this.onLoadToast(
        'info',
        'Es necesario agregar servicios a la programación'
      );
      return;
    }

    this.alertQuestion(
      'warning',
      'Confirmación',
      `¿Desea enviar la orden de servicio con folio ${this.programming.folio}?`
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.createTask();
      }
    });
  }

  processSendOrderService() {
    const user = this.authService.decodeToken();
    let totalServ = ''; // TotalServTrans
    totalServ = totalServ + 0; //TotalServResg
    const status = this.lsProgramming;

    let lsUsuariosTLP = null;

    if (status == 'ReporteImplementacion') {
      const body = {
        endTmpDate: new Date(),
      };
      //actualizar
    } else if (status == 'Rechazado') {
      this.lsProgramming = 'AprobarContrapropuesta';
      const body = {
        //tiOrdServicio: this.orderServiceId,
        rejectionJustInd: 'Y', //tsIndRechazo
      };
      //actualizar orden servicio
    } else if (status == 'ReporteImplementacion') {
      this.lsProgramming = 'AprobacionReporte';
      lsUsuariosTLP = user.username;
    } else if (status == 'RechazoReporte') {
      this.lsProgramming = 'AprobarContraReporte';
      const body = {
        //tiOrdServicio: this.orderServiceId,
        rejectionJustInd: 'AMBOS', //tsIndRechazo
      };
      //actualizar orden servicio
    } else {
      this.lsProgramming = 'ReporteImplementacion';
    }

    const lsTituloInstancia = this.ordServform.get('serviceOrderFolio').value;
  }

  saveService() {
    const folio = this.ordServform.controls['serviceOrderFolio'].value;
    this.alertQuestion(
      'warning',
      'Confirmación',
      `¿Desea guardar la orden de servicio con folio ${folio}?`
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio

        let ordServiceForm = this.ordServform.getRawValue();
        this.isUpdate = true;
        this.updateOrderService(ordServiceForm);
        setTimeout(() => {
          this.isUpdate = false;
        }, 1000);
      }
    });
  }

  setClaimRequest() {
    this.btnReclamar = false;

    switch (this.process) {
      case 'service-order-capture':
        this.form.enable();
        this.ordServform.enable();
        break;
    }


  }

  setRelease() {
    this.btnReclamar = true;

    this.form.disable();
    this.ordServform.disable();

  }

  getOrderService() {
    const params = new ListParams();
    params['filter.programmingId'] = `$eq:${this.programmingId}`;
    this.orderService
      .getAllOrderService(params)
      .pipe(
        catchError((e: any) => {
          if (e.status == 400) return of({ data: [], count: 0 });
          throw e;
        })
      )
      .subscribe({
        next: (resp: any) => {
          // setTimeout(() => {
          this.ordServform.patchValue(resp.data[0]);
          this.orderServiceId = resp.data[0].id;
          // }, 100);
        },
      });
  }

  getOrderServiceProvided() {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      //
      params['filter.orderServiceId'] = `$eq:${this.orderServiceId}`;
      this.orderEntryService
        .getAllOrderServicesProvided(params)
        .pipe(
          catchError((e: any) => {
            if (e.status == 400) return of({ data: [], count: 0 });
            throw e;
          })
        )
        .subscribe({
          next: resp => {
            resolve(resp);
          },
        });
    });
  }

  updateOrderService(body: IOrderServiceDTO) {
    this.orderService.updateOrderService(body).subscribe({
      next: resp => {
        this.onLoadToast(
          'success',
          'La orden de servicio se guardada correctamente',
          ''
        );
      },
      error: () => {
        this.onLoadToast('error', 'No se pudo actualizar la orden de servicio');
      },
    });
  }

  generateOrdSerReport() {

    this.configuraModalFirma();
    return;

    const config = MODAL_CONFIG;
    config.initialState = {
      idProgramming: this.programmingId,
      type: this.op, //
      callback: (signatore: any) => {
        //ISignatories
        if (signatore.data) {
          //typeDoc = null
          this.openReport(signatore.data, signatore.sign);
        }
      },
    };

    this.modalService.show(ConfirmProgrammingComponent, config);
  }

  async openReport(signatore: ISignatories, typeSign: string) {
    //task == 8 ||task == 10 ||task == 13 ||task == 11
    let idTypeDoc = null; //221;
    if (this.task == 2) {
      idTypeDoc = this.orderServiceId;
    } else if (this.task == 3) {
    } else if (this.task == 5) {
    } else if (this.task == 6) {
    }
    const idProg = this.programming.id;
    //verificar si se guarda los firmantes
    const sign = await this.assignSign(signatore, idTypeDoc);
    let config: ModalOptions = {
      initialState: {
        idOrderService: this.orderServiceId,
        idTypeDoc,
        //signatore,
        typeFirm: typeSign,
        programming: this.programming,
        idProg: idProg,
        orderServiceTask: this.task,
        callback: (next: boolean) => {
          if (next) {
            this.isApprove = true;
            //this.getProgrammingId();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ShowReportComponentComponent, config);
  }

  getProgramming() {
    this.programmingService.getProgrammingId(this.programmingId).subscribe({
      next: resp => {
        this.programming = resp;
      },
    });
  }

  annexWReport() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean) => {
          if (next) {
            //this.getProgrammingId();
            this.isApprove = true;
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AnnexWFormComponent, config);
  }

  getTotal(event: string) {
    this.total = event;
  }

  rejectOrder() {
    const folio = this.ordServform.get('serviceOrderFolio').value;
    let config: ModalOptions = {
      initialState: {
        folio: folio,
        callback: (next: boolean) => {
          if (next) {
            //this.getProgrammingId();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    //RejectionJustifyFormComponent
    this.modalService.show(RejectionCommentFormComponent, config);
  }

  approve() {
    const folio = this.ordServform.get('serviceOrderFolio').value;
    this.alertQuestion(
      'question',
      `¿Deseas aprobar la orden de servicio con folio: ${folio}?`,
      ''
    ).then(question => {
      if (question.isConfirmed) {
        this.onLoadToast('success', 'Solicitud Aprovada', 'falta la logica');
      }
    });
  }

  sendJustification() {
    const folio = this.ordServform.get('serviceOrderFolio').value;
    let config: ModalOptions = {
      initialState: {
        folio: folio,
        op: this.op,
        callback: (next: boolean) => {
          if (next) {
            //this.getProgrammingId();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RejectionJustifyFormComponent, config);
  }

  refuseJustification() {
    this.justificationRefused = true;
  }

  assignSign(signatore: any, typedoc: any = '') {
    return new Promise((resolve, reject) => {
      const signForm = {
        learnedType: typedoc,
        learnedId: this.programmingId,
        name: signatore.nameSignatore,
        post: signatore.chargeSignatore,
      };
      this.signatoriesService.create(signForm).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject(error);
          this.onLoadToast('error', 'No se pudo guardar a los firmantes');
        },
      });
    });
  }

  async openFirma(name, charge) {

    let token = this.authService.decodeToken();
    let today = new Date();

    let idTypeDoc = "0";
    let readOnly = false;

    const typeAnnex = 'approval-request';
    const requestInfo = { id: this.programmingId, type: 'programming' };
    const idReportAclara = this.programmingId;
    const nameTypeDoc = 'OrdenServicio';
    const nomenglatura = '';

    const nameDoc = this.nameDoc;
    const userName = name;
    const chargeUser = charge;
    const numSignature = this.numSignature;

    //const readOnly = this.requestInfo.detail.version == "1";

    let config: ModalOptions = {
      initialState: {
        nameDoc,
        userName,
        chargeUser,
        numSignature,


        idReportAclara,
        idTypeDoc,
        typeAnnex,
        requestInfo,
        nameTypeDoc,
        nomenglatura,
        readOnly,
        callback: (next, xml) => {
          //this.updateInfo = !this.updateInfo;
          if (next) {
            //this.updateReport(xml);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
    };
    this.modalService.show(OrderSignatureModalComponent, config);
  }

  //NUEVA CONFIGURACION DE BOTONES Y PROCESOS

  btnReclamar = false;
  btnLiberar = false;
  btnGuardar = false;
  btnEnviar = false;
  btnReporteOrdenServ = false;
  btnFirmaReporte = false;
  btnRechazar = false;
  btnAprobar = false;
  btnAnexoW = false;
  conpBienesTrans = false;
  conpBienesTransVal = false;
  btnEnviarJustificacion = false;
  btnRechazarJustificacion = false;

  editOrdenServicio = false;

  editServicios = false;
  editVehiculos = false;
  editBienesTrans = false;
  editDireccionOrigen = false;
  editComentarios = false;

  nameDoc = '';
  numSignature = 1;


  configureProcess() {

    this.programmingId = +this.activeRouter.snapshot.params['id'];
    this.process = this.activeRouter.snapshot.params['process'];

    switch (this.process) {
      case 'service-order-capture':
        this.title = this.taskInfo.title;
        this.btnReclamar = true;
        this.btnGuardar = true;
        this.btnLiberar = true;
        this.btnEnviar = true;
        this.editVehiculos = true;
        this.editServicios = true;
        break;
      case 'service-order-validation':
        this.btnReclamar = true;
        this.btnReporteOrdenServ = true;
        this.btnGuardar = true;
        this.btnLiberar = true;
        this.btnRechazar = true;
        this.numSignature = 1;
        this.nameDoc = 'orden_servicio';
        break;
      case 'service-order-aproval':
        this.title = `Aprobación de Servicios (Programación de recepción: )Para la orden de servicio con folio:  `;
        this.btnReclamar = true;
        this.btnReporteOrdenServ = true;
        this.btnGuardar = true;
        this.btnLiberar = true;
        this.btnRechazar = true;
        this.numSignature = 2;
        this.nameDoc = 'orden_servicio';
        break;
      case 'service-order-report':
        this.title = `Reporte de implementación (Programación de recepción: )Para la orden de servicio con folio: `;

        this.btnReclamar = true;
        this.btnGuardar = true;
        this.btnEnviar = true;
        break;
      case 'service-order-report-validation':
        this.title = `Validación de reporte de Implementación (Programación de recepción: )Para la orden de servicio con folio: `;

        this.btnReclamar = true;
        this.btnReporteOrdenServ = true;
        this.btnGuardar = true;
        this.btnRechazar = true;
        this.btnAnexoW = true;
        break;
      case 'service-order-report-signature':
        this.title = `Validación de reporte de Implementación (Programación de recepción: )Para la orden de servicio con folio: `;

        this.btnReclamar = true;
        this.btnReporteOrdenServ = true;
        this.btnGuardar = true;
        break;
      case 'service-order-report-aprove':
        this.title = `Reporte de Implementación Aprobado (Programación de recepción: )Para la orden de servicio con folio: `;
        this.btnReclamar = true;
        this.btnReporteOrdenServ = true;
        this.btnAnexoW = true;
        break;
      case 'service-order-validation-reject':
        this.title = `Solicitud de Orden de Servicio (Validación de Servicios) con folio: `;
        this.btnReclamar = true;
        this.btnLiberar = true;
        this.btnReporteOrdenServ = true;
        this.btnGuardar = true;
        this.btnRechazar = true;
        break;
      case 'service-order-validation-justification':
        this.title = `Solicitud de Orden de Servicio (Validación de Servicios) con folio: `;
        this.btnReclamar = true;
        this.btnReporteOrdenServ = true;
        this.btnGuardar = true;
        break;
      case 'service-order-report-reject':
        this.title = `Solicitud orden de servicio (Validación de reporte) con folio: `;
        this.btnReclamar = true;
        this.btnReporteOrdenServ = true;
        this.btnGuardar = true;
        this.btnRechazar = true;
        break;

      case 'service-order-report-justification-validation':

        break;
      default:
        break;
    }

  }


  async createTask(current = this.process) {

    /** VERIFICAR VALIDACIONES PARA REALIZAR LA TAREA*/

    this.loading = true;
    const { title, url, type, subtype, ssubtype, process, close } = getConfigService(current, this.programming);
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

    /*if (rollBack) {
      task['taskDefinitionId'] = this.taskInfo.id;

      if (!isNullOrEmpty(this.taskInfo.taskDefinitionId)) {
        task['taskDefinitionName'] = this.taskInfo.taskDefinitionId;
      }
    } else {
      task['taskDefinitionId'] = this.taskInfo.taskDefinitionId;
    }*/

    task['id'] = 0;
    task['assignees'] = user.username;
    task['assigneesDisplayname'] = user.nameUser;
    task['creator'] = user.username;
    task['reviewers'] = user.username;
    task['taskNumber'] = this.programmingId;
    task['title'] = title;
    task['programmingId'] = this.programmingId;
    task['requestId'] = this.programmingId;
    task['expedientId'] = 0;
    task['urlNb'] = url;
    task['processName'] = process;
    //task['idstation'] = this.taskInfo.idstation;
    //task['idTransferee'] = this.taskInfo.idTransferee;
    //task['idAuthority'] = this.taskInfo.idAuthority;
    task['idDelegationRegional'] = user.department;

    /*if (!isNullOrEmpty(this.delegation)) {
      task['satZoneCoordinator'] = this['addressOffice'];
    } else {
      task['satZoneCoordinator'] = '';
    }*/

    body['task'] = task;

    let orderservice: any = {};
    orderservice['pActualStatus'] = 'REGISTRO_SOLICITUD';
    orderservice['pNewStatus'] = 'REGISTRO_SOLICITUD';
    orderservice['pIdApplication'] = this.programmingId;
    orderservice['pCurrentDate'] = new Date().toISOString();
    orderservice['pOrderServiceIn'] = '';

    //body['orderservice'] = orderservice;

    const response: any = await this.createTaskOrderService(body);

    if (response && !isNullOrEmpty(response.task)) {
      this.onLoadToast(
        'success',
        'Orden de servicio enviada correctamente',
        'Solicitud turnada'
      );

      this.router.navigate(['/pages/siab-web/sami/consult-tasks']);

    } else {

      this.onLoadToast(
        'error',
        'No se pudo enviar la orden de servicio',
        ''
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
          this.loading = false;
          this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
          reject(false);
        },
      });
    });
  }

  getTask() {

    const task = JSON.parse(localStorage.getItem('Task'));

    const param = new FilterParams();
    param.addFilter('id', task.id);
    const filter = param.getParams();

    return new Promise((resolve, reject) => {
      this.taskService.getAll(filter).subscribe({
        next: resp => {

          if (resp.data.length > 0) {
            resolve(resp.data[0]);
          } else {
            reject(false);
          }

        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'Error', 'No se pudo crear la tarea');
          reject(false);
        },
      });
    });
  }

  configuraModalFirma() {

    const formOnly = true;
    const nameSignatoryRuling = '';// this.requestInfo.detail.nameSignatoryRuling;
    const postSignatoryRuling = '';//this.requestInfo.detail.postSignatoryRuling;
    const typeSign = '';//this.requestInfo.detail.nameRecipientRuling;
    const typeAnnex = 'sign-annexJ-assets-classification';

    let config: ModalOptions = {
      initialState: {
        requestId: this.programmingId,
        reportId: '',
        idSample: this.programmingId,
        contentId: '',
        typeAnnex: typeAnnex,
        nameSignatoryRuling,
        postSignatoryRuling,
        typeSign,
        formOnly,
        callback: async (name, charge, typeSign) => {

          console.log(name, charge, typeSign);
          this.openFirma(name, charge);
          //Actualizar la orden de servicio con los datos de la firma
          //this.updateOrderService(responsibleSae, saePosition, typeSign);


        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeSignatureModalComponent, config);
  }

}
