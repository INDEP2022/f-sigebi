import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
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

  constructor(private fb: FormBuilder) {
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
      event: [null, [Validators.required]],
      batchId: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
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
}
