import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import * as FileSaver from 'file-saver';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { InvoiceFolioSeparate } from 'src/app/core/models/ms-invoicefolio/invoicefolio.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { TransferentesSaeService } from 'src/app/core/services/catalogs/transferentes-sae.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { CancelModalComponent } from '../cancel-modal/cancel-modal.component';
import { FolioModalComponent } from '../folio-modal/folio-modal.component';

@Component({
  selector: 'app-penalty-billing-main',
  templateUrl: './penalty-billing-main.component.html',
  styles: [],
})
export class PenaltyBillingMainComponent extends BasePage implements OnInit {
  layout: string = 'penalty'; // 'penalty', 'bases-sales'
  navigateCount: number = 0; // 'penalty', 'bases-sales'
  maxDate: Date = new Date();
  voucherTypes: any[] = [];
  eventTypes: any[] = [];
  folioData: any = null;
  eventItems = new DefaultSelect();
  batchItems = new DefaultSelect();
  municipalityItems = new DefaultSelect();
  stateItems = new DefaultSelect();
  billingForm: FormGroup = new FormGroup({});
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  imagenurl =
    'https://images.ctfassets.net/txhaodyqr481/6gyslCh8jbWbh9zYs5Dmpa/a4a184b2d1eda786bf14e050607b80df/plantillas-de-factura-profesional-suscripcion-gratis-con-sumup-facturas.jpg?fm=webp&q=85&w=743&h=892';

  eventsTestData: any[] = [
    {
      id: 101,
    },
    {
      id: 201,
    },
    {
      id: 301,
    },
    {
      id: 401,
    },
    {
      id: 501,
    },
  ];

