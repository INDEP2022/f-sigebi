import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { InvoicefolioService } from 'src/app/core/services/ms-invoicefolio/invoicefolio.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { ParameterInvoiceService } from 'src/app/core/services/ms-parameterinvoice/parameterinvoice.service';
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

  //nuevo
  dataEvent: DefaultSelect = new DefaultSelect();
  dataRebill: DefaultSelect = new DefaultSelect();
  dataLote: DefaultSelect = new DefaultSelect();
  dataClient: DefaultSelect = new DefaultSelect();
  dataClient2: DefaultSelect = new DefaultSelect();
  dataTransferent: DefaultSelect = new DefaultSelect();
  delegations: DefaultSelect = new DefaultSelect();
  displayCancel: boolean = false;

  refactureTemp: string = '';

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
    private delegationService: DelegationService,
    private comerRebilService: ParameterInvoiceService,
    private invoceFolioService: InvoicefolioService,
    private jasperService: SiabService,
    private datePipe: DatePipe
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

    this.getComerFacturas();
  }

  //nuevo

  getEventData(params?: ListParams) {
    if (params.text) {
      const isNumeric = (n: any) => !!Number(n);

      isNumeric(params.text)
        ? (params['id_evento'] = params.text)
        : (params['cve_proceso'] = params.text);
    }
    this.comerEventService.getDataEvent(params).subscribe({
      next: resp => {
        this.dataEvent = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.dataEvent = new DefaultSelect();
      },
    });
  }

  getRebillData(params?: ListParams) {
    if (params.text) {
      const isNum = parseInt(params.text);
      isNum
        ? (params['filter.id'] = `${SearchFilter.EQ}:${params.text}`)
        : (params[
            'filter.description'
          ] = `${SearchFilter.ILIKE}:${params.text}`);
    }
    params['filter.apply'] = `${SearchFilter.IN}:F,A`;
    this.comerRebilService.getAll(params).subscribe({
      next: resp => {
        this.dataRebill = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.dataRebill = new DefaultSelect();
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
    params['sortBy'] = 'cvman:DESC';
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
          this.billingForm
            .get('Iauthorize')
            .patchValue(resp.data[0].reasonName);
        }
        this.dataClient = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.billingForm.get('Iauthorize').patchValue(text);
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

  selectedTrans(data: any) {
    this.billingForm.get('downloadcvman').patchValue(data.nameTransferent);
    this.billingForm.get('transfereeNumber').patchValue(data.id);
  }

  setDataClient(data: any) {
    if (data) {
      this.billingForm.get('street').patchValue(data.street);
      this.billingForm.get('cologne').patchValue(data.colony);
      this.billingForm.get('rfc').patchValue(data.rfc);
      this.billingForm.get('municipality').patchValue(data.city);
      this.billingForm.get('state').patchValue(data.state);
      this.billingForm.get('cop').patchValue(data.zipCode);
    } else {
      this.billingForm.get('street').patchValue(null);
      this.billingForm.get('cologne').patchValue(null);
      this.billingForm.get('rfc').patchValue(null);
      this.billingForm.get('municipality').patchValue(null);
      this.billingForm.get('state').patchValue(null);
      this.billingForm.get('cop').patchValue(null);
    }
  }

  newInvoice() {
    this.billingForm.reset();
    this.billingForm.get('Type').patchValue(20);
    this.billingForm.get('tpinvoiceId').patchValue('P');
    this.displayCancel = false;
    this.getComerClientsData2(new ListParams());
    this.getComerClientsData(new ListParams());
    this.getTransferentData(new ListParams());
    this.getRebillData(new ListParams());
    this.getDelegation(new ListParams());
    this.getEventData(new ListParams());
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
          this.billingForm.get('customer').patchValue(data.CLIENTE);
          this.billingForm.get('cologne').patchValue(data.COLONIA);
          this.billingForm.get('cop').patchValue(data.CP);
          this.billingForm.get('cvman').patchValue(data.CVMAN);
          this.billingForm.get('delegationNumber').patchValue(data.DELEGACION);
          this.billingForm
            .get('description')
            .patchValue(data.DESCRIPCION.concat(` ${processKey}`));
          this.billingForm.get('downloadcvman').patchValue(data.DESC_CVMAN);
          this.billingForm.get('state').patchValue(data.ESTADO);
          this.billingForm.get('vat').patchValue(data.IVA);
          this.billingForm.get('municipality').patchValue(data.MUNICIPIO);
          this.billingForm.get('descDelegation').patchValue(data.NO_DELEGACION);
          this.billingForm
            .get('transfereeNumber')
            .patchValue(data.NO_TRANSFERENTE);
          this.billingForm.get('price').patchValue(data.PRECIO);
          this.billingForm.get('rfc').patchValue(data.RFC);
          this.billingForm.get('total').patchValue(data.TOTAL);

          const params = new ListParams();

          const value = parseInt(data.AUTORIZO);

          value
            ? (params['filter.id'] = `${SearchFilter.EQ}:${data.AUTORIZO}`)
            : ((params[
                'filter.reasonName'
              ] = `${SearchFilter.ILIKE}:${data.AUTORIZO}`),
              (params.text = data.AUTORIZO));

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
            .get('tpprocessKey')
            .patchValue(resp.cve_procesotp ?? '');
          this.billingForm
            .get('eventDate')
            .patchValue(
              resp.fec_evento
                ? resp.fec_evento.split('T')[0].split('-').reverse().join('/')
                : ''
            );
          this.billingForm.get('tpevent').patchValue(resp.tpevento ?? '');
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

  getComerFacturas(id: number = 3) {
    const filter = new FilterParams();
    filter.addFilter('tpinvoiceId', 'P', SearchFilter.EQ);
    filter.addFilter('billId', id, SearchFilter.EQ);
    this.comerInvoice.getAll(filter.getParams()).subscribe({
      next: resp => {
        const value = resp.data[0];
        value.eventDate = value.eventDate
          ? value.eventDate.split('-').reverse().join('/')
          : '';
        value.impressionDate = value.impressionDate
          ? value.impressionDate.split('-').reverse().join('/')
          : '';
        this.billingForm.patchValue(value);
        const params = new ListParams();
        params.text = value.eventId;
        this.getEventData(params);
        this.getLoteByEvent(new ListParams());
        const params2 = new ListParams();
        params2.text = value.customer;
        this.getComerClientsData2(params2);
        const params3 = new ListParams();
        params3.text = value.causerebillId;
        this.getRebillData(params3);
        const params4 = new ListParams();
        params4.text = value.downloadcvman;
        this.getTransferentData(params4);
      },
      error: () => {},
    });
  }

  getLoteByEvent(params: ListParams) {
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

  async saveData() {
    this.loading = true;
    const { billId, eventId } = this.billingForm.value;

    if (!billId) {
      const idValue = await this.getIdMax(Number(eventId));
      this.billingForm.get('billId').patchValue(idValue);

      this.billingForm.get('factstatusId').patchValue('PREF');

      this.comerInvoice.create(this.billingForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.alert(
            'success',
            'Facturación de Penalización',
            'Creado Correctamente'
          );
        },
        error: err => {
          this.loading = false;
          this.alert('error', 'Error', err.error.message);
        },
      });
    } else {
      const dataUpdate = this.billingForm.value;

      dataUpdate.impressionDate = dataUpdate.impressionDate
        ? typeof dataUpdate.impressionDate == 'string'
          ? dataUpdate.impressionDate.split('/').reverse().join('-')
          : dataUpdate.impressionDate
        : null;

      dataUpdate.eventDate = dataUpdate.eventDate
        ? typeof dataUpdate.eventDate == 'string'
          ? dataUpdate.eventDate.split('/').reverse().join('-')
          : dataUpdate.eventDate
        : null;

      delete dataUpdate.descDelegation;
      delete dataUpdate.any;

      this.comerInvoice.update(this.billingForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.alert(
            'success',
            'Facturación de Penalización',
            'Actualizado Correctamente'
          );
        },
        error: err => {
          this.loading = false;
          this.alert('error', 'Error', err.error.message);
        },
      });
    }
  }

  getIdMax(eventId: number) {
    return firstValueFrom(
      this.comerInvoice.getMaxFacturaId(eventId).pipe(
        map(resp => resp.id_factura),
        catchError(() => of(1))
      )
    );
  }

  private prepareForm(): void {
    this.billingForm = this.fb.group({
      eventId: [null, Validators.required],
      processKey: [null],
      tpprocessKey: [null],
      batchId: [null, Validators.required],
      Type: [20, Validators.required],
      eventDate: [null],
      impressionDate: [null],
      cvman: [null, Validators.required],
      downloadcvman: [null, Validators.required],
      delegationNumber: [null],
      descDelegation: [null],
      description: [null],
      customer: [null, Validators.required],
      Iauthorize: [null, Validators.required],
      street: [null, Validators.required],
      cologne: [null, Validators.required],
      municipality: [null, Validators.required],
      state: [null, Validators.required],
      rfc: [null, Validators.required],
      cop: [null, Validators.required],
      tpevent: [null],
      goodNumber: [null],
      archImgtemp: [null],
      series: [null],
      Invoice: [null],
      factstatusId: [null],
      IauthorizeDate: [null],
      price: [null],
      vat: [null],
      total: [null],
      transfereeNumber: [null],
      process: [null],
      causerebillId: [null],
      folioinvoiceId: [null],
      exhibit: [null],
      userIauthorize: [null],
      billId: [null],
      tpinvoiceId: ['P', Validators.required],
      vouchertype: [null],
      any: [null],
    });
  }

  async generateFolios() {
    const { billId, eventId } = this.billingForm.value;
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
      if (!billId) {
        this.alert(
          'error',
          'Error',
          'Debe guardar los datos de la facturación'
        );
        return;
      } else if (!eventId) {
        this.alert('error', 'Error', 'Debe especificar un evento');
        return;
      }
    }

    this.folios(validUser);
  }

  async folios(user: number) {
    const { eventId, billId } = this.billingForm.value;
    let validaFol: number;

    validaFol = await this.validateFoliosAvaliable(Number(eventId));

    if (validaFol == 1) {
      await this.updateByEvent(Number(eventId));

      this.changeProcess('FL', 'PREF');

      const dataUpdate = this.billingForm.value;

      dataUpdate.impressionDate = dataUpdate.impressionDate
        ? typeof dataUpdate.impressionDate == 'string'
          ? dataUpdate.impressionDate.split('/').reverse().join('-')
          : dataUpdate.impressionDate
        : null;

      dataUpdate.eventDate = dataUpdate.eventDate
        ? typeof dataUpdate.eventDate == 'string'
          ? dataUpdate.eventDate.split('/').reverse().join('-')
          : dataUpdate.eventDate
        : null;

      delete dataUpdate.descDelegation;
      delete dataUpdate.any;

      this.comerInvoice.update(this.billingForm.value).subscribe({
        next: () => {
          this.getComerFacturas(billId);
        },
        error: err => {
          this.alert('error', 'Error', err.error.message);
        },
      });
    } else {
      this.alert('error', 'Error', 'No existen folios disponibles');
    }
  }

  async updateByEvent(event: number) {
    return firstValueFrom(
      this.comerInvoice.updateByEvent(event).pipe(
        map(() => true),
        catchError(() => of(true))
      )
    );
  }

  async validateFoliosAvaliable(eventId: number) {
    const { tpevent } = this.billingForm.value;
    return firstValueFrom<number>(
      this.invoceFolioService.validateFolioAvailable(eventId, tpevent).pipe(
        map(resp => resp.rspta),
        catchError(() => of(0))
      )
    );
  }

  async getUser(user: string) {
    return firstValueFrom(
      this.parameterComerModSerivce.validUser({ user }).pipe(
        map(resp => resp.lValUsu),
        catchError(() => of(-1))
      )
    );
  }

  deleteFolios() {
    const { billId, eventId } = this.billingForm.value;

    if (!billId) {
      this.alert('error', 'Error', 'Debe existir folio de facturación');
      return;
    }
    if (!eventId) {
      this.alert('error', 'Error', 'Debe seleccionar un evento');
      return;
    }

    let aux = 0;
    aux = 1;

    if (aux == 1) {
      this.changeProcess('EF', 'FOL');
    }

    this.comerInvoice.deleteFolio({ eventId, invoiceId: billId }).subscribe({
      next: () => {
        this.alert('success', 'Folios', 'Eliminado Correctamente');
        const dataUpdate = this.billingForm.value;

        dataUpdate.impressionDate = dataUpdate.impressionDate
          ? typeof dataUpdate.impressionDate == 'string'
            ? dataUpdate.impressionDate.split('/').reverse().join('-')
            : dataUpdate.impressionDate
          : null;

        dataUpdate.eventDate = dataUpdate.eventDate
          ? typeof dataUpdate.eventDate == 'string'
            ? dataUpdate.eventDate.split('/').reverse().join('-')
            : dataUpdate.eventDate
          : null;

        delete dataUpdate.descDelegation;
        delete dataUpdate.any;

        this.comerInvoice.update(this.billingForm.value).subscribe({
          next: () => {
            this.getComerFacturas(billId);
          },
          error: err => {
            this.alert('error', 'Error', err.error.message);
          },
        });
      },
      error: err => {
        this.alert('error', 'Error', err.error.message);
      },
    });
  }

  changeProcess(process: string, status: string) {
    const { factstatusId } = this.billingForm.value;
    let aux_status: string;
    if (status == 'NULL') {
      aux_status = null;
    } else {
      aux_status = status;
    }

    if (factstatusId == aux_status) {
      this.billingForm.get('process').patchValue(process);
    }
  }

  openPrevInvoice() {
    const { eventId } = this.billingForm.value;
    if (!eventId) {
      this.alert('error', 'Error', 'Debe seleccionar algun evento');
      return;
    }

    this.jasperService.fetchReportBlank('blank').subscribe({
      next: response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      },
    });
  }

  getImage() {
    const { billId, eventId } = this.billingForm.value;

    if (!billId) {
      this.alert('error', 'Error', 'Debe existir folio de facturación');
      return;
    }
    if (!eventId) {
      this.alert('error', 'Error', 'Debe seleccionar un evento');
      return;
    }

    let valida: number = 0;
    let borra: string;
    valida = 1;
    if (valida == 1) {
      this.archiv();
      this.createImg();
      this.obtImg(null);
    }

    const filename = 'Invoice_000_exported';
    FileSaver.saveAs(this.imagenurl, filename + '.jpg');
  }

  changeStatusImg() {
    const { eventId, billId } = this.billingForm.value;
    const body = {
      pStatus: 'SEG',
      pProcess: 'AR',
      pEvent: eventId,
      idFact: billId,
    };
    this.comerInvoice.updateStatusImg(body).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  obtImg(img: string) {}

  archiv() {
    const { factstatusId, archImgtemp, eventId, billId } =
      this.billingForm.value;
    if (factstatusId == 'FOL' && !archImgtemp) {
      this.billingForm
        .get('archImgtemp')
        .patchValue(`C:\IMTMPSIAB\TMP_${eventId}_${billId}.BMP`);
    }
    this.changeProcess('AR', 'FOL');
    //lip comit silencioso guardar datos
  }

  createImg() {}

  openFolioModal() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean, data: InvoiceFolioSeparate) => {
          if (next) {
            this.billingForm.get('series').patchValue(data.series);
            this.billingForm.get('Invoice').patchValue(data.invoice);
            this.billingForm
              .get('folioinvoiceId')
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

  async cancelInvoice() {
    let CF_NUEVAFACT: number;
    let CF_LEYENDA: string;
    let BORRA: string;

    const {
      billId,
      causerebillId,
      series,
      Invoice,
      eventId,
      Iauthorize,
      batchId,
      delegationNumber,
    } = this.billingForm.value;

    if (!Invoice) {
      this.alert(
        'error',
        'Error',
        'No se puede cancelar una factura sin folio'
      );
      return;
    }

    if (!causerebillId) {
      this.displayCancel = true;
    } else if (causerebillId) {
      if (this.refactureTemp == 'R') {
        this.cancelComerInovice();
        CF_LEYENDA = `CANCELA Y SUSTITUYE A LA FACTURA ${series} - ${Invoice}`;

        const body: any = {
          pEventO: Number(eventId),
          pInvoiceO: Number(billId),
          pLegend: CF_LEYENDA,
          pAuthorized: Iauthorize,
          pStatus: 'PREF',
          pImagen: null,
          pCfdi: 0,
          pLot: Number(batchId),
          pCause: Number(causerebillId),
          pDeletedEmits: Number(delegationNumber),
          pOcionCan: null,
        };

        CF_NUEVAFACT = await this.copyInovice(body);

        if (CF_NUEVAFACT > 0) {
          this.alert('success', 'Factura Cancelada', 'Procesado Correctamente');

          const dataUpdate = this.billingForm.value;

          dataUpdate.impressionDate = dataUpdate.impressionDate
            ? typeof dataUpdate.impressionDate == 'string'
              ? dataUpdate.impressionDate.split('/').reverse().join('-')
              : dataUpdate.impressionDate
            : null;

          dataUpdate.eventDate = dataUpdate.eventDate
            ? typeof dataUpdate.eventDate == 'string'
              ? dataUpdate.eventDate.split('/').reverse().join('-')
              : dataUpdate.eventDate
            : null;

          delete dataUpdate.descDelegation;
          delete dataUpdate.any;

          this.comerInvoice.update(this.billingForm.value).subscribe({
            next: () => {
              this.getComerFacturas(billId);
            },
            error: err => {
              this.alert('error', 'Error', err.error.message);
            },
          });
        } else {
          this.alert('error', 'Error', 'No se pudo cancelar la factura');
        }
      } else if (this.refactureTemp == 'C') {
        this.cancelComerInovice();
      }
    }
  }

  async copyInovice(data: Object) {
    return firstValueFrom<number>(
      this.comerInvoice.copyInvoice(data).pipe(
        map(resp => resp),
        catchError(() => of(0))
      )
    );
  }

  cancelComerInovice() {
    const user = this.authSerivce.decodeToken();
    this.billingForm.get('factstatusId').patchValue('CAN');
    this.billingForm
      .get('userIauthorize')
      .patchValue(user.username.toUpperCase());
    this.billingForm
      .get('IauthorizeDate')
      .patchValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
  }

  setRefacture(data: any) {
    if (data) {
      this.refactureTemp = data.rebill;
    } else {
      this.refactureTemp = '';
    }
  }
}
