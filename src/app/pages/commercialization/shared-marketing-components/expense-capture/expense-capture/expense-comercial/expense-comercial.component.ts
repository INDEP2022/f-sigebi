import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  catchError,
  firstValueFrom,
  map,
  of,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ParametersModService } from 'src/app/core/services/ms-commer-concepts/parameters-mod.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { BasePage } from 'src/app/core/shared';
import { secondFormatDateToDate } from 'src/app/shared/utils/date';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';
import { ExpenseScreenService } from '../../services/expense-screen.service';
import { SpentIService } from '../../services/spentI.service';
import { SpentMService } from '../../services/spentM.service';
import { NotifyComponent } from '../notify/notify.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-expense-comercial',
  templateUrl: './expense-comercial.component.html',
  styleUrls: ['./expense-comercial.component.scss'],
})
export class ExpenseComercialComponent extends BasePage implements OnInit {
  // params
  @Input() address: string;

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
  constructor(
    private dataService: ExpenseCaptureDataService,
    private spentMService: SpentMService,
    private spentIService: SpentIService,
    private comerEventService: ComerEventosService,
    private screenService: ExpenseScreenService,
    private modalService: BsModalService,
    private parameterModService: ParametersModService,
    private sirsaeService: InterfacesirsaeService,
    private parameterService: ParametersConceptsService
  ) {
    super();
    this.prepareForm();
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

  get clkpv() {
    return this.form.get('clkpv');
  }

  get descurcoord() {
    return this.form.get('descurcoord');
  }

  get comment() {
    return this.form.get('comment');
  }

  ngOnInit() {
    this.lotNumber.valueChanges.subscribe({
      next: response => {
        if (response) {
          this.nextItemLote();
        }
      },
    });
  }

  reloadLoteEvent(event: any) {
    // console.log(event);
    if (event)
      this.comerEventService
        .getMANDXEVENTO(event)
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

  notify() {
    // console.log('Notificar');
    let config: ModalOptions = {
      initialState: {
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

  private URCOORDREGCHATARRA_AUTOMATICO(opcion: number) {}

  private CARGA_BIENES_LOTE_XDELRES(id_evento: number, id_lote: number) {}

  private CARGA_BIENES_LOTE(id_evento: number, id_lote: number) {}

  get PVALIDADET() {
    return this.dataService.PVALIDADET;
  }

  async nextItemLote() {
    if (this.PVALIDADET === 'S') {
      const V_EXIST = await this.getParamValConcept(this.conceptNumber.value);
      if (V_EXIST) {
        // console.log(V_EXIST);
        this.URCOORDREGCHATARRA_AUTOMATICO(3);
        this.CARGA_BIENES_LOTE_XDELRES(
          this.eventNumber.value,
          this.lotNumber.value
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
          pClkpv: event.clkpv,
          pComment: event.comment,
          pPayAfmandSae: event.comproafmandsae,
          pNumberVoucher: event.numReceipts,
          pDocumentationAnexa: event.attachedDocumentation,
          pUserCapture: event.capturedUser,
          pUserAuthorize: event.authorizedUser,
          pUserRequest: event.requestedUser,
          pFormPay: event.formPayment,
          pEventId: +event.eventNumber,
          pLotePub: +event.lotNumber,
        })
        .pipe(catchError(x => of({ data: false, message: x })))
    );
  }

  async fillForm(event: IComerExpense) {
    // console.log(event);
    this.data = event;
    if (!event.conceptNumber) {
      this.alert('warning', 'No cuenta con un concepto de pago', '');
      return;
    }
    this.conceptNumber.setValue(event.conceptNumber);
    const responsePayments = await this.validPayments(event);
    // console.log(responsePayments);
    if (responsePayments.message[0] !== 'OK') {
      this.alert('error', responsePayments.message[0], '');
      return;
    }
    if (!event.eventNumber) {
      this.alert('warning', 'No cuenta con un número de evento', '');
    }
    this.eventNumber.setValue(event.eventNumber);
    const responseParams = await firstValueFrom(
      this.getParams(event.conceptNumber)
    );
    if (!responseParams) {
      return;
    }
    if (!event.lotNumber) {
      this.alert('warning', 'No cuenta con un número de lote', '');
    }
    this.lotNumber.setValue(event.lotNumber);
    if (!event.clkpv) {
      this.alert('warning', 'No cuenta con un proveedor', '');
    }
    this.clkpv.setValue(event.clkpv);

    if (!event.descurcoord) {
      this.alert('warning', 'No cuenta con coordinación regional', '');
    }
    this.descurcoord.setValue(event.descurcoord);
    this.paymentRequestNumber.setValue(event.paymentRequestNumber);
    this.idOrdinginter.setValue(event.idOrdinginter);
    this.folioAtnCustomer.setValue(event.folioAtnCustomer);
    this.dateOfResolution.setValue(
      event.dateOfResolution
        ? secondFormatDateToDate(event.dateOfResolution)
        : null
    );
    this.comment.setValue(event.comment);

    this.dataService.updateOI.next(true);
    this.dataService.updateExpenseComposition.next(true);
    this.dataService.updateFolio.next(true);
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
    return 'interfaceesirsae/api/v1/supplier?filter.clkPv=$eq:45677&sortBy=clkPv:ASC';
  }

  get dataCompositionExpenses() {
    return this.dataService.dataCompositionExpenses;
  }

  get conceptNumberValue() {
    return this.conceptNumber ? this.conceptNumber.value : null;
  }

  async sendToSIRSAE() {
    await this.dataService.updateByGoods(true);
  }

  updateClasif() {
    const VALIDA_DET = this.dataCompositionExpenses.filter(
      row => row.changeStatus && row.changeStatus === true && row.goodNumber
    );

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
          let errors = [];
          this.dataCompositionExpenses.forEach(async row => {
            if (
              row.changeStatus &&
              row.changeStatus === true &&
              row.goodNumber
            ) {
              const result = await firstValueFrom(
                this.screenService
                  .PUP_VAL_BIEN_ROBO({
                    goodNumber: row.goodNumber,
                    type: 'U',
                    screenKey: 'FCOMER084',
                    conceptNumber: this.conceptNumber.value,
                  })
                  .pipe(
                    catchError(x => of(null)),
                    tap(x => {
                      // console.log(x)
                    })
                  )
              );
              // console.log(result);
              if (!result) {
                // console.log('ERROR');
                errors.push(row.goodNumber);
              } else {
                // if(result.message[0]){
                // }
              }
            }
          });
          if (errors.length > 0) {
            this.alert(
              'error',
              'Registros no encontrados por clave pantalla y número de concepto',
              ''
            );
          }
        }
      });
    }
  }
}
