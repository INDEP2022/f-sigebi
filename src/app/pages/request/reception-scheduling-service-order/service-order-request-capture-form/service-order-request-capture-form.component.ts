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
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ShowReportComponentComponent } from '../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { ConfirmProgrammingComponent } from '../../shared-request/confirm-programming/confirm-programming.component';
import { AnnexWFormComponent } from '../components/annex-w-form/annex-w-form.component';
import { RejectionCommentFormComponent } from '../components/rejection-comment-form/rejection-comment-form.component';
import { RejectionJustifyFormComponent } from '../components/rejection-justify-form/rejection-justify-form.component';

@Component({
  selector: 'app-service-order-request-capture-form',
  templateUrl: './service-order-request-capture-form.component.html',
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
export class ServiceOrderRequestCaptureFormComponent
  extends BasePage
  implements OnInit
{
  claimRequest: boolean = false;
  form: FormGroup = new FormGroup({});
  ordServform: FormGroup = new FormGroup({});
  parentModal: BsModalRef;
  op: number = null;
  showForm: boolean = false;
  orderServiceId: number = null;
  lsProgramming: string = null;
  programmingId: number = null;
  programming: any = null;
  isUpdate: boolean = false;

  total: string = null;
  task: any = null;
  isApprove: boolean = false;
  title: string = '';
  typeOrder: string = 'reception';
  justificationRefused: boolean = false;

  //private programmingService = inject(ProgrammingRequestService);
  //private router = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private orderEntryService = inject(orderentryService);
  private authService = inject(AuthService);
  private activeRouter = inject(ActivatedRoute);
  private modalService = inject(BsModalService);
  private programmingService = inject(ProgrammingRequestService);
  private orderService = inject(OrderServiceService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    const task = JSON.parse(localStorage.getItem('Task'));
    this.task = task['op'];
    this.op = this.task;
    console.log(this.task);
    this.programmingId = +this.activeRouter.snapshot.params['id'];
    this.prepareProgForm();
    this.prepareOrderServiceForm();
    this.getProgramming();
    this.getOrderService();
  }

  prepareProgForm() {
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
  }

  prepareOrderServiceForm() {
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
      notes: [
        { value: null, disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      observation: [
        { value: null, disabled: true },
        [Validators.pattern(STRING_PATTERN)],
      ],
      justification: [null, [Validators.pattern(STRING_PATTERN)]],
      justificationReport: [null, [Validators.pattern(STRING_PATTERN)]],
      commentRejection: [null, [Validators.pattern(STRING_PATTERN)]],
      programmingId: [null],
      id: [null],
    });
  }

  showDocument() {}

  async sendOrderService() {
    const orderServProvi: any = await this.getOrderServiceProvided();
    if (orderServProvi.count) {
      this.onLoadToast(
        'info',
        'Es necesario agregar servicios a la programación'
      );
      return;
    }

    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea enviar la orden de servicio con folio METROPOLITANA-SAT-1340-OS?'
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
      console.log('Es rechazado');
      this.lsProgramming = 'AprobarContrapropuesta';
      const body = {
        //tiOrdServicio: this.orderServiceId,
        rejectionJustInd: 'Y', //tsIndRechazo
      };
      //actualizar orden servicio
    } else if (status == 'ReporteImplementacion') {
      console.log('Es enviado por primera vez');
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

        console.log(this.ordServform.getRawValue());
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
    this.claimRequest = true;
    if (this.task == 1) {
      this.ordServform.controls['transferLocation'].enable();
      this.ordServform.controls['transferAddress'].enable();
      this.ordServform.controls['sourceStore'].enable();
      this.ordServform.controls['originStreet'].enable();
      this.ordServform.controls['originPostalCode'].enable();
      this.ordServform.controls['colonyOrigin'].enable();
      this.ordServform.controls['notes'].enable();
      this.ordServform.controls['observation'].enable();
    }
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
          this.setTitle();
          // }, 100);
        },
      });
  }

  getOrderServiceProvided() {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
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
      error: error => {
        console.log(error);
        this.onLoadToast('error', 'No se pudo actualizar la orden de servicio');
      },
    });
  }

  generateOrdSerReport() {
    const config = MODAL_CONFIG;
    config.initialState = {
      idProgramming: this.programmingId,
      type: 'order-service',
      callback: (signatore: any) => {
        //ISignatories
        if (signatore.data) {
          this.openReport(signatore.data, signatore.sign);
        }
      },
    };

    this.modalService.show(ConfirmProgrammingComponent, config);
  }

  openReport(signatore: ISignatories, signature: boolean) {
    //task == 8 ||task == 10 ||task == 13 ||task == 11
    let idTypeDoc = 221;
    if (this.task == 2) {
    } else if (this.task == 3) {
    } else if (this.task == 5) {
    } else if (this.task == 6) {
    }
    const idProg = this.programmingId;

    let config: ModalOptions = {
      initialState: {
        idProg,
        idTypeDoc,
        signatore,
        typeFirm: signature == true ? 'electronica' : 'autografa',
        programming: this.programming,
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
      this.onLoadToast('success', 'Solicitud Aprovada', 'falta la logica');
    });
  }

  setTitle() {
    const folio = this.ordServform.get('serviceOrderFolio').value;
    if (this.task == 1) {
      this.title = 'Solicitud Orden de Servicio (Captura de Servicios)';
    } else if (this.task == 2) {
      this.title = `Solicitud Orden de Servicio (Validación de Servicio) con folio: ${folio}`;
    } else if (this.task == 3) {
      this.title = `Aprobación de servicios (Programación de recepción: ${this.programming.folio}) para la orden de servicio con folio: ${folio}`;
    } else if (this.task == 4) {
      this.title = `Reporte de implementación (Programación de recepción: ${this.programming.folio}) para la orden de servicio con folio: ${folio}`;
    } else if (this.task == 5) {
      this.title = `Validación de reporte de implementación (Programación de recepción: ${this.programming.folio}) para la orden de servicio con folio: ${folio}`;
    } else if (this.task == 6) {
      this.title = `Validación de reporte de Implementación (Programación de recepción: ${this.programming.folio}) para la orden de servicio con folio: ${folio}`;
    } else if (this.task == 7) {
      this.title = `Reporte de Implementación aprobado (Programación de recepción: ${this.programming.folio}) para la orden de servicio con folio: ${folio}`;
    } else if (this.task == 8) {
      this.title = `Solicitud Orden de Servicio (Validación de Servicio) con el folio: ${folio}`;
    } else if (this.task == 9) {
      this.title = `Solicitud Orden de Servicio (Rechazo de Orden de Servicio) con el folio: ${folio}`;
    } else if (this.task == 10) {
      this.title = `Solicitud Orden de Servicio (Validación de Servicio) con el folio: ${folio}`;
    } else if (this.task == 11) {
      this.title = `Solicitud Orden de Servicio (Validación de Reporte) con el folio: ${folio}`;
    } else if (this.task == 12) {
      this.title = `Rechazo de reporte de implementación (Programación de recepción: ${this.programming.folio}) para la orden de servicio con el folio: ${folio}`;
    } else if (this.task == 13) {
      this.title = `Validación de reporte de implementación (Programación de recepción: ${this.programming.folio}) para la orden de servicio con el folio: ${folio}`;
    } else if (this.task == 14) {
      this.title = `Rechazo de orden de servicios (Programación de recepción: ${this.programming.folio}) con el folio: ${folio}`;
    } else if (this.task == 15) {
      this.title = `echazo de reporte de implementación (Programación de recepción: ${this.programming.folio}) para la orden de servicio con folio: ${folio}`;
    }
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
}
