import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, of, takeUntil, tap } from 'rxjs';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
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

  ngOnInit() {}

  reloadLoteEvent(event: any) {
    console.log(event);
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
    console.log('Notificar');
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

  fillForm(event: any) {
    console.log(event);
    this.data = event;
    this.conceptNumber.setValue(event.conceptNumber);
    if (event.conceptNumber) {
      this.getParams(event.conceptNumber).subscribe({
        next: response => {
          this.dataService.updateOI.next(true);
        },
        error: err => {
          this.dataService.updateOI.next(true);
        },
      });
    }
    if (event.eventNumber) {
      this.eventNumber.setValue(event.eventNumber);
    }
    if (event.clkpv) {
      this.clkpv.setValue(event.clkpv);
    }
    if (event.lotNumber) {
      this.lotNumber.setValue(event.lotNumber);
    }
    if (event.descurcoord) {
      this.descurcoord.setValue(event.descurcoord);
    }
    this.paymentRequestNumber.setValue(event.paymentRequestNumber);
    this.idOrdinginter.setValue(event.idOrdinginter);
    this.folioAtnCustomer.setValue(event.folioAtnCustomer);
    this.dateOfResolution.setValue(
      event.dateOfResolution
        ? secondFormatDateToDate(event.dateOfResolution)
        : null
    );
    this.comment.setValue(event.comment);
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
      'lot/api/v1/eat-lots?filter.idStatusVta=PAG' +
      (this.eventNumber && this.eventNumber.value
        ? '&filter.idEvent=' + this.eventNumber.value
        : '')
    );
  }

  get pathProvider() {
    return 'interfaceesirsae/api/v1/supplier?sortBy=clkPv:ASC';
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
                    goodNumber: '524', //row.goodNumber,
                    type: 'U',
                    screenKey: 'FCOMER084',
                    conceptNumber: this.conceptNumber.value,
                  })
                  .pipe(
                    catchError(x => of(null)),
                    tap(x => console.log(x))
                  )
              );
              console.log(result);
              if (!result) {
                console.log('ERROR');
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
