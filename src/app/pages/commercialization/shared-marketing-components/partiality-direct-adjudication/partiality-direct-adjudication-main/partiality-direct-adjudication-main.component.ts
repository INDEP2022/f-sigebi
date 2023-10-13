import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { BiddingService } from 'src/app/core/services/ms-bidding/bidding.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { StatusDispService } from 'src/app/core/services/ms-status-disp/status-disp.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-partiality-direct-adjudication-main',
  templateUrl: './partiality-direct-adjudication-main.component.html',
  styles: [],
})
export class PartialityDirectAdjudicationMainComponent
  extends BasePage
  implements OnInit
{
  paramsForm: FormGroup = new FormGroup({});
  adjudicationForm: FormGroup = new FormGroup({});
  licitacionForm: FormGroup = new FormGroup({});
  @ViewChild('directAdjudicationTabs', { static: false })
  directAdjudicationTabs?: TabsetComponent;
  eventItems = new DefaultSelect();
  batchItems = new DefaultSelect();
  clientItems = new DefaultSelect();
  selectedEvent: any = null;
  selectedBatch: any = null;
  selectedClient: any = null;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  clColumns: any[] = [];
  clTestData: any[] = [];
  user: any;
  delegation: any;

  // eventsTestData = [
  //   {
  //     id: 101,
  //     cve: 'EJEMPLO CVE',
  //     type: 'EJEMPLO TIPO EVENTO',
  //     status: 'EJEMPLO ESTATUS',
  //     observations: 'EJEMPLO OBSERVACIONES DEL EVENTO',
  //   },
  //   {
  //     id: 201,
  //     cve: 'EJEMPLO CVE',
  //     type: 'EJEMPLO TIPO EVENTO',
  //     status: 'EJEMPLO ESTATUS',
  //     observations: 'EJEMPLO OBSERVACIONES DEL EVENTO',
  //   },
  //   {
  //     id: 301,
  //     cve: 'EJEMPLO CVE',
  //     type: 'EJEMPLO TIPO EVENTO',
  //     status: 'EJEMPLO ESTATUS',
  //     observations: 'EJEMPLO OBSERVACIONES DEL EVENTO',
  //   },
  //   {
  //     id: 401,
  //     cve: 'EJEMPLO CVE',
  //     type: 'EJEMPLO TIPO EVENTO',
  //     estatus: 'EJEMPLO ESTATUS',
  //     observations: 'EJEMPLO OBSERVACIONES DEL EVENTO',
  //   },
  //   {
  //     id: 501,
  //     cve: 'EJEMPLO CVE',
  //     type: 'EJEMPLO TIPO EVENTO',
  //     status: 'EJEMPLO ESTATUS',
  //     observations: 'EJEMPLO OBSERVACIONES DEL EVENTO',
  //   },
  // ];

  // batchesTestData = [
  //   {
  //     id: 1,
  //     description: 'EJEMPLO DESCRIPCION LOTE',
  //   },
  //   {
  //     id: 2,
  //     description: 'EJEMPLO DESCRIPCION LOTE',
  //   },
  //   {
  //     id: 3,
  //     description: 'EJEMPLO DESCRIPCION LOTE',
  //   },
  //   {
  //     id: 4,
  //     description: 'EJEMPLO DESCRIPCION LOTE',
  //   },
  //   {
  //     id: 5,
  //     description: 'EJEMPLO DESCRIPCION LOTE',
  //   },
  // ];

  // clientsTestData = [
  //   {
  //     id: 111,
  //     name: 'NOMBRE CLIENTE 111',
  //     rfc: 'RSHSRH61813',
  //     blacklisted: 'N',
  //   },
  //   {
  //     id: 222,
  //     name: 'NOMBRE CLIENTE 222',
  //     rfc: 'HJTDT82190',
  //     blacklisted: 'N',
  //   },
  //   {
  //     id: 333,
  //     name: 'NOMBRE CLIENTE 333',
  //     rfc: 'PLNAIH8639',
  //     blacklisted: 'N',
  //   },
  //   {
  //     id: 444,
  //     name: 'NOMBRE CLIENTE 444',
  //     rfc: 'PAMBVBO9167',
  //     blacklisted: 'N',
  //   },
  //   {
  //     id: 555,
  //     name: 'NOMBRE CLIENTE 555',
  //     rfc: 'HDNMA349716',
  //     blacklisted: 'N',
  //   },
  // ];

  // clTestData = [
  //   {
  //     paymentId: 100,
  //     scheduledDate: '12/07/2021',
  //     icbExempt: 10000,
  //     icbEngraved: 12000,
  //     nominalRate: 10,
  //     daysYear: 12,
  //     daysMonth: 15,
  //     interestExempt: 500,
  //     interestEngraved: 500,
  //     interestTax: 500,
  //     ceExempt: 1000,
  //     ceEngraved: 1000,
  //     ceTax: 1000,
  //     moratoriumExempt: 750,
  //     moratoriumEngraved: 750,
  //     moratoriumTax: 750,
  //     totalTax: 1500,
  //     totalAmount: 14000,
  //     referenceDate: '21/08/2021',
  //     reference: 'EJEMPLO REFERENCIA',
  //     status: 'CREADA',
  //   },
  // ];

  constructor(
    private fb: FormBuilder,
    private biddingService: BiddingService,
    private statusDispService: StatusDispService,
    private comerClientsService: ComerClientsService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getuser();
    this.prepareForm();
    this.adjudicationForm.get('partialityQuantity').patchValue(40);
  }

  private prepareForm(): void {
    this.paramsForm = this.fb.group({
      event: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.min(1),
        ],
      ],
      batchId: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.min(1),
        ],
      ],
      clientId: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(600),
        ],
      ],
      partialityQuantity: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.min(1),
        ],
      ],
      advancePercent: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.min(1),
        ],
      ],
      saleAmount: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.min(1),
        ],
      ],
      percentPoints: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.min(1),
        ],
      ],
      moratoriumDays: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.min(1),
        ],
      ],
      paymentNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.min(1),
        ],
      ],
    });
    this.adjudicationForm = this.fb.group({
      event: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.min(1)],
      ],
      batchId: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.min(1)],
      ],
      clientId: [
        { value: null, disabled: true },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(600)],
      ],
      partialityQuantity: [null, [Validators.required]],
      advancePercent: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.min(40),
          Validators.max(100),
        ],
      ],
      exemptSP: [null, [Validators.required]],
      exemptAdv: [null, [Validators.required]],
      exemptBal: [null, [Validators.required]],
      engravedSP: [null, [Validators.required]],
      engravedAdv: [null, [Validators.required]],
      engravedBal: [null, [Validators.required]],
      subtotalSP: [null, [Validators.required]],
      subtotalAdv: [null, [Validators.required]],
      subtotalBal: [null, [Validators.required]],
      taxSP: [null, [Validators.required]],
      taxAdv: [null, [Validators.required]],
      taxBal: [null, [Validators.required]],
      totalSP: [null, [Validators.required]],
      totalAdv: [null, [Validators.required]],
      totalBal: [null, [Validators.required]],
    });
    this.licitacionForm = this.fb.group({
      licitacionNumber: [null, [Validators.required]],
    });
  }

  // getEvents(params: ListParams) {
  //   if (params.text == '') {
  //     this.eventItems = new DefaultSelect(this.eventsTestData, 5);
  //   } else {
  //     const id = parseInt(params.text);
  //     const item = [this.eventsTestData.filter((i: any) => i.id == id)];
  //     this.eventItems = new DefaultSelect(item[0], 1);
  //   }
  // }

  // getBatches(params: ListParams) {
  //   if (params.text == '') {
  //     this.batchItems = new DefaultSelect(this.batchesTestData, 5);
  //   } else {
  //     const id = parseInt(params.text);
  //     const item = [this.batchesTestData.filter((i: any) => i.id == id)];
  //     this.batchItems = new DefaultSelect(item[0], 1);
  //   }
  // }

  // getClients(params: ListParams) {
  //   console.log('params: ', params);

  //   delete params["filter.name.$ilike:"];

  //   let name = params["search"];
  //   this.comerClientsService.getAllClient(params, name).subscribe({
  //     next: response => {
  //       this.clientItems = new DefaultSelect(response.data, response.count);
  //     },
  //     error: err => {
  //       this.clientItems = new DefaultSelect();
  //     },
  //   })
  // }

  getClients(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('id', lparams.text, SearchFilter.EQ);
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('NO');

        params.addFilter('reasonName', lparams.text, SearchFilter.ILIKE);
        // params.addFilter('cve_banco', lparams.text);
      }

    this.comerClientsService.getAll_(params.getParams()).subscribe({
      next: data => {
        console.log('EVENT', data);
        let result = data.data.map(async (item: any) => {
          item['idAndName'] = item.id + ' - ' + item.reasonName;
        });

        Promise.all(result).then(resp => {
          this.clientItems = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.clientItems = new DefaultSelect();
      },
    });
  }

  selectEvent(event: any) {
    this.selectedEvent = event;
  }

  selectBatch(batch: any) {
    this.selectedBatch = batch;
  }

  selectClient(client: any) {
    this.selectedClient = client;
  }

  generateCl() {
    this.clColumns = this.clTestData;
    this.totalItems = this.clColumns.length;
    this.directAdjudicationTabs.tabs[2].active = true;
  }

  cleanForm() {
    this.adjudicationForm.reset();
    this.paramsForm.reset();
    this.clColumns = [];
    this.totalItems = 0;
    // this.getEvents({ page: 1, text: '' });
    // this.getBatches({ page: 1, text: '' });
    // this.getClients({ page: 1, text: '' });
    this.selectedEvent = null;
    this.selectedBatch = null;
    this.selectedClient = null;
  }

  //-------------Btn Elimina Adjudicación--------->

  deleteAdjudication() {
    const { licitacionNumber } = this.licitacionForm.value;
    const { percentPoints, moratoriumDays, event, batchId } =
      this.paramsForm.value;
    let LV_PROCESO = 1;
    if (event == null) {
      this.alert('error', 'Error', 'El parámetro Evento es un valor requerido');
      LV_PROCESO = 0;
      return;
    } else if (batchId == null) {
      this.alert(
        'error',
        'Error',
        'El parámetro Lote Público es un valor requerido'
      );
      LV_PROCESO = 0;
      return;
    } else {
      this.alertQuestion(
        'question',
        '¿Esta seguro de Eliminar la adjudicación directa del evento ' + event,
        '',
        'Eliminar'
      ).then(question => {
        if (question.isConfirmed) {
          // Eliminar adjudicacion
          //Falta Integrar la función
          let params = {
            eventId: event,
            publicLot: batchId,
          };
          this.biddingService.postDeleteBidding(params).subscribe({
            next: response => {
              console.log('Eliminar Adjudicacion', response);
              if (response.message.includes('Se eliminó la Adjudicación')) {
                this.alert('success', 'Eliminación Exitosa', response.message);
                this.cleanForm();
              } else {
                this.alert('warning', 'Alerta!', response.message);
              }
            },
          });
        }
      });
    }
  }

  getuser() {
    let token = this.authService.decodeToken();
    this.user = token.username.toUpperCase();
    console.log('User: ', token);
    this.delegation = token.department.toUpperCase();
  }

  //---------------BTN Genera Adjudicación-------------->

  generarAdjudicacion() {
    const {
      event,
      batchId,
      advancePercent,
      partialityQuantity,
      clientId,
      saleAmount,
    } = this.paramsForm.value;
    let LV_PROCESO = 1;
    if (event == null) {
      this.alert('error', 'Error', 'El parámetro Evento es un valor requerido');
      LV_PROCESO = 0;
      return;
    } else if (batchId == null) {
      this.alert(
        'error',
        'Error',
        'El parámetro Lote Público es un valor requerido'
      );
      LV_PROCESO = 0;
      return;
    } else if (advancePercent == null) {
      this.alert(
        'error',
        'Error',
        'El parámetro Porcentaje de Anticipo es un valor requerido'
      );
      LV_PROCESO = 0;
      return;
    } else if (partialityQuantity == null) {
      this.alert(
        'error',
        'Error',
        'El parámetro Número de Parcialidades es un valor requerido'
      );
      LV_PROCESO = 0;
      return;
    } else if (clientId == null) {
      this.alert(
        'error',
        'Error',
        'El valor del parámetro Cliente es un valor obligatorio para Genera Licitación'
      );
      LV_PROCESO = 0;
      return;
    } else {
      this.comerClientsService.getClientEventId(clientId).subscribe({
        next: response => {
          if (saleAmount == null) {
            this.alert(
              'error',
              'Error',
              'El parámetro Monto de Venta es un valor requerido'
            );
            LV_PROCESO = 0;
            return;
          } else {
            if (saleAmount < 0) {
              this.alert(
                'error',
                'Error',
                'El parámetro Monto de Venta debe ser mayor de cero'
              );
              LV_PROCESO = 0;
              return;
            } else {
              this.alertQuestion(
                'info',
                '¿Esta seguro de generar de la adjudicación directa del evento ' +
                  event +
                  ' y lote ' +
                  batchId +
                  ' ¿Deseas continuar?',
                '',
                'Aceptar',
                'Cancelar'
              ).then(res => {
                console.log(res);
                if (res.isConfirmed) {
                  let params = {
                    pEventId: event,
                    pPublicLot: Number(batchId),
                    pNewAmount: saleAmount,
                    pAdvancedPercent: advancePercent,
                    pPartializations: partialityQuantity,
                    pCustomerId: clientId,
                  };
                  this.biddingService
                    .postGenerateBiddingGood(params)
                    .subscribe({
                      next: response => {
                        console.log('Bidding Service ', response);
                        //this.licitacionForm.get('licitacionNumber').patchValue()
                        if (response == 1) {
                          this.alert(
                            'success',
                            'Exitoso!',
                            'Se genero la Adjuducación directa correctamente'
                          );
                        }
                      },
                    });
                }
              });
            }
          }
        },
        error: err => {
          this.alert('error', 'Error', 'El numero de Cliente no es valido');
          LV_PROCESO = 0;
        },
      });
    }
  }

  //---------------BTN Actualiza Adjudicación-------------->

  updateAdjudication() {
    const {
      event,
      batchId,
      advancePercent,
      partialityQuantity,
      clientId,
      saleAmount,
    } = this.paramsForm.value;
    let LV_PROCESO = 1;
    if (event == null) {
      this.alert('error', 'Error', 'El parámetro Evento es un valor requerido');
      LV_PROCESO = 0;
      return;
    } else if (batchId == 1) {
      this.alert(
        'error',
        'Error',
        'El parámetro Lote Público es un valor requerido'
      );
      LV_PROCESO = 0;
      return;
    } else {
      this.alertQuestion(
        'info',
        '¿Esta seguro de realizar la Autorización de la adjudicación directa del evento ' +
          event +
          '? ¿Deseas continuar?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          let params = {
            eventId: event,
            publicLot: batchId,
          };
          this.biddingService.postAutorizeTender(params).subscribe({
            next: response => {
              this.alert(
                'success',
                'Adjudicación exitosa',
                'Se realizó la autorización de la adjudicación exitosamente'
              );
              this.getBidding();
            },
          });
        }
      });
    }
  }

  //---------------BTN Genera Linea Captura-------------->

  generateCaptureLine() {
    let LV_PROCESO = 1;
    let LV_TIPO_MSG: any;
    const { licitacionNumber } = this.licitacionForm.value;
    const { percentPoints, moratoriumDays } = this.paramsForm.value;

    if (licitacionNumber == null) {
      this.alert('error', 'Error', 'El Id. Licitación es un valor requerido');
      LV_PROCESO = 0;
      return;
    } else if (percentPoints == null) {
      this.alert(
        'error',
        'Error',
        'El parámetro Puntos Porcentuales es un valor requerido'
      );
      LV_PROCESO = 0;
      return;
    } else {
      let params = {
        biddingId: licitacionNumber,
        percentagePoints: percentPoints,
        moratoriumDays: moratoriumDays,
        user: this.user,
      };
      this.biddingService.postGenerateLineCap(params).subscribe({
        next: response => {
          console.log('response => ', response);
          this.alert(
            'success',
            'Generación exitosa',
            'Linea de Captura Generada existosamente'
          );
          this.getBidding();
        },
      });
    }
  }

  //---------------BTN Intereses Moratorios-------------->

  defaultInterests() {
    const { event } = this.adjudicationForm.value;
    const { licitacionNumber } = this.licitacionForm.value;
    const { percentPoints, moratoriumDays, paymentNumber } =
      this.paramsForm.value;
    console.log(
      'percentPoints ',
      this.paramsForm.get('percentPoints').value,
      percentPoints
    );
    let LV_PROCESO = 1;
    if (event == null) {
      this.alert(
        'error',
        'Error',
        'El número de Evento de Adjudicaciones no puede ser vacio'
      );
      LV_PROCESO = 0;
      return;
    } else if (licitacionNumber == null) {
      this.alert(
        'error',
        'Error',
        'El número de Licitacion no puede ser vacio'
      );
      LV_PROCESO = 0;
      return;
    } else if (moratoriumDays == null) {
      this.alert(
        'error',
        'Error',
        'Los días moratorios de parámetros no puede ser vacio'
      );
      LV_PROCESO = 0;
      return;
    } else if (percentPoints == null) {
      this.alert(
        'error',
        'Error',
        'Los puntos porcentuales de parámetros no puede ser vacio'
      );
      LV_PROCESO = 0;
      return;
    } else if (paymentNumber == null) {
      this.alert(
        'error',
        'Error',
        'El número de pago de parámetros no puede ser vacio'
      );
      LV_PROCESO = 0;
      return;
    } else {
      this.alertQuestion(
        'info',
        '¿Esta seguro de calcular los intereses moratorios para la adjudicación directa ' +
          event +
          '? ¿Deseas continuar?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          let params = {
            biddingId: licitacionNumber,
            payId: paymentNumber,
            percentagePoints: percentPoints,
            moratoriumDays: moratoriumDays,
          };
          this.biddingService.postRecalculateLineCap(params).subscribe({
            next: response => {
              console.log('respuesta de reacalculateLineCap -->', response);
              if (response.message.includes('El número de pago')) {
                console.log('respuesta --> sientra en el if ');
                this.alert('error', 'Error', 'El número de pago no existe');
                this.paramsForm.get('paymentNumber').reset();
              } else {
                let id = this.licitacionForm.get('licitacionNumber').value;
                this.getTender(id);
                this.alert(
                  'success',
                  'Exitoso',
                  'Se calcularon los intereses moratorios correctamente'
                );
              }
            },
          });
        }
      });
    }
  }

  //--------------PRIMER BLOQUE--------------//

  getBidding() {
    let id = this.licitacionForm.get('licitacionNumber').value;
    this.biddingService.getBigging(id).subscribe({
      next: response => {
        this.getTender(id);
        console.log('response licitacionNumber ', response);
        this.adjudicationForm.patchValue({
          exemptSP: response.data[0].taxSaleExempt,
          exemptAdv: response.data[0].taxAdvanceExempt,
          exemptBal: response.data[0].taxExemptBalance,
          engravedSP: response.data[0].taxSaleTaxed,
          engravedAdv: response.data[0].taxAdvanceTaxed,
          engravedBal: response.data[0].taxTaxedBalance,
          taxSP: response.data[0].taxSaleIva,
          taxAdv: response.data[0].taxAdvanceIva,
          taxBal: response.data[0].taxIvaBalance,
        });
        let params = {
          eventId: response.data[0].eventId,
          publicLot: response.data[0].lotId,
          salesTaxExempt: response.data[0].taxSaleExempt,
          impTaxedSale: response.data[0].taxSaleTaxed,
          impIvaSale: response.data[0].taxSaleIva,
          advanceTaxExempt: response.data[0].taxAdvanceExempt,
          impTaxedAdvance: response.data[0].taxAdvanceTaxed,
          impAdvanceVat: response.data[0].taxAdvanceIva,
          impBalanceExempt: response.data[0].taxExemptBalance,
          impBalanceTaved: response.data[0].taxTaxedBalance,
          impBalanceVat: response.data[0].taxIvaBalance,
        };
        this.statusDispService.validBidding(params).subscribe({
          next: respon => {
            console.log('respuesta del postQuery ', respon);
            //---Evento
            this.adjudicationForm
              .get('event')
              .setValue(response.data[0].eventId);
            this.selectedEvent = {
              id: response.data[0].eventId,
              cve: respon.processCve,
              type: respon.type,
              status: respon.eventStatus,
              observations: respon.observations,
            };
            //----Lote
            this.adjudicationForm
              .get('batchId')
              .setValue(response.data[0].publicLot);
            this.selectedBatch = {
              id: response.data[0].publicLot,
              description: respon.description,
            };
            this.adjudicationForm.patchValue({
              clientId: respon.customerId,
            });
            this.selectedClient = {
              id: respon.customerId,
              name: respon.reasonName,
              rfc: respon.rfc,
              blacklisted: respon.blackList,
            };
            this.adjudicationForm
              .get('partialityQuantity')
              .patchValue(respon.advancePercentage);
            this.adjudicationForm.patchValue({
              subtotalSP: respon.mSubtotalSale,
              subtotalAdv: respon.mSubtotalAdvance,
              subtotalBal: respon.mSubtotalBalance,
              totalSP: respon.mTotalSale,
              totalAdv: respon.mTotalAdvance,
              totalBal: respon.mTotalBalance,
            });
          },
        });
      },
      error: err => {
        this.alert('error', 'Error', 'No se encuentra la licitación');
        this.licitacionForm
          .get('licitacionNumber')
          .setErrors({ customErrorKey: true });
      },
    });
  }

  //--------------SEGUNDO BLOQUE--------------//

  getTender(id: any) {
    this.biddingService.getComerTender(id).subscribe({
      next: response => {
        console.log('Response Comer Tender ', response);
        const Real =
          response.data[0].programmedDate != null
            ? new Date(response.data[0].programmedDate)
            : null;
        const formattedfecReal = Real != null ? this.formatDate(Real) : null;

        const Ref =
          response.data[0].generatesRefDate != null
            ? new Date(response.data[0].generatesRefDate)
            : null;
        const formattedfecRef = Ref != null ? this.formatDate(Ref) : null;

        this.clTestData = [
          {
            paymentId: response.data[0].paymentId,
            scheduledDate: formattedfecReal,
            icbExempt: response.data[0].exemptBalanceImp,
            icbEngraved: response.data[0].encumberedBalanceImp,
            nominalRate: response.data[0].nominalRate,
            daysYear: response.data[0].fiscalYearDays,
            daysMonth: response.data[0].monthDays,
            interestExempt: response.data[0].exemptInterestImp,
            interestEngraved: response.data[0].encumberedInterestImp,
            interestTax: response.data[0].ivaInterestImp,
            ceExempt: response.data[0].expirationExemptImp,
            ceEngraved: response.data[0].expirationEncumberedImp,
            ceTax: response.data[0].expirationIvaImp,
            moratoriumExempt: response.data[0].moratoriumDays,
            moratoriumEngraved: response.data[0].moratoriumImp,
            moratoriumTax: response.data[0].moratoriumIvaImp,
            totalTax: response.data[0].totalIvaImp,
            totalAmount: response.data[0].totalPayImp,
            referenceDate: formattedfecRef,
            reference: response.data[0].reference,
            status: response.data[0].status,
          },
        ];
        this.generateCl();
      },
    });
  }

  //-------------------------

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }
}
