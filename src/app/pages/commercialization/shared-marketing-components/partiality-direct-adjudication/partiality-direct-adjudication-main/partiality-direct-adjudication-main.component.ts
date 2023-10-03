import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BiddingService } from 'src/app/core/services/ms-bidding/bidding.service';
import { StatusDispService } from 'src/app/core/services/ms-status-disp/status-disp.service';
import { BasePage } from 'src/app/core/shared/base-page';
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

  eventsTestData = [
    {
      id: 101,
      cve: 'EJEMPLO CVE',
      type: 'EJEMPLO TIPO EVENTO',
      status: 'EJEMPLO ESTATUS',
      observations: 'EJEMPLO OBSERVACIONES DEL EVENTO',
    },
    {
      id: 201,
      cve: 'EJEMPLO CVE',
      type: 'EJEMPLO TIPO EVENTO',
      status: 'EJEMPLO ESTATUS',
      observations: 'EJEMPLO OBSERVACIONES DEL EVENTO',
    },
    {
      id: 301,
      cve: 'EJEMPLO CVE',
      type: 'EJEMPLO TIPO EVENTO',
      status: 'EJEMPLO ESTATUS',
      observations: 'EJEMPLO OBSERVACIONES DEL EVENTO',
    },
    {
      id: 401,
      cve: 'EJEMPLO CVE',
      type: 'EJEMPLO TIPO EVENTO',
      estatus: 'EJEMPLO ESTATUS',
      observations: 'EJEMPLO OBSERVACIONES DEL EVENTO',
    },
    {
      id: 501,
      cve: 'EJEMPLO CVE',
      type: 'EJEMPLO TIPO EVENTO',
      status: 'EJEMPLO ESTATUS',
      observations: 'EJEMPLO OBSERVACIONES DEL EVENTO',
    },
  ];

  batchesTestData = [
    {
      id: 1,
      description: 'EJEMPLO DESCRIPCION LOTE',
    },
    {
      id: 2,
      description: 'EJEMPLO DESCRIPCION LOTE',
    },
    {
      id: 3,
      description: 'EJEMPLO DESCRIPCION LOTE',
    },
    {
      id: 4,
      description: 'EJEMPLO DESCRIPCION LOTE',
    },
    {
      id: 5,
      description: 'EJEMPLO DESCRIPCION LOTE',
    },
  ];

  clientsTestData = [
    {
      id: 111,
      name: 'NOMBRE CLIENTE 111',
      rfc: 'RSHSRH61813',
      blacklisted: 'N',
    },
    {
      id: 222,
      name: 'NOMBRE CLIENTE 222',
      rfc: 'HJTDT82190',
      blacklisted: 'N',
    },
    {
      id: 333,
      name: 'NOMBRE CLIENTE 333',
      rfc: 'PLNAIH8639',
      blacklisted: 'N',
    },
    {
      id: 444,
      name: 'NOMBRE CLIENTE 444',
      rfc: 'PAMBVBO9167',
      blacklisted: 'N',
    },
    {
      id: 555,
      name: 'NOMBRE CLIENTE 555',
      rfc: 'HDNMA349716',
      blacklisted: 'N',
    },
  ];

  clTestData = [
    {
      paymentId: 100,
      scheduledDate: '12/07/2021',
      icbExempt: 10000,
      icbEngraved: 12000,
      nominalRate: 10,
      daysYear: 12,
      daysMonth: 15,
      interestExempt: 500,
      interestEngraved: 500,
      interestTax: 500,
      ceExempt: 1000,
      ceEngraved: 1000,
      ceTax: 1000,
      moratoriumExempt: 750,
      moratoriumEngraved: 750,
      moratoriumTax: 750,
      totalTax: 1500,
      totalAmount: 14000,
      referenceDate: '21/08/2021',
      reference: 'EJEMPLO REFERENCIA',
      status: 'CREADA',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private biddingService: BiddingService,
    private statusDispService: StatusDispService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getEvents({ page: 1, text: '' });
    this.getBatches({ page: 1, text: '' });
    this.getClients({ page: 1, text: '' });
    this.prepareForm();
  }

  private prepareForm(): void {
    this.paramsForm = this.fb.group({
      event: [null, [Validators.required]],
      batchId: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
      partialityQuantity: [null, [Validators.required]],
      advancePercent: [null, [Validators.required]],
      saleAmount: [null, [Validators.required]],
      percentPoints: [null, [Validators.required]],
      moratoriumDays: [null, [Validators.required]],
      paymentNumber: [null, [Validators.required]],
    });
    this.adjudicationForm = this.fb.group({
      event: [null],
      batchId: [null],
      clientId: [null],
      partialityQuantity: [null, [Validators.required]],
      advancePercent: [null, [Validators.required]],
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
      licitacionNumber: [0, [Validators.required]],
    });
  }

  getEvents(params: ListParams) {
    if (params.text == '') {
      this.eventItems = new DefaultSelect(this.eventsTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.eventsTestData.filter((i: any) => i.id == id)];
      this.eventItems = new DefaultSelect(item[0], 1);
    }
  }

  getBatches(params: ListParams) {
    if (params.text == '') {
      this.batchItems = new DefaultSelect(this.batchesTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.batchesTestData.filter((i: any) => i.id == id)];
      this.batchItems = new DefaultSelect(item[0], 1);
    }
  }

  getClients(params: ListParams) {
    if (params.text == '') {
      this.clientItems = new DefaultSelect(this.clientsTestData, 5);
    } else {
      const id = parseInt(params.text);
      const item = [this.clientsTestData.filter((i: any) => i.id == id)];
      this.clientItems = new DefaultSelect(item[0], 1);
    }
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
    this.getEvents({ page: 1, text: '' });
    this.getBatches({ page: 1, text: '' });
    this.getClients({ page: 1, text: '' });
    this.selectedEvent = null;
    this.selectedBatch = null;
    this.selectedClient = null;
  }

  deleteAdjudication() {
    this.alertQuestion(
      'question',
      '¿Desea eliminar esta adjudicación?',
      '',
      'Eliminar'
    ).then(question => {
      if (question.isConfirmed) {
        // Eliminar adjudicacion
        console.log('Eliminar Adjudicacion');
        this.cleanForm();
      }
    });
  }

  generarAdjudicacion() {
    console.log(this.paramsForm.value);
    let valores = [];
    for (let valor in this.paramsForm.value) {
      valores.push(this.paramsForm.value[valor]);
    }

    let vacios = valores.some(item => item === null);
    console.log(vacios);

    if (vacios) {
      this.alert(
        'warning',
        'Verifique',
        'Todos los valores de los parámetros son obligatorios'
      );
      return;
    }
  }
  //--------------PRIMER BLOQUE--------------//

  getBidding() {
    let id = this.licitacionForm.get('licitacionNumber').value;
    this.biddingService.getBigging(id).subscribe({
      next: response => {
        this.getTender(id);
        console.log('response licitacionNumber ', response);
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