  batchesTestData: any[] = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
  ];

  municipalityTestData = [
    {
      description: 'MUNICIPIO 1',
    },
    {
      description: 'MUNICIPIO 2',
    },
    {
      description: 'MUNICIPIO 3',
    },
    {
      description: 'MUNICIPIO 4',
    },
    {
      description: 'MUNICIPIO 5',
    },
  ];

  stateTestData = [
    {
      description: 'ESTADO 1',
    },
    {
      description: 'ESTADO 2',
    },
    {
      description: 'ESTADO 3',
    },
    {
      description: 'ESTADO 4',
    },
    {
      description: 'ESTADO 5',
    },
  ];

  voucherTypeData = [
    {
      type: 'TIPO 1',
    },
    {
      type: 'TIPO 2',
    },
    {
      type: 'TIPO 3',
    },
  ];

  eventTypeData = [
    {
      type: 'TIPO 1',
    },
    {
      type: 'TIPO 2',
    },
    {
      type: 'TIPO 3',
    },
  ];

  folioGeneratedData = {
    series: 'SN',
    folio: 1694,
    status: 'CFDI',
    oiBases: 168197,
    oiBasesDate: '08/11/2021',
    document: 'EJE',
  };

  //nuevo
  dataEvent: DefaultSelect = new DefaultSelect();
  dataLote: DefaultSelect = new DefaultSelect();
  dataClient: DefaultSelect = new DefaultSelect();
  dataClient2: DefaultSelect = new DefaultSelect();
  dataTransferent: DefaultSelect = new DefaultSelect();
  delegations: DefaultSelect = new DefaultSelect();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private comerEventService: ComerEventService,
    private comerInvoice: ComerInvoiceService,
    private lotService: LotService,
    private comerService: ComerClientsService,
    private authSerivce: AuthService,
    private parameterComerModSerivce: ParameterModService,
    private transferentService: TransferentesSaeService,
    private delegationService: DelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.route.paramMap.subscribe(params => {
    //   if (params.get('type')) {
    //     if (this.navigateCount > 0) {
    //       this.folioData = null;
    //       this.billingForm.reset();
    //       window.location.reload();
    //     }
    //     this.layout = params.get('type');
    //     this.navigateCount += 1;
    //   }
    // });
    this.prepareForm();
  }

  //nuevo

  getEventData(params?: Params) {
    this.comerEventService.getDataEvent(params).subscribe({
      next: resp => {
        this.dataEvent = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.dataEvent = new DefaultSelect();
      },
    });
  }

  getDelegation(params?: ListParams) {
    params['limit'] = 50;
    params['sortBy'] = 'id:ASC';
    this.delegationService.getAll(params).subscribe({
      next: resp => {
        this.delegations = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.delegations = new DefaultSelect();
      },
    });
  }

  getTransferentData(params?: ListParams) {
    if (params.text) {
      params['filter.nameTransferent'] = `${SearchFilter.ILIKE}:${params.text}`;
    }
    this.transferentService.getAll(params).subscribe({
      next: resp => {
        this.dataTransferent = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.dataTransferent = new DefaultSelect();
      },
    });
  }

  getComerClientsData(params?: ListParams) {
    let text: string = '';
    if (params.text) {
      params['filter.reasonName'] = `${SearchFilter.ILIKE}:${params.text}`;
      text = params.text;
    }
    this.comerService.getAll(params).subscribe({
      next: resp => {
        if (resp.count == 1) {
          this.billingForm.get('authorize').patchValue(resp.data[0].reasonName);
        }
        this.dataClient = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.billingForm.get('authorize').patchValue(text);
        this.dataClient = new DefaultSelect([{ reasonName: text }], 1);
      },
    });
  }

  getComerClientsData2(params?: ListParams) {
    if (params.text) {
      params['filter.reasonName'] = `${SearchFilter.ILIKE}:${params.text}`;
    }
    this.comerService.getAll(params).subscribe({
      next: resp => {
        this.dataClient2 = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.dataClient2 = new DefaultSelect();
      },
    });
  }

  setDataClient(data: any) {
    this.billingForm.get('street').patchValue(data.street);
    this.billingForm.get('colonia').patchValue(data.colonia);
    this.billingForm.get('rfc').patchValue(data.rfc);
    this.billingForm.get('municipality').patchValue(data.municipalityId);
    this.billingForm.get('state').patchValue(data.state);
    this.billingForm.get('zipCode').patchValue(data.zipCode);
  }

  getDataLote({ idLot }: any) {
    const { eventId, processKey } = this.billingForm.value;
    this.comerInvoice
      .getPenalizeData(Number(eventId), Number(idLot))
      .subscribe({
        next: resp => {
          const data = resp.data[0];
          //this.billingForm.get('authorize').patchValue(Number(data.AUTORIZO))
          this.billingForm.get('street').patchValue(data.CALLE);
          this.billingForm.get('client').patchValue(data.CLIENTE);
          this.billingForm.get('colonia').patchValue(data.COLONIA);
          this.billingForm.get('zipCode').patchValue(data.CP);
          this.billingForm.get('cvman').patchValue(data.CVMAN);
          this.billingForm.get('delegationNumber').patchValue(data.DELEGACION);
          this.billingForm
            .get('description')
            .patchValue(data.DESCRIPCION.concat(` ${processKey}`));
          this.billingForm.get('descriptionCvman').patchValue(data.DESC_CVMAN);
          this.billingForm.get('state').patchValue(data.ESTADO);
          this.billingForm.get('vat').patchValue(data.IVA);
          this.billingForm.get('municipality').patchValue(data.MUNICIPIO);
          this.billingForm.get('descDelegation').patchValue(data.NO_DELEGACION);
          this.billingForm
            .get('transferenceNumber')
            .patchValue(data.NO_TRANSFERENTE);
          this.billingForm.get('price').patchValue(data.PRECIO);
          this.billingForm.get('rfc').patchValue(data.RFC);
          this.billingForm.get('total').patchValue(data.TOTAL);

          const params = new ListParams();

          const value = parseInt(data.AUTORIZO);

          value
            ? (params['filter.id'] = `${SearchFilter.EQ}:${data.AUTORIZO}`)
            : (params[
                'filter.reasonName'
              ] = `${SearchFilter.ILIKE}:${data.AUTORIZO}`);

          this.getComerClientsData(params);
        },
        error: () => {
          this.alert(
            'error',
            'Error',
            `No se encontraron datos sobre el evento: ${eventId} y lote: ${idLot}`
          );
        },
      });
  }

  checkEvent({ id_evento }: any) {
    if (id_evento) {
      this.comerEventService.getDataTpEvents(Number(id_evento)).subscribe({
        next: resp => {
          this.billingForm.get('processKey').patchValue(resp.cve_proceso ?? '');
          this.billingForm
            .get('processTpKey')
            .patchValue(resp.cve_procesotp ?? '');
          this.billingForm
            .get('eventDate')
            .patchValue(
              resp.fec_evento
                ? resp.fec_evento.split('T')[0].split('-').reverse().join('/')
                : ''
            );
          this.billingForm.get('tpEvent').patchValue(resp.tpevento ?? '');
          this.getLoteByEvent(new ListParams());
        },
        error: () => {
          this.alert(
            'error',
            'Error',
            'Evento no existe, debe crear un evento antes de emitir una factura'
          );
        },
      });
    }
  }

  getComerFacturas() {
    const filter = new FilterParams();
    filter.addFilter('invoiceTpId', 'P', SearchFilter.EQ);
    filter.page = 13546;
    this.comerInvoice.getAll(filter.getParams()).subscribe({
      next: resp => {
        console.log(resp.data[0]);
        this.billingForm.patchValue(resp.data[0]);
      },
      error: () => {},
    });
  }

  getLoteByEvent(params: Params) {
    const { eventId } = this.billingForm.value;
    if (eventId) {
      this.lotService.getLotbyEvent(eventId, params).subscribe({
        next: resp => {
          this.dataLote = new DefaultSelect(resp.data, resp.count);
        },
        error: () => {
          this.dataLote = new DefaultSelect();
        },
      });
    }
  }

  private prepareForm(): void {
    this.billingForm = this.fb.group({
      eventId: [null, Validators.required],
      processKey: [null],
      processTpKey: [null],
      lotId: [null, Validators.required],
      type: [20, Validators.required],
      eventDate: [null],
      printDate: [null],
      cvman: [null, Validators.required],
      descriptionCvman: [null, Validators.required],
      delegationNumber: [null],
      descDelegation: [null],
      description: [null],
      client: [null, Validators.required],
      authorize: [null, Validators.required],
      street: [null, Validators.required],
      colonia: [null, Validators.required],
      municipality: [null, Validators.required],
      state: [null, Validators.required],
      rfc: [null, Validators.required],
      zipCode: [null, Validators.required],
      tpEvent: [null],
      goodNumber: [null, Validators.required],
      amount: [null],
      temporaryImagenFile: [null],
      serie: [null],
      folio: [null],
      invoiceStatusId: [null],
      authorizeDate: [null],
      price: [null],
      vat: [null],
      total: [null],
      transferenceNumber: [null],
      process: [null],
      invoiceCauseId: [null, Validators.required],
      invoiceFolioId: [null],
      attached: [null],
      userAuthorize: [null],
      id: [null, Validators.required],
      invoiceTpId: [null, Validators.required],
      voucherType: [null],
      any: [null],
    });
  }

  async generateFolios() {
    const { id, eventId } = this.billingForm.value;
    const user = this.authSerivce.decodeToken();
    let validUser: number;

    validUser = await this.getUser(user.username.toUpperCase());

    if (validUser == 0) {
      this.alert(
        'error',
        'Error',
        'No cuenta con los permisos para efectuar esta operación'
      );
      return;
    } else {
      if (!id) {
        this.alert('error', 'Error', 'Debe guardar los datos');
        return;
      } else if (!eventId) {
        this.alert('error', 'Error', 'Debe especificar un evento');
        return;
      }
    }

    console.log('continua');
  }

  async getUser(user: string) {
    return firstValueFrom(
      this.parameterComerModSerivce.validUser({ user }).pipe(
        map(resp => resp.lValUsu),
        catchError(() => of(-1))
      )
    );
  }

  deleteFolios() {}

  openPrevInvoice() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {
          console.log(data);
        },
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  getImage() {
    const filename = 'Invoice_000_exported';
    FileSaver.saveAs(this.imagenurl, filename + '.jpg');
  }

  openFolioModal() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean, data: InvoiceFolioSeparate) => {
          if (next) {
            this.billingForm.get('serie').patchValue(data.series);
            this.billingForm.get('folio').patchValue(data.invoice);
            this.billingForm
              .get('invoiceFolioId')
              .patchValue(data.folioinvoiceId);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(FolioModalComponent, config);
  }

  openCancelModal() {
    const modalRef = this.modalService.show(CancelModalComponent, {
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onCancel.subscribe((data: boolean) => {
      if (data) this.cancelInvoice();
    });
  }

  addReservedFolio(folio: any) {
    console.log(folio);
  }

  cancelInvoice() {
    this.billingForm.reset();
    this.folioData = null;
  }
}
