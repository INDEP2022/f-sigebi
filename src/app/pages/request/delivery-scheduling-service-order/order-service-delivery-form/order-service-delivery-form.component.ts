import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, of } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { IOrderServiceDTO } from 'src/app/core/models/ms-order-service/order-service.mode';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ShowReportComponentComponent } from '../../programming-request-components/execute-reception/show-report-component/show-report-component.component';
import { GenerateReportFormComponent } from '../../reception-scheduling-service-order/components/generate-report-form/generate-report-form.component';
import { RejectionCommentFormComponent } from '../../reception-scheduling-service-order/components/rejection-comment-form/rejection-comment-form.component';
import { RejectionJustifyFormComponent } from '../../reception-scheduling-service-order/components/rejection-justify-form/rejection-justify-form.component';
import { ElectronicSignatureListComponent } from '../../shared-request/electronic-signature-list/electronic-signature-list.component';
import { ShowSignatureProgrammingComponent } from '../../shared-request/show-signature-programming/show-signature-programming.component';

@Component({
  selector: 'app-order-service-delivery-form',
  templateUrl: './order-service-delivery-form.component.html',
  styles: [],
})
export class OrderServiceDeliveryFormComponent
  extends BasePage
  implements OnInit
{
  @Input() task: number;
  showForm: boolean = false;
  aprobateService: boolean = false;
  rejected: boolean = false;
  title: string = '';
  buttonClaim: boolean = false;
  buttonLiberate: boolean = false;
  buttonSend: boolean = false;
  buttonSendFalse: boolean = false;
  buttonGenerateReport: boolean = false;
  buttonGenerateReportFalse: boolean = false;
  buttonAprobate: boolean = false;
  buttonAprobateFalse: boolean = false;
  buttonAprobateView2: boolean = false;
  buttonAprobateView3: boolean = false;
  buttonAprobateView4: boolean = false;
  buttonAprobateView5: boolean = false;
  buttonReject: boolean = false;
  buttonRejectFalse: boolean = false;
  sendNotification: boolean = false;
  sendNotifications: boolean = false;
  buttonSave: boolean = false;
  buttonSaveFalse: boolean = false;
  buttonAnnexedW: boolean = false;
  orderServiceId: number = null;
  orderserviceData: IOrderServiceDTO;
  ordServForm: FormGroup = new FormGroup({});
  form: FormGroup = new FormGroup({});
  programmingId: number = null;
  op: number = 0;
  total: string = null;
  programming: Iprogramming;
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private programmingService: ProgrammingRequestService,
    private activeRouter: ActivatedRoute,
    private orderService: OrderServiceService,
    private signatoriesService: SignatoriesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.op = this.task;
    console.log('this.op', this.op);
    this.programmingId = this.activeRouter.snapshot.params['id'];

    this.prepareOrderServiceForm();
    this.prepareProgForm();
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

  getProgramming() {
    this.programmingService.getProgrammingId(this.programmingId).subscribe({
      next: resp => {
        this.programming = resp;
      },
    });
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
          this.ordServForm.patchValue(resp.data[0]);
          this.orderserviceData = resp.data[0];
          this.orderServiceId = resp.data[0].id;
          this.processTitle();
          // }, 100);
        },
      });
  }

  prepareOrderServiceForm() {
    this.ordServForm = this.fb.group({
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
      programmingId: [null],
      id: [null],
    });
  }

  processTitle() {
    if (this.task == 1) {
      this.title = `Captura de orden de servicio (Programación de entrega: E-METROPOLITANA-335) con folio: ${this.orderserviceData?.serviceOrderFolio}`;
      this.buttonClaim = true;
      this.buttonSend = true;
    } else if (this.task == 2) {
      this.title = `Validación de servicios (Programación de entrega: E-METROPOLITANA-335) para la orden de servicio con folio: ${this.orderserviceData?.serviceOrderFolio}`;
      this.buttonClaim = true;
      this.buttonGenerateReport = true;
      this.buttonAprobateView2 = true;
      this.buttonReject = true;
    } else if (this.task == 3 || this.task == 6) {
      this.title = `Aprobración de servicios (Programación de recepción: Programación de entrega E-METROPOLITANA-335) para la orden de servicio con folio: ${this.orderserviceData?.serviceOrderFolio}`;

      if (this.task == 6) {
        this.buttonGenerateReportFalse = true;
        this.buttonAprobateFalse = true;
      } else {
        this.buttonClaim = true;
        this.buttonGenerateReport = true;
        this.buttonAprobate = true;
      }
    } else if (this.task == 4) {
      this.title = `Reporte de implementación (Programación de entrega E-METROPOLITANA-335) para la orden de servicio con folio: ${this.orderserviceData?.serviceOrderFolio}`;
      this.buttonSendFalse = true;
      this.buttonSaveFalse = true;
    } else if (this.task == 5 || this.task == 11) {
      this.title = `Validación de reporte de implementación (Programación de entrega: E-METROPOLITANA-335) para la orden de servicio con folio: ${this.orderserviceData?.serviceOrderFolio}`;
      if (this.task == 5) {
        this.buttonGenerateReportFalse = true;
        this.buttonAprobateView2 = true;
        this.buttonRejectFalse = true;
        this.buttonSaveFalse = true;
        this.buttonAnnexedW = true;
      } else {
        this.buttonGenerateReportFalse = true;
        this.buttonAprobateView4 = true;
        this.buttonRejectFalse = true;
        this.buttonSaveFalse = true;
        this.buttonAnnexedW = true;
      }
    } else if (this.task == 7) {
      this.title = `Reporte de implementación aprobado (Programación de entrega E-METROPOLITANA-335) para la orden de servicio con folio: ${this.orderserviceData?.serviceOrderFolio}`;
      this.buttonGenerateReportFalse = true;
      this.buttonAprobateView3 = true;
      this.buttonAnnexedW = true;
    } else if (this.task == 8 || this.task == 10) {
      this.title = `Validación de servicios (Programación de entrega: E-METROPOLITANA-335) para la orden de servicio con folio: ${this.orderserviceData?.serviceOrderFolio}`;
      if (this.task == 10) {
        this.buttonGenerateReportFalse = true;
        this.buttonAprobateView5 = true;
        this.buttonSaveFalse = true;
      } else {
        this.buttonClaim = true;
        this.buttonLiberate = true;
        this.buttonGenerateReport = true;
        this.buttonReject = true;
        this.buttonSave = true;
      }
    } else if (this.task == 9 || this.task == 13) {
      this.title = `Rechazo de orden de servicios (Programación de entrega: E-METROPOLITANA-335) con folio: ${this.orderserviceData?.serviceOrderFolio}`;
      this.buttonSendFalse = true;
      this.sendNotification = true;
      this.buttonSaveFalse = true;
    } else if (this.task == 12 || this.task == 14) {
      this.title = `Rechazo de reporte de implementación (Programación de entrega: E-METROPOLITANA-335) para la orden de servicio con folio: ${this.orderserviceData?.serviceOrderFolio}`;
      if (this.task == 14) {
        this.sendNotification = true;
        this.buttonSaveFalse = true;
      }
      this.buttonSendFalse = true;
      this.buttonSaveFalse = true;
    }
  }

  liberateRequest() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      `¿Desea liberar la orden de servicio con folio ${this.orderserviceData?.serviceOrderFolio}?`
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Orden de servicio liberada correctamente',
          ''
        );
      }
    });
  }

  sendRequest() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      `¿Desea enviar la orden de servicio con folio ${this.orderserviceData?.serviceOrderFolio}?`
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Orden de servicio enviada correctamente',
          ''
        );
      }
    });
  }

  saveRequest() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      `¿Desea guardar la orden de servicio con folio ${this.orderserviceData?.serviceOrderFolio}?`
    ).then(question => {
      if (question.isConfirmed) {
        const infoOrderService: IOrderServiceDTO = {
          id: this.orderserviceData?.id,
          transportationZone: this.ordServForm.get('transportationZone').value,
          folioTlp: this.ordServForm.get('folioTlp').value,
          reasonsNotPerform: this.ordServForm.get('reasonsNotPerform').value,
          userContainers:
            this.ordServForm.get('userContainers').value == null ? 'N' : 'Y',
          eyeVisit: this.ordServForm.get('eyeVisit').value,
        };

        this.orderService.updateOrderService(infoOrderService).subscribe({
          next: response => {
            this.onLoadToast(
              'success',
              'Orden de servicio guardada correctamente',
              ''
            );
          },
          error: error => {},
        });
      }
    });
  }

  aprobeRequest() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      `¿Desea aprobar la orden de servicio con folio ${this.orderserviceData?.serviceOrderFolio}?`
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Orden de servicio aprobada correctamente',
          ''
        );
      }
    });
  }

  validateJustification() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      `¿Desea rechazar la justificacion con el folio ${this.orderserviceData?.serviceOrderFolio}?`
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast(
          'success',
          'Justificación rechazada correctamente',
          ''
        );
        this.rejected = true;
      }
    });
  }

  declineOrderService() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const rejectionComment = this.modalService.show(
      RejectionCommentFormComponent,
      config
    );
  }

  generateReport() {
    if (this.task == 2) {
      let config = {
        ...MODAL_CONFIG,
        class: 'modal-lg modal-dialog-centered',
      };

      config.initialState = {
        callback: async (next: boolean, infoSign: any) => {
          if (next) {
            if (infoSign.electronicSignature == true) {
              const createSign = await this.createSignature(infoSign, 245);
              if (createSign) {
                this.showReport();
              } else {
                this.alert('error', 'Error', 'Error al crear el firmante');
              }
            } else {
              this.showReport();
            }
          }
        },
      };

      this.modalService.show(GenerateReportFormComponent, config);
    } else if (this.task == 3) {
      let config = {
        ...MODAL_CONFIG,
        class: 'modal-lg modal-dialog-centered',
      };

      config.initialState = {
        processFirm: 'firmRegionalDelegation',
        callback: async (next: boolean, infoSign: any) => {
          if (next) {
            if (infoSign.electronicSignature == true) {
              const createSign = await this.createSignature(infoSign, 245);
              if (createSign) {
                this.showReport();
              } else {
                this.alert('error', 'Error', 'Error al crear el firmante');
              }
            } else {
              this.showReport();
            }
          }
        },
      };

      const createService = this.modalService.show(
        GenerateReportFormComponent,
        config
      );
    } else if (this.task == 5) {
      let config = {
        ...MODAL_CONFIG,
        class: 'modal-lg modal-dialog-centered',
      };

      config.initialState = {
        task: this.op,
        callback: async (next: boolean, infoSign: any) => {
          if (next) {
            console.log('infoSign', infoSign);

            const createSign = await this.createSignature(infoSign, 246);
            if (createSign) {
              this.showReport('validation-report');
            } else {
              this.alert('error', 'Error', 'Error al crear el firmante');
            }
          }
        },
      };

      this.modalService.show(GenerateReportFormComponent, config);
    } else if (this.task == 6) {
      let config = {
        ...MODAL_CONFIG,
        class: 'modal-lg modal-dialog-centered',
      };

      config.initialState = {
        processFirm: 'firmRegionalDelegation',
        callback: async (next: boolean, infoSign: any) => {
          if (next) {
            if (infoSign.electronicSignature == true) {
              const createSign = await this.createSignature(infoSign, 246);
              if (createSign) {
                this.showReport();
              } else {
                this.alert('error', 'Error', 'Error al crear el firmante');
              }
            } else {
              this.showReport();
            }
          }
        },
      };

      const createService = this.modalService.show(
        GenerateReportFormComponent,
        config
      );
    }
  }

  createSignature(infoSign: any, _learnedType: number) {
    return new Promise((resolve, reject) => {
      const learnedType = _learnedType;
      const learndedId = 516; // Id Orden de Servicio

      this.signatoriesService
        .getSignatoriesFilter(learnedType, learndedId)
        .subscribe({
          next: response => {
            /*this.signatoriesService
              .deleteFirmante(Number(response.data[0].signatoryId))
              .subscribe({
                next: () => {
                  
                },
              }); */

            const formData: Object = {
              learnedId: 516, // Orden de servicio
              learnedType: learnedType,
              boardSignatory: 'ORDEN_SERVICIO',
              columnSignatory: 'TIPO_FIRMA',
              name: infoSign.responsible,
              post: infoSign.charge,
            };

            this.signatoriesService.create(formData).subscribe({
              next: response => {
                resolve(true);
              },
            });
          },
          error: error => {
            const formData: Object = {
              learnedId: 516, // Orden de servicio
              learnedType: learnedType,
              boardSignatory: 'ORDEN_SERVICIO',
              columnSignatory: 'TIPO_FIRMA',
              name: infoSign.responsible,
              post: infoSign.charge,
            };

            this.signatoriesService.create(formData).subscribe({
              next: response => {
                resolve(true);
              },
            });
          },
        });
    });
  }

  showReport(process?: string) {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      idOrderService: 516,
      process,
      callback: (data: any) => {
        if (data) {
          //this.electronicSignture();
        }
      },
    };

    //const showReport = this.modalService.show(ShowProgrammingComponent, config);
    const showReport = this.modalService.show(
      ShowReportComponentComponent,
      config
    );
  }

  showReportAnnexW() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      idOrderService: 516,
      idTypeDoc: 198,
      annexW: true,
      callback: (data: any) => {
        if (data) {
          //this.electronicSignture();
        }
      },
    };

    //const showReport = this.modalService.show(ShowProgrammingComponent, config);
    const showReport = this.modalService.show(
      ShowReportComponentComponent,
      config
    );
  }

  /*showReportAnnexW() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      idOrderService: 516,
      idTypeDoc: 198,
      annexW: true,
      callback: (data: any) => {
        if (data) {
          //this.electronicSignture();
        }
      },
    };

    //const showReport = this.modalService.show(ShowProgrammingComponent, config);
    const showReport = this.modalService.show(
      ShowReportComponentComponent,
      config
    );
  } */

  electronicSignture() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          this.showSignProg();
        }
      },
    };

    const showReport = this.modalService.show(
      ElectronicSignatureListComponent,
      config
    );
  }

  showSignProg() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
          this.aprobateService = true;
        }
      },
    };

    const showReport = this.modalService.show(
      ShowSignatureProgrammingComponent,
      config
    );
  }

  createAnnexedW() {
    if (this.op != 7) {
      let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

      config.initialState = {
        processFirm: 'AnnexW',
        callback: async (next: boolean, signatorie: ISignatories) => {
          if (next) {
            const createSignatureAnnexW = await this.createSignatureAnnexW(
              signatorie
            );

            if (createSignatureAnnexW) {
              this.showReport();
            }
          }
        },
      };

      this.modalService.show(GenerateReportFormComponent, config);
    } else {
      let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

      config.initialState = {
        processFirm: 'AnnexW',
        typeSig: 'TE',
        callback: async (next: boolean, signatorie: ISignatories) => {
          if (next) {
            const createSignatureAnnexW = await this.createSignatureAnnexW(
              signatorie
            );

            if (createSignatureAnnexW) {
              this.showReport();
            }
          }
        },
      };

      this.modalService.show(GenerateReportFormComponent, config);
    }
  }

  createSignatureAnnexW(infoSign: any) {
    return new Promise((resolve, reject) => {
      const learnedType = 198;
      const learndedId = 516; // Id Orden de Servicio

      this.signatoriesService
        .getSignatoriesFilter(learnedType, learndedId)
        .subscribe({
          next: response => {
            /*this.signatoriesService
              .deleteFirmante(Number(response.data[0].signatoryId))
              .subscribe({
                next: () => {
                  
                },
              }); */

            const formData: Object = {
              learnedId: 516, // Orden de servicio
              learnedType: 198,
              boardSignatory: 'ORDEN_SERVICIO',
              columnSignatory: 'TIPO_FIRMA',
              name: infoSign.responsible,
              post: infoSign.charge,
            };

            this.signatoriesService.create(formData).subscribe({
              next: response => {
                resolve(true);
              },
            });
          },
          error: error => {
            const formData: Object = {
              learnedId: 516, // Orden de servicio
              learnedType: 198,
              boardSignatory: 'ORDEN_SERVICIO',
              columnSignatory: 'TIPO_FIRMA',
              name: infoSign.responsible,
              post: infoSign.charge,
            };

            this.signatoriesService.create(formData).subscribe({
              next: response => {
                resolve(true);
              },
            });
          },
        });
    });
  }

  /*createSignatureAnnexW(infoSign: any) {
    return new Promise((resolve, reject) => {
      const learnedType = 198;
      const learndedId = 516; // Id Orden de Servicio

      this.signatoriesService
        .getSignatoriesFilter(learnedType, learndedId)
        .subscribe({
          next: response => {
            /*this.signatoriesService
              .deleteFirmante(Number(response.data[0].signatoryId))
              .subscribe({
                next: () => {
                  
                },
              }); 

            const formData: Object = {
              learnedId: 516, // Orden de servicio
              learnedType: 198,
              boardSignatory: 'ORDEN_SERVICIO',
              columnSignatory: 'TIPO_FIRMA',
              name: infoSign.responsible,
              post: infoSign.charge,
            };

            this.signatoriesService.create(formData).subscribe({
              next: response => {
                resolve(true);
              },
            });
          },
          error: error => {
            const formData: Object = {
              learnedId: 516, // Orden de servicio
              learnedType: 198,
              boardSignatory: 'ORDEN_SERVICIO',
              columnSignatory: 'TIPO_FIRMA',
              name: infoSign.responsible,
              post: infoSign.charge,
            };

            this.signatoriesService.create(formData).subscribe({
              next: response => {
                resolve(true);
              },
            });
          },
        });
    });
  } */

  sendJustify() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };

    config.initialState = {
      callback: (data: any) => {
        if (data) {
        }
      },
    };

    const showReport = this.modalService.show(
      RejectionJustifyFormComponent,
      config
    );
  }
}
