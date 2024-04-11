import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { catchError, of } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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

  constructor() {
    super();
    this.configureProcess();
  }

  ngOnInit(): void {

    const task = JSON.parse(localStorage.getItem('Task'));
    this.task = task['op'];
    this.op = this.task;

    this.prepareForm();
    this.getProgramming();
    this.getOrderService();
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
        this.processSendOrderService();
        this.onLoadToast(
          'success',
          'Orden de servicio enviada correctamente',
          ''
        );
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

    this.openFirma();
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

  async openFirma(dynamic = false) {

    let token = this.authService.decodeToken();
    let today = new Date();

    let idTypeDoc = "0";
    let readOnly = false;

    const typeAnnex = 'approval-request';
    const requestInfo = { id: this.programmingId, type: 'programming' };
    const idReportAclara = this.programmingId;
    const nameTypeDoc = 'OrdenServicio';
    const nomenglatura = '';
    const isDynamic = dynamic;
    //const readOnly = this.requestInfo.detail.version == "1";

    let config: ModalOptions = {
      initialState: {
        idReportAclara,
        idTypeDoc,
        typeAnnex,
        requestInfo,
        nameTypeDoc,
        nomenglatura,
        isDynamic,
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


  configureProcess() {

    this.programmingId = +this.activeRouter.snapshot.params['id'];
    this.process = this.activeRouter.snapshot.params['process'];

    switch (this.process) {
      case 'service-order-capture':
        this.title = `Solicitud orden de servicio (Captura de servicios)`;
        this.btnReclamar = true;
        this.btnGuardar = true;
        this.btnLiberar = true;
        this.btnEnviar = true;
        this.editVehiculos = true;
        this.editServicios = true;
        break;
      case 'service-order-validation':
        this.btnReclamar = true;
        break;
      case 'service-order-aproval':
        this.btnReclamar = true;
        break;
      case 'service-order-report':
        this.btnReclamar = true;
        break;
      case 'service-order-report-validation':
        this.btnReclamar = true;
        break;
      case 'service-order-report-signature':
        this.btnReclamar = true;
        break;
      case 'service-order-validation-reject':
        this.btnReclamar = true;
        break;
      default:
        break;
    }

  }


}
