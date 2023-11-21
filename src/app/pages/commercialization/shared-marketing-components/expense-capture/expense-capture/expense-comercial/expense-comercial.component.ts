import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  catchError,
  firstValueFrom,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IParameterMod } from 'src/app/core/models/ms-comer-concepts/parameter-mod.model';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ParametersModService } from 'src/app/core/services/ms-commer-concepts/parameters-mod.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { EventAppService } from 'src/app/core/services/ms-event/event-app.service';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared';
import { secondFormatDateToDate } from 'src/app/shared/utils/date';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';
import { ExpenseGoodProcessService } from '../../services/expense-good-process.service';
import { ExpenseLotService } from '../../services/expense-lot.service';
import { ExpenseModalService } from '../../services/expense-modal.service';
import { ExpenseScreenService } from '../../services/expense-screen.service';
import { SpentIService } from '../../services/spentI.service';
import { SpentMService } from '../../services/spentM.service';
import { NotifyComponent } from '../notify/notify.component';
import { COLUMNS } from './columns';
import { NotLoadedsModalComponent } from './not-loadeds-modal/not-loadeds-modal.component';

@Component({
  selector: 'app-expense-comercial',
  templateUrl: './expense-comercial.component.html',
  styleUrls: ['./expense-comercial.component.scss'],
})
export class ExpenseComercialComponent extends BasePage implements OnInit {
  // params
  @Input() address: string;
  errorsClasification: any[] = [];
  addressEvent: string;
  provider: string;
  //
  toggleInformation = true;
  reloadLote = false;
  reloadConcepto = false;
  ilikeFilters = [
    'attachedDocumentation',
    'comment',
    'nomEmplAuthorizes',
    'nomEmplRequest',
    'nomEmplcapture',
    'providerName',
    'usu_captura_siab',
  ];
  dateFilters = [
    'captureDate',
    'invoiceRecDate',
    'payDay',
    'captureDate',
    'fecha_contrarecibo',
    'spDate',
    'dateOfResolution',
  ];
  columns: any;
  user: any;
  constructor(
    private dataService: ExpenseCaptureDataService,
    private spentMService: SpentMService,
    private spentIService: SpentIService,
    private spentService2: SpentService,
    private comerEventService: ComerEventosService,
    private screenService: ExpenseScreenService,
    private modalService: BsModalService,
    private parameterModService: ParametersModService,
    private sirsaeService: InterfacesirsaeService,
    private documentService: DocumentsService,
    private expenseGoodProcessService: ExpenseGoodProcessService,
    private authService: AuthService,
    private segAccessAreaService: SegAcessXAreasService,
    private lotService: ExpenseLotService,
    private eventService: EventAppService,
    private expenseModalService: ExpenseModalService,
    private parameterService: ParametersConceptsService
  ) {
    super();
    this.user = this.authService.decodeToken();
    const filterParams = new FilterParams();
    filterParams.addFilter('user', this.user.preferred_username);
    this.segAccessAreaService
      .getAll(filterParams.getParams())
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response) {
            const data = response.data;
            if (data && data.length > 0) {
              this.delegation = data[0].delegationNumber;
              this.subDelegation = data[0].subdelegationNumber;
              this.noDepartamento = data[0].departamentNumber;
            }
          }
        },
      });
    // console.log(user);
    this.prepareForm();
  }

  get delegation() {
    return this.dataService.delegation;
  }

  set delegation(value) {
    this.dataService.delegation = value;
  }

  get subDelegation() {
    return this.dataService.subDelegation;
  }

  set subDelegation(value) {
    this.dataService.subDelegation = value;
  }

  get noDepartamento() {
    return this.dataService.noDepartamento;
  }

  set noDepartamento(value) {
    this.dataService.noDepartamento = value;
  }

  private getBody() {
    console.log(this.form.value.dateOfResolution);

    return {
      ...this.form.value,
      amount: this.dataService.amount ?? 0,
      vat: this.dataService.vat ?? 0,
      vatWithheld: this.dataService.vatWithholding ?? 0,
      address: this.addressEvent ?? this.address,
      dateOfResolution: this.form.value.dateOfResolution
        ? (this.form.value.dateOfResolution + '').trim().length > 0
          ? this.form.value.dateOfResolution
          : null
        : null,
      invoiceRecDate: this.form.value.invoiceRecDate
        ? (this.form.value.invoiceRecDate + '').trim().length > 0
          ? this.form.value.invoiceRecDate
          : null
        : null,
      payDay: this.form.value.payDay
        ? (this.form.value.payDay + '').trim().length > 0
          ? this.form.value.payDay
          : null
        : null,
      captureDate: this.form.value.captureDate
        ? (this.form.value.captureDate + '').trim().length > 0
          ? this.form.value.captureDate
          : null
        : null,
      fecha_contrarecibo: this.form.value.fecha_contrarecibo
        ? this.form.value.fecha_contrarecibo.trim().length > 0
          ? this.form.value.fecha_contrarecibo
          : null
        : null,
      comment: this.form.value.comment ?? '',
      monthExpense: this.form.value.monthExpense ? '1' : null,
      monthExpense2: this.form.value.monthExpense2 ? '2' : null,
      monthExpense3: this.form.value.monthExpense3 ? '3' : null,
      monthExpense4: this.form.value.monthExpense4 ? '4' : null,
      monthExpense5: this.form.value.monthExpense5 ? '5' : null,
      monthExpense6: this.form.value.monthExpense6 ? '6' : null,
      monthExpense7: this.form.value.monthExpense7 ? '7' : null,
      monthExpense8: this.form.value.monthExpense8 ? '8' : null,
      monthExpense9: this.form.value.monthExpense9 ? '9' : null,
      monthExpense10: this.form.value.monthExpense10 ? '10' : null,
      monthExpense11: this.form.value.monthExpense11 ? '11' : null,
      monthExpense12: this.form.value.monthExpense12 ? '12' : null,
    };
  }

  edit() {
    this.spentService2
      .edit(this.getBody())
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.alert(
            'success',
            'Se ha actualizado el gasto ' + this.expenseNumber.value,
            'Gasto actualizado correctamente'
          );
          this.fillForm({
            ...this.data,
            ...this.form.value,
            amount: this.dataService.amount ?? 0,
            vat: this.dataService.vat ?? 0,
            vatWithheld: this.dataService.vatWithholding ?? 0,
            address: this.addressEvent ?? this.address,
          });
          // if (response && response.data) {
          //   this.alert(
          //     'success',
          //     'Captura de Gastos',
          //     'Gasto actualizado correctamente'
          //   );
          // }
        },
        error: err => {
          this.alert(
            'error',
            'No se pudo actualizar el gasto ' + this.expenseNumber.value,
            'Favor de verificar'
          );
        },
      });
  }

  save() {
    if (this.expenseNumber.value) {
      this.edit();
    } else {
      this.spentService2
        .save(this.getBody())
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.alert('success', 'Se ha creado el gasto correctamente', '');
            this.expenseNumber.setValue(response.data.expenseNumber);
            this.fillForm({
              ...this.data,
              ...this.form.value,
              amount: this.dataService.amount ?? 0,
              vat: this.dataService.vat ?? 0,
              vatWithheld: this.dataService.vatWithholding ?? 0,
              address: this.addressEvent ?? this.address,
            });
            // if (response && response.data) {
            //   this.alert(
            //     'success',
            //     'Captura de Gastos',
            //     'Gasto creado correctamente'
            //   );
            // }
          },
          error: err => {
            this.alert(
              'error',
              'No se pudo crear el gasto',
              'Favor de verificar'
            );
          },
        });
    }
  }

  get spentService() {
    return this.address
      ? this.address === 'M'
        ? this.spentMService
        : this.spentIService
      : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['address'] && changes['address'].currentValue) {
      const list = [{ value: 'C', title: 'GENERAL' }];
      if (changes['address'].currentValue === 'M') {
        list.push({ value: 'M', title: 'MUEBLES' });
      }
      if (changes['address'].currentValue === 'I') {
        list.push({ value: 'I', title: 'INMUEBLES' });
      }
      this.columns = {
        ...COLUMNS,
        address: {
          ...COLUMNS.address,
          filter: {
            type: 'list',
            config: {
              selectText: 'Seleccionar',
              list,
            },
          },
        },
      };
    }
  }

  get data() {
    return this.dataService.data;
  }

  set data(value) {
    this.dataService.data = value;
  }

  get form() {
    return this.dataService.form;
  }

  get expenseNumber() {
    return this.form.get('expenseNumber');
  }

  get conceptNumber() {
    return this.form.get('conceptNumber');
  }
  get paymentRequestNumber() {
    return this.form.get('paymentRequestNumber');
  }

  get idOrdinginter() {
    return this.form.get('idOrdinginter');
  }

  get eventNumber() {
    return this.form.get('eventNumber');
  }
  get lotNumber() {
    return this.form.get('lotNumber');
  }
  get folioAtnCustomer() {
    return this.form.get('folioAtnCustomer');
  }

  get dateOfResolution() {
    return this.form.get('dateOfResolution');
  }

  get payDay() {
    return this.form.get('payDay');
  }

  get fecha_contrarecibo() {
    return this.form.get('fecha_contrarecibo');
  }

  get formPayment() {
    return this.form.get('formPayment');
  }

  get comproafmandsae() {
    return this.form.get('comproafmandsae');
  }

  get clkpv() {
    return this.form.get('clkpv');
  }

  get descurcoord() {
    return this.form.get('descurcoord');
  }

  get comment() {
    return this.form.get('comment');
  }

  get invoiceRecNumber() {
    return this.form.get('invoiceRecNumber');
  }

  ngOnInit() {
    this.lotNumber.valueChanges.subscribe({
      next: response => {
        console.log(response);
        if (response) {
          this.nextItemLote();
        }
      },
    });
    // this.expenseModalService.selectedMotivesSubject.subscribe({
    //   next: response => {
    //     console.log(response);
    //   },
    // });
  }

  updateProvider(event: any) {
    console.log(event);
    this.provider = event.pvName;
  }

  reloadLoteEvent(event: any) {
    console.log(event);
    if (event)
      this.comerEventService
        .getMANDXEVENTO(event.id)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            if (response && response.data) {
              if (response.data.event > 0) {
                this.eventNumber.setValue(null);
                this.alert(
                  'error',
                  'Evento',
                  'Contiene bienes de más de un mandato verifique'
                );
              }
            }
          },
        });
    setTimeout(() => {
      this.reloadLote = !this.reloadLote;
    }, 500);
  }

  getParams(id: string) {
    return this.dataService.readParams(id);
  }

  async notify() {
    // console.log('Notificar');
    if (!this.expenseNumber) {
      this.alert(
        'warning',
        'No puede mandar correo si no a guardado el gasto',
        ''
      );
      return;
    }
    // const firstValidation =
    //   !this.conceptNumber.value &&
    //   !this.eventNumber.value &&
    //   !this.clkpv.value &&
    //   !this.dataService.dataCompositionExpenses[0].goodNumber &&
    //   !this.dataService.data.providerName;
    if (
      !this.conceptNumber.value &&
      !this.eventNumber.value &&
      !this.clkpv.value &&
      !this.dataService.dataCompositionExpenses[0].goodNumber &&
      !this.dataService.data.providerName
    ) {
      this.alert('warning', 'Tiene que llenar alguno de los campos', '');
      return;
    }
    if (!this.dataService.FOLIO_UNIVERSAL) {
      this.alert('warning', 'No se han escaneado los documentos', '');
      return;
    }
    let filterParams = new FilterParams();
    filterParams.addFilter(
      'id',
      this.dataService.FOLIO_UNIVERSAL,
      SearchFilter.EQ
    );
    filterParams.addFilter(
      'associateUniversalFolio',
      this.dataService.FOLIO_UNIVERSAL,
      SearchFilter.OR
    );
    filterParams.addFilter('sheets', 0, SearchFilter.GT);
    filterParams.addFilter('scanStatus', 'ESCANEADO', SearchFilter.ILIKE);
    let documents = await firstValueFrom(
      this.documentService.getAll().pipe(
        take(1),
        catchError(x => of({ data: null, message: x })),
        map(x => {
          if (!x.data) {
            this.alert('error', 'No a escaneado los documentos', '');
          }
          return x.data;
        })
      )
    );
    if (!documents) {
      return;
    }
    this.expenseGoodProcessService
      .NOTIFICAR({
        goodArray: this.dataService.dataCompositionExpenses
          .filter(x => x.goodNumber)
          .map(x => {
            return { goodNumber: +x.goodNumber };
          }),
        delegationNumber: this.delegation,
        subdelegationNumber: this.subDelegation,
        departamentNumber: this.noDepartamento,
        universalFolio: this.dataService.FOLIO_UNIVERSAL,
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          let config: ModalOptions = {
            initialState: {
              asunto: 'Cancelación de Venta ' + this.provider,
              // message,
              // action,
              // proceeding: this.proceedingForm.value,
              callback: (next: boolean) => {
                if (next) {
                  // const id = this.controls.keysProceedings.value;
                  // this.findProceeding(id).subscribe();
                }
              },
            },
            class: 'modal-lg modal-dialog-centered',
            ignoreBackdropClick: true,
          };
          this.modalService.show(NotifyComponent, config);
        },
        error: err => {
          this.alert('error', 'No se ha guardado el folio de escaneo', '');
        },
      });
  }

  private getParamValConcept(conceptNumber: number) {
    const filterParams = new FilterParams();
    filterParams.addFilter('parameter', 'VAL_CONCEPTO');
    filterParams.addFilter('value', conceptNumber);
    return firstValueFrom(
      this.parameterModService.getAllFilter(filterParams.getParams()).pipe(
        take(1),
        catchError(x => {
          return of(null);
        }),
        map(x => x && x.data && x.data.length > 0)
      )
    );
  }

  private URCOORDREGCHATARRA_AUTOMATICO(opcion: number) {
    return this.eventService.urcoordRegChatarraAutomatic(
      this.conceptNumber.value,
      opcion
    );
  }

  private CARGA_BIENES_LOTE_XDELRES(
    v_id_evento: number,
    v_id_lote: number,
    id_concepto: number
  ) {
    this.lotService
      .CARGA_BIENES_LOTE_DELRES({
        v_id_evento,
        v_id_lote,
        id_concepto,
        cve_pantalla: 'FCOMER084',
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response) {
            console.log(response);
            this.alert('success', 'Se han cargado los Bienes del lote', '');
            this.dataService.updateExpenseComposition.next(true);
          }
        },
        error: err => {
          this.alert(
            'warning',
            'No se pudieron cargar los bienes del lote',
            'Favor de verificar'
          );
        },
      });
  }

  private CARGA_BIENES_LOTE(pEventId: number, pBatchId: number) {
    this.lotService
      .CARGA_BIENES_LOTE({
        pEventId,
        pBatchId,
        pConceptoId: this.conceptNumberValue,
        pScreen: 'FCOMER084',
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response) {
            console.log(response);
            this.alert('success', 'Se han cargado los Bienes del lote', '');
            this.dataService.updateExpenseComposition.next(true);
          }
        },
        error: err => {
          this.alert(
            'warning',
            'No se pudieron cargar los bienes del lote',
            'Favor de verificar'
          );
        },
      });
  }

  get PVALIDADET() {
    return this.dataService.PVALIDADET;
  }

  async nextItemLote() {
    if (this.PVALIDADET === 'S') {
      const V_EXIST = await this.getParamValConcept(this.conceptNumber.value);
      console.log(V_EXIST);
      if (V_EXIST) {
        // console.log(V_EXIST);
        let coordChatarra = await firstValueFrom(
          this.URCOORDREGCHATARRA_AUTOMATICO(3)
        );
        console.log(coordChatarra);

        this.CARGA_BIENES_LOTE_XDELRES(
          this.eventNumber.value,
          this.lotNumber.value,
          this.conceptNumber.value
        );
      } else {
        this.CARGA_BIENES_LOTE(this.eventNumber.value, this.lotNumber.value);
      }
      if (this.dataService.V_BIEN_REP_ROBO > 0) {
        this.dataService.PB_VEHICULO_REP_ROBO_DISPLAYED = true;
        this.dataService.PB_VEHICULO_REP_ROBO_ENABLED = true;
        this.dataService.SELECT_CAMBIA_CLASIF_DISPLAYED = true;
        this.dataService.SELECT_CAMBIA_CLASIF_ENABLED = true;
      }
    }
  }

  private validPayments(event: IComerExpense) {
    return firstValueFrom(
      this.sirsaeService
        .validPayments({
          pClkpv: this.clkpv.value,
          pComment: this.comment.value,
          pPayAfmandSae: this.comproafmandsae.value,
          pNumberVoucher: this.form.get('numReceipts').value,
          pDocumentationAnexa: this.form.get('attachedDocumentation').value,
          pUserCapture: this.form.get('capturedUser').value,
          pUserAuthorize: this.form.get('authorizedUser').value,
          pUserRequest: this.form.get('requestedUser').value,
          pFormPay: this.form.get('formPayment').value,
          pEventId: this.eventNumber.value,
          pLotePub: this.lotNumber.value,
        })
        .pipe(catchError(x => of({ data: false, message: x })))
    );
  }

  private async fillOthersParameters() {
    const filterParams = new FilterParams();
    filterParams.addFilter('parameter', 'CHCONIVA,IVA', SearchFilter.IN);
    return firstValueFrom(
      this.parameterModService.getAll(filterParams.getParams()).pipe(
        take(1),
        catchError(x => of({ data: [] as IParameterMod[], message: x })),
        map(response => {
          let data = response.data;
          let success;
          if (data.length > 0) {
            this.dataService.CHCONIVA = data[0].value;
            this.dataService.IVA = data[1].value ? +data[1].value / 100 : 0;
            success = true;
          } else {
            this.dataService.CHCONIVA = null;
            this.dataService.IVA = 0;
            success = false;
          }
          if (this.dataService.CHCONIVA === null)
            this.alert('warning', 'No tiene parámetro CHCONIVA', '');
          if (this.dataService.IVA === 0)
            this.alert('warning', 'No tiene parámetro IVA', '');
          return success;
        })
      )
    );
  }

  private validatePaymentCamps(event: IComerExpense) {
    if (!event.clkpv) {
      this.alert('warning', 'Validación de pagos', 'Requiere proveedor');
      return false;
    }
    if (!event.comment) {
      this.alert('warning', 'Validación de pagos', 'Requiere servicio');
      return false;
    }
    if (!event.conceptNumber) {
      this.alert('warning', 'No cuenta con un concepto de pago', '');
      return false;
    }
    if (!event.numReceipts) {
      this.alert('warning', 'No cuenta con un número de comprobantes', '');
      return false;
    }
    if (!event.comproafmandsae) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere comprobantes a nombre'
      );
      return false;
    }
    if (!event.attachedDocumentation) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere documentación anexa'
      );
      return false;
    }
    if (!event.capturedUser) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere usuario de captura'
      );
      return false;
    }
    if (!event.authorizedUser) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere usuario que autoriza'
      );
      return false;
    }
    if (!event.requestedUser) {
      this.alert(
        'warning',
        'Validación de pagos',
        'Requiere usuario que solicita'
      );
      return false;
    }
    if (!event.formPayment) {
      this.alert('warning', 'Validación de pagos', 'Requiere Forma de Pago');
      return false;
    }
    if (!event.eventNumber) {
      this.alert('warning', 'Validación de pagos', 'Requiere número de evento');
      return false;
    }
    if (!event.lotNumber) {
      this.alert('warning', 'Validación de pagos', 'Requiere número de lote');
      return false;
    }
    return true;
  }

  async fillForm(event: IComerExpense) {
    console.log(event);
    this.data = event;
    this.addressEvent = event.address;
    this.paymentRequestNumber.setValue(event.paymentRequestNumber);
    this.idOrdinginter.setValue(event.idOrdinginter);
    this.folioAtnCustomer.setValue(event.folioAtnCustomer);
    this.dateOfResolution.setValue(
      event.dateOfResolution
        ? event.dateOfResolution.trim().length > 0
          ? secondFormatDateToDate(event.dateOfResolution)
          : null
        : null
    );
    this.comment.setValue(event.comment);
    this.conceptNumber.setValue(event.conceptNumber);
    this.eventNumber.setValue(event.eventNumber);
    this.lotNumber.setValue(event.lotNumber);
    this.clkpv.setValue(event.clkpv);
    setTimeout(async () => {
      if (!event.descurcoord) {
        this.alert('warning', 'No se cuenta con coordinación regional', '');
      }
      this.descurcoord.setValue(event.descurcoord);
      if (!this.validatePaymentCamps(event)) {
        return;
      }
      const responsePayments = await this.validPayments(event);
      // console.log(responsePayments);
      if (responsePayments.message[0] !== 'OK') {
        this.alert(
          'error',
          'Sucedió un error en la validación de pagos',
          'Favor de verificar'
        );
        return;
      }
      this.dataService.V_VALCON_ROBO = await firstValueFrom(
        this.screenService.PUF_VAL_CONCEP_ROBO(event.conceptNumber)
      );

      const responseParams = await this.getParams(event.conceptNumber);
      if (!responseParams) {
        return;
      }
      const otherParams = await this.fillOthersParameters();
      // if (!otherParams) {
      //   return;
      // }

      this.dataService.updateOI.next(true);
      this.dataService.updateExpenseComposition.next(true);
      this.dataService.updateFolio.next(true);
    }, 500);

    // this.reloadConcepto = !this.reloadConcepto;
  }

  private prepareForm() {
    this.dataService.prepareForm();
  }

  get pathComerExpenses() {
    return (
      'spent/api/v1/comer-expenses' +
      (this.address ? '?filter.address=$in:' + this.address + ',C' : 'C')
    );
  }

  get pathConcept() {
    return (
      'comerconcepts/api/v1/concepts/get-all' +
      (this.address ? '?filter.address=$in:' + this.address + ',C' : 'C')
    );
  }

  get pathEvent() {
    // return 'prepareevent/api/v1/comer-event/getProcess';
    return (
      'event/api/v1/comer-event?filter.eventTpId:$in:1,2,3,4,5,10' +
      (this.address ? '&filter.address=$eq:' + this.address : '')
    );
  }

  get pathLote() {
    return (
      'lot/api/v1/eat-lots' +
      (this.eventNumber && this.eventNumber.value
        ? '?filter.idEvent=' + this.eventNumber.value
        : '')
    );
  }

  get pathProvider() {
    return (
      'interfaceesirsae/api/v1/supplier' +
      (this.clkpv && this.clkpv.value
        ? '?filter.clkPv=$eq:' + this.clkpv.value + '&sortBy=clkPv:ASC'
        : '?sortBy=clkPv:ASC')
    );
  }

  get dataCompositionExpenses() {
    return this.dataService.dataCompositionExpenses;
  }

  get dataCompositionExpensesToUpdateClasif() {
    return this.dataCompositionExpenses
      ? this.dataCompositionExpenses.filter(
          row => row.reportDelit && row.reportDelit === true && row.goodNumber
        )
      : [];
  }

  get dataCompositionExpensesStatusChange() {
    return this.dataCompositionExpenses
      ? this.dataCompositionExpenses.filter(
          row => row.changeStatus && row.changeStatus === true && row.goodNumber
        )
      : [];
  }

  get conceptNumberValue() {
    return this.conceptNumber ? this.conceptNumber.value : null;
  }

  async sendToSIRSAE() {
    await this.dataService.updateByGoods(true);
  }

  validationForkJoin(obs: Observable<any>[]) {
    return obs ? (obs.length > 0 ? forkJoin(obs) : of([])) : of([]);
  }

  async updateClasif() {
    const VALIDA_DET = this.dataCompositionExpensesToUpdateClasif;
    this.errorsClasification = [];
    if (VALIDA_DET.length === 0) {
      this.alert(
        'error',
        'Actualizar Clasificación a Reporte de Robo',
        'No se han seleccionado los bienes para realizar el cambio de clasificador a Vehiculo con Reporte de Robo'
      );
    } else {
      this.alertQuestion(
        'question',
        'Actualizar Clasificación',
        '¿Desea cambiar el clasificador de los bienes a Vehiculo con Reporte de Robo?'
      ).then(x => {
        if (x.isConfirmed) {
          let errors: any[] = [];
          forkJoin(
            VALIDA_DET.map(async row => {
              return this.screenService
                .PUP_VAL_BIEN_ROBO({
                  goodNumber: row.goodNumber,
                  type: 'U',
                  screenKey: 'FCOMER084',
                  conceptNumber: this.conceptNumber.value,
                })
                .pipe(
                  take(1),
                  catchError(x => of(null)),
                  tap(x => {
                    console.log(x);
                    if (x === null) {
                      // console.log('ERROR');
                      errors.push({ goodNumber: row.goodNumber });
                    }
                  })
                );
            })
          )
            .pipe(
              takeUntil(this.$unSubscribe),
              mergeMap(x => this.validationForkJoin(x))
            )
            .subscribe(x => {
              console.log(x);

              if (errors.length === 0) {
                this.alert(
                  'success',
                  'Cambio de Clasificación a Vehiculo con Reporte de Robo',
                  'Realizado correctamente'
                );
              }
              if (errors.length === VALIDA_DET.length) {
                this.alert(
                  'error',
                  'Registros no encontrados por clave pantalla y número de concepto',
                  ''
                );
              } else if (errors.length > 0) {
                this.alert(
                  'warning',
                  'Cambio de Clasificación a Vehiculo con Reporte de Robo',
                  'No todos los bienes pudieron cambiar su clasificador por no encontrarse en búsqueda por clave pantalla y número de concepto'
                );
              }
              this.errorsClasification = errors;
            });
        }
      });
    }
  }

  showNotLoads() {
    let config: ModalOptions = {
      initialState: {
        data: this.errorsClasification,
        dataTemp: this.errorsClasification,
        totalItems: this.errorsClasification.length,
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NotLoadedsModalComponent, config);
  }
}
