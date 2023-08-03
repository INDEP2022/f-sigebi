import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IParameterConcept } from 'src/app/core/models/ms-comer-concepts/parameter-concept';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { BasePage } from 'src/app/core/shared';
import { secondFormatDateToDate } from 'src/app/shared/utils/date';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';

@Component({
  selector: 'app-expense-comercial',
  templateUrl: './expense-comercial.component.html',
  styleUrls: ['./expense-comercial.component.scss'],
})
export class ExpenseComercialComponent extends BasePage implements OnInit {
  // params
  @Input() address: string;
  PMONTOXMAND: string;
  PDEVCLIENTE: string;
  PCAMBIAESTATUS: string;
  PCONDIVXMAND: string;
  PCANVTA: string;
  P_MANDCONTIPO: string;
  PDEVPARCIAL: string;
  PCHATMORSINFLUJOPM: string;
  PCHATMORSINFLUJOPF: string;
  PCHATMORSINFLUJOPFSR: string;
  PCHATMORSINFLUJOPMSR: string;
  PCANFACT: string;
  PCREAFACT: string;
  VALBIEVEND: string;
  PNOENVIASIRSAE: string;
  PDEVPARCIALBIEN: string;
  PVALIDADET: string;
  //
  data: IComerExpense;
  toggleInformation = true;
  reloadLote = false;
  reloadConcepto = false;
  constructor(
    private dataService: ExpenseCaptureDataService,
    private parameterService: ParametersConceptsService
  ) {
    super();
    this.prepareForm();
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

  private resetParams() {
    this.PMONTOXMAND = 'N';
    this.PDEVCLIENTE = 'N';
    this.PCAMBIAESTATUS = 'N';
    this.PCONDIVXMAND = 'N';
    this.PCANVTA = 'N';
    this.P_MANDCONTIPO = 'N';
    this.PDEVPARCIAL = 'N';
    this.PCHATMORSINFLUJOPM = 'N';
    this.PCHATMORSINFLUJOPF = 'N';
    this.PCHATMORSINFLUJOPFSR = 'N';
    this.PCHATMORSINFLUJOPMSR = 'N';
    this.PCANFACT = 'N';
    this.PCREAFACT = 'N';
    this.VALBIEVEND = 'N';
    this.PNOENVIASIRSAE = 'N';
    this.PDEVPARCIALBIEN = 'N';
    this.PVALIDADET = 'N';
  }

  private fillParams(row: IParameterConcept) {
    if (row.parameter === 'MONTOXMAND') {
      this.PMONTOXMAND = row.value;
    }
    if (row.parameter === 'DEVXCLIENTE') {
      this.PDEVCLIENTE = row.value;
    }
    if (row.parameter === 'ESTATUS_NOCOMER') {
      this.PCAMBIAESTATUS = row.value;
    }
    if (row.parameter === 'CONDIVXMAND') {
      this.PCONDIVXMAND = row.value;
    }
    if (row.parameter === 'CANVTA') {
      this.PCANVTA = row.value;
    }
    if (row.parameter === 'MANDCONTXTIPO') {
      this.P_MANDCONTIPO = row.value;
    }
    if (row.parameter === 'DEVPARCIAL') {
      this.PDEVPARCIAL = row.value;
    }
    if (row.parameter === 'CHASINFLUJOPM') {
      this.PCHATMORSINFLUJOPM = row.value;
    }
    if (row.parameter === 'CHASINFLUJOPF') {
      this.PCHATMORSINFLUJOPF = row.value;
    }
    if (row.parameter === 'CHASINFLUJOPFSR') {
      this.PCHATMORSINFLUJOPFSR = row.value;
    }
    if (row.parameter === 'CHASINFLUJOPMSR') {
      this.PCHATMORSINFLUJOPMSR = row.value;
    }
    if (row.parameter === 'CANFACT') {
      this.PCANFACT = row.value;
    }
    if (row.parameter === 'CREAFACT') {
      this.PCREAFACT = row.value;
    }
    if (row.parameter === 'VALBIEVENSP') {
      this.VALBIEVEND = row.value;
    }
    if (row.parameter === 'ENVIASIRSAEMAND') {
      this.PNOENVIASIRSAE = row.value;
    }
    if (row.parameter === 'DEVPARCIALBIEN') {
      this.PDEVPARCIALBIEN = row.value;
    }
    if (row.parameter === 'VALIDADET') {
      this.PVALIDADET = row.value;
    }
  }

  getParams(concept: { id: string }) {
    const filterParams = new FilterParams();
    filterParams.limit = 100000;
    filterParams.addFilter('conceptId', concept.id);
    this.parameterService
      .getAll(filterParams.getParams())
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response && response.data) {
            if (response.count > 5 || concept.id === '324') {
              this.resetParams();
              response.data.forEach(row => {
                this.fillParams(row);
              });
              return;
            }
          }
          this.alert('error', 'El concepto no está parametrizado', '');
        },
        error: err => {
          this.alert('error', 'El concepto no está parametrizado', '');
        },
      });
  }

  reloadLoteEvent(event: any) {
    console.log(event);
    setTimeout(() => {
      this.reloadLote = !this.reloadLote;
    }, 500);
  }

  fillForm(event: IComerExpense) {
    console.log(event);
    this.data = event;
    this.conceptNumber.setValue(event.conceptNumber);
    if (event.conceptNumber) this.getParams({ id: event.conceptNumber });
    this.paymentRequestNumber.setValue(event.paymentRequestNumber);
    this.idOrdinginter.setValue(event.idOrdinginter);
    this.folioAtnCustomer.setValue(event.folioAtnCustomer);

    this.dateOfResolution.setValue(
      event.dateOfResolution
        ? secondFormatDateToDate(event.dateOfResolution)
        : null
    );
    this.comment.setValue(event.comment);
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
    return (
      'prepareevent/api/v1/comer-event/getProcess' +
      (this.address ? '?filter.id=' + this.address + ',C' : 'C')
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

  sendToSIRSAE() {}
}
