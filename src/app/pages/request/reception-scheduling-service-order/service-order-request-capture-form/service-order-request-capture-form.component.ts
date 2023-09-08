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
  op: number = 1;
  showForm: boolean = true;
  orderServiceId: number = null;
  lsProgramming: string = null;
  programmingId: number = null;
  programming: any = null;
  isUpdate: boolean = false;

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
      notes: [null, [Validators.pattern(STRING_PATTERN)]],
      observation: [null, [Validators.pattern(STRING_PATTERN)]],
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
        this.updateOrderService(ordServiceForm);
        this.isUpdate = true;
      }
    });
  }

  setClaimRequest() {
    this.claimRequest = true;
    this.ordServform.controls['transferLocation'].enable();
    this.ordServform.controls['transferAddress'].enable();
    this.ordServform.controls['sourceStore'].enable();
    this.ordServform.controls['originStreet'].enable();
    this.ordServform.controls['originPostalCode'].enable();
    this.ordServform.controls['colonyOrigin'].enable();
    //this.ordServform.controls['notes'].enable();
    //this.ordServform.controls['observation'].enable();
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
        console.log(resp);
        this.onLoadToast(
          'success',
          'Orden de servicio guardada correctamente',
          ''
        );
      },
      error: error => {
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
    const idProg = this.programmingId;
    const idTypeDoc = 221;
    let config: ModalOptions = {
      initialState: {
        idProg,
        idTypeDoc,
        signatore,
        typeFirm: signature == true ? 'electronica' : 'autografa',
        programming: this.programming,
        callback: (next: boolean) => {
          if (next) {
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
}
