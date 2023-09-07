import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, of } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

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
  orderServiceId: number = 0;
  lsProgramming: string = null;
  programmingId: number = null;

  //private programmingService = inject(ProgrammingRequestService);
  //private router = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private orderService = inject(orderentryService);
  private authService = inject(AuthService);
  private activeRouter = inject(ActivatedRoute);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.programmingId = +this.activeRouter.snapshot.params['id'];
    this.prepareProgForm();
    this.prepareOrderServiceForm();

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
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Desea guardar la orden de servicio con folio METROPOLITANA-SAT-1340-OS?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Orden de servicio guardada correctamente',
          ''
        );
      }
    });
  }

  setClaimRequest() {
    this.claimRequest = true;
    this.form.controls['location'].enable();
    this.form.controls['address'].enable();
  }

  getOrderService() {
    /**
     * otener el orden de servicio por el programmingId
     */
    const data: any = {
      serviceOrderFolio: 'METROPOLITANA-SAT',
      folioReportImplementation: 'METROPOLITANA-SAT',
      shiftDate: '2018/01/25',
      shiftUser: 'USUARIO DE PRUEBA',
      contractNumber: '124',
      transportationZone: 'A',
      folioTlp: '',
      eyeVisit: '',
      reasonsNotPerform: '',
      userContainers: '',
      id: 1,
    };
    this.orderServiceId = data.id;
    this.ordServform.patchValue(data);
  }

  getOrderServiceProvided() {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.orderServiceId'] = `$eq:${this.orderServiceId}`;
      this.orderService
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

  generateOrdSerReport() {
    /*const config = MODAL_CONFIG;
    config.initialState = {
      idProgramming: this.programmingId,
      callback: (signatore: ISignatories) => {
        if (signatore) {
          //this.openReport(signatore);
        }
      },
    };

    this.modalService.show(ConfirmProgrammingComponent, config);*/
  }
}
