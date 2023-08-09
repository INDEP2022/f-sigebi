import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { CustomerService } from 'src/app/core/services/catalogs/customer.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  DOUBLE_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { PAY_RECEIPT_REPORT_COLUMNS } from './payment-receipts-report-columns';

@Component({
  selector: 'app-payment-receipts-report',
  templateUrl: './payment-receipts-report.component.html',
  styles: [],
})
export class PaymentReceiptsReportComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  total: number = 0;
  goodList: any;
  dataGood: any;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  select = new DefaultSelect<IDepartment>();
  @Output() onConfirm = new EventEmitter<any>();
  showResolucion: boolean = false;
  columnFilters1: any = [];
  valLote: boolean = false;
  v_appiva: number = 0;
  v_noappiva: number = 0;
  v_acumulado: number = 0;
  del25: number = 0;
  cadena: string = '';

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private paymentService: PaymentService,
    private lotService: LotService,
    private customerService: CustomerService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...PAY_RECEIPT_REPORT_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareform();
    this.getGood();
    this.getCustomers();
    this.getLot();
    this.observaciones();
  }
  get departament() {
    return this.form.get('departament');
  }
  get subdelegation() {
    return this.form.get('subdelegation');
  }

  private prepareform() {
    this.form = this.fb.group({
      idEvent: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      fechaEvento: [new Date(), [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      allotment: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      amount: [null, [Validators.required, Validators.pattern(DOUBLE_PATTERN)]],

      sender: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      domicile: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      suburb: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cp: [null, [Validators.required]],

      price: [null, [Validators.required, Validators.pattern(DOUBLE_PATTERN)]],
      remBalance: [null, [Validators.pattern(DOUBLE_PATTERN)]],
      iva: [null, [Validators.required, Validators.pattern(DOUBLE_PATTERN)]],
      total: [null, [Validators.required, Validators.pattern(DOUBLE_PATTERN)]],
      receivedAmount: [null, [Validators.required]],

      receipt: [null, [Validators.required]],
      date: [null, [Validators.required, maxDate(new Date())]],
      buy: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      transferee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      appIva: [null, [Validators.required, Validators.pattern(DOUBLE_PATTERN)]],
      NoAppIva: [null, [Validators.pattern(DOUBLE_PATTERN)]],

      delivery: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      notary: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      numberNotary: [null, [Validators.required]],
      residence: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      phone: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      penalty: [null, [Validators.required]],

      attorney: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      receiver: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      federative: [null],
      subdelegation: [null],
    });
  }

  reportAndTables() {
    if (this.showResolucion) {
      this.showResolucion = false;
    } else {
      this.showResolucion = true;
    }
  }

  validDates(): boolean {
    //this.showSearch = true;
    const start = new Date(this.form.get('date').value);
    const end = new Date(this.form.get('fechaEvento').value);

    const startTemp = `${start.getFullYear()}-0${
      start.getUTCMonth() + 1
    }-0${start.getDate()}`;
    const endTemp = `${end.getFullYear()}-0${
      end.getUTCMonth() + 1
    }-0${end.getDate()}`;

    if (end < start) {
      this.onLoadToast(
        'warning',
        'advertencia',
        'Fecha de Evento no Puede Ser Menor a Fecha Emisión'
      );
      return true;
    }
    return false;
  }

  confirm(): void {
    if (this.validDates()) {
      return;
    }

    let params = {
      DESTYPE: this.form.controls['idEvent'].value,
      ID_RECIBOPAGO: this.form.controls['idEvent'].value,
      FECHA_EMISION: this.form.controls['date'].value,
      RECIBIMOS_DE: this.form.controls['idEvent'].value,
      DOMICILIO: this.form.controls['domicile'].value,
      COLONIA: this.form.controls['suburb'].value,
      DELEGACION: this.form.controls['delegation'].value,
      ESTADO: this.form.controls['federative'].value,
      CP: this.form.controls['cp'].value,
      PRECIO_VENTA: this.form.controls['price'].value,
      IVA: this.form.controls['iva'].value,
      TOTAL: this.form.controls['total'].value,
      CANTIDAD_RECIBIDA: this.form.controls['receivedAmount'].value,
      SALDO_RESTANTE: this.form.controls['remBalance'].value,
      PORC_APPIVA: this.form.controls['appIva'].value,
      PORC_NOAPPIVA: this.form.controls['NoAppIva'].value,
      CVE_TRANSF: this.form.controls['transferee'].value,
      DESC_EVENTO: this.form.controls['description'].value,
      ETIQUETA_PROC: this.form.controls['idEvent'].value,
      CVE_PROCESO: this.form.controls['idEvent'].value,
      FEC_EVENTO: this.form.controls['fechaEvento'].value,
      ID_LOTE: this.form.controls['allotment'].value,
      ENTREGA_INM: this.form.controls['delivery'].value,
      OBSERVACIONES: this.form.controls['observations'].value,
      NOTARIO_NOM: this.form.controls['notary'].value,
      NOTARIO_NUM: this.form.controls['numberNotary'].value,
      NOTARIO_DOM: this.form.controls['residence'].value,
      NOTARIO_TEL: this.form.controls['phone'].value,
      PENA: this.form.controls['penalty'].value,
      APODERADO_LEGAL: this.form.controls['attorney'].value,
      RECIBI: this.form.controls['receiver'].value,
    };

    /*setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    */
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCOMERRECIBOS.pdf?PN_DELEG=${params.PN_DELEG}&DESTYPE=${params.DESTYPE}&ID_RECIBOPAGO=${params.ID_RECIBOPAGO}&FECHA_EMISION=${params.FECHA_EMISION}&RECIBIMOS_DE=${params.RECIBIMOS_DE}&DOMICILIO=${params.DOMICILIO}&COLONIA=${params.COLONIA}&DELEGACION=${params.DELEGACION}&ESTADO=${params.ESTADO}&CP=${params.CP}&PRECIO_VENTA=${params.PRECIO_VENTA}&IVA=${params.IVA}&TOTAL=${params.TOTAL}&CANTIDAD_RECIBIDA=${params.CANTIDAD_RECIBIDA}&SALDO_RESTANTE=${params.SALDO_RESTANTE}&PORC_APPIVA=${params.PORC_APPIVA}&PORC_NOAPPIVA=${params.PORC_NOAPPIVA}&CVE_TRANSF=${params.CVE_TRANSF}&DESC_EVENTO=${params.DESC_EVENTO}&ETIQUETA_PROC=${params.ETIQUETA_PROC}&CVE_PROCESO=${params.CVE_PROCESO}&FEC_EVENTO=${params.FEC_EVENTO}&ID_LOTE=${params.ID_LOTE}&ENTREGA_INM=${params.ENTREGA_INM}&OBSERVACIONES=${params.OBSERVACIONES}&NOTARIO_NOM=${params.NOTARIO_NOM}&NOTARIO_NUM=${params.NOTARIO_NUM}&NOTARIO_DOM=${params.NOTARIO_DOM}&NOTARIO_TEL=${params.NOTARIO_TEL}&PENA=${params.PENA}&APODERADO_LEGAL=${params.APODERADO_LEGAL}&RECIBI=${params.RECIBI}`;
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    //window.open(pdfurl, 'RCOMERRECIBOS.pdf');

    console.log('params -> ', params);
    //RCOMERRECIBOS
    this.siabService.fetchReport('blank', params).subscribe(response => {
      //  response= null;
      if (response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {
              if (data) {
                data.map((item: any) => {
                  return item;
                });
              }
            },
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true,
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      }
    });

    /*setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000); */

    //this.loading = false;
    //this.cleanForm();
  }

  cleanForm(): void {
    this.form.reset();
  }

  ngOnChanges() {}

  priceTotal(x: any) {
    // this.form.value.price = this.form.controls['price'].value;

    let noAppIva = (this.form.value.price * this.form.value.NoAppIva) / 100;
    let appIva = (this.form.value.price * this.form.value.iva) / 100;
    let total = Number(this.form.value.price) + Number(appIva);
    let remBalance = this.form.value.receivedAmount - total;
    if (
      this.form.value.price !== null &&
      this.form.value.price !== 0 &&
      this.form.value.iva !== null &&
      this.form.value.iva !== 0
    ) {
      let remFormat = new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2,
      }).format(remBalance);

      this.form.controls['total'].setValue(total);
      this.form.controls['appIva'].setValue(appIva);
      this.form.controls['remBalance'].setValue(remFormat);
      this.form.controls['NoAppIva'].setValue(noAppIva);
    }
  }

  getGood() {
    this.loading = true;
    this.reportService.getGood().subscribe({
      next: data => {
        this.goodList = data;
        this.dataGood = this.goodList.data;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = 'Duplicado';
    this.onLoadToast('success', `${message} Correctamente`, '');
    this.loading = false;
    this.onConfirm.emit(true);
    // this.getListBien();
  }

  search() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters1,
    };
    this.paymentService.getLoadPayment(112, params).subscribe({
      next: response => {
        this.loading = false;
        console.log('response ', response);
      },
      error: error => {
        this.loading = false;
        this.alert('error', 'El evento no existe', '');
      },
    });
  }

  getCustomers() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters1,
    };
    let id = 7;
    this.customerService.getCustomerById(id).subscribe({
      next: response => {
        console.log('resp ', response);
        console.log('response.delegation ', response.delegation);
        this.form.patchValue({
          sender: response.reasonName,
          domicile: response.street,
          suburb: response.colony,
          delegation: response.delegation,
          cp: response.state,
        });
      },
      error: error => {
        this.alert('error', 'No hay Cliente', '');
      },
    });
  }

  getLot() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters1,
    };
    let id = 16001;
    this.lotService.getLotById(id).subscribe({
      next: response => {
        console.log('Resp Lot ', response);
        this.v_appiva = response.amountWithoutIva;
        this.v_noappiva =
          response.amountNoAppIva != null ? Number(response.amountNoAppIva) : 0;
        this.v_acumulado =
          response.accumulated != null ? Number(response.accumulated) : 0;
        this.del25 = response.advance || 0;

        this.form.patchValue({
          price: response.finalPrice,
          iva: response.ivaLot,
          total: response.amount,
          //receivedAmount: Number(this.v_acumulado),
          //remBalance: Number(response.amount) - this.v_acumulado,
          appIva: response.porcAppIva,
          NoAppIva: response.porcNoAppIva,
        });

        this.form.patchValue({
          price: Number(response.amount) - this.v_acumulado || 0,
          total: Number(response.amount) || 0,
          receivedAmount: this.v_acumulado || 0,
          remBalance:
            Number(this.form.get('total').value) - this.v_acumulado || 0,
        });
      },
      error: error => {
        console.log(error);
      },
    });
  }

  ORDENES_ING(id_orden: number) {
    let filter = 10535;
    let AUX_CAD: string;
    let LEN1: number = 0;
    let AUX_FEC: Date;

    this.paymentService.getPaymentById(filter).subscribe({
      next: response => {
        console.log('Resp Pay ', response);
        for (let i = 0; i < response.count; i++) {
          if (response.data[i] != undefined) {
            if (
              response.data[i].entryOrderId != null &&
              response.data[i].entryOrderId != undefined
            ) {
              //console.log('data orden ', response.data[i]);
              if (i == response.count - 1) {
                this.cadena += response.data[i].entryOrderId;
              } else {
                this.cadena += response.data[i].entryOrderId + ',';
              }
            }
          }
        }
        console.log('cadena -> ', this.cadena);
      },
      error: err => {
        this.cadena = '';
      },
    });
  }

  observaciones() {
    let AUX_CAL1: number = 0;
    let AUX_CAL2: number = 0;
    let AUX_CAL3: number = 0;
    let AUX_PCT: number = 0;
    let OIS: string;
    if (this.form.get('observations').value != null) {
      AUX_CAL1 = this.form.get('total').value - this.form.get('iva').value;
      AUX_CAL2 =
        this.form.get('receivedAmount').value - this.form.get('iva').value;
      AUX_CAL3 = this.del25 - this.form.get('iva').value;
      AUX_PCT = (AUX_CAL2 / AUX_CAL1) * 100;
      this.ORDENES_ING(this.form.get('allotment').value);
      OIS = this.cadena;
      console.log('cadena -> ', this.cadena);
    }
  }
}
