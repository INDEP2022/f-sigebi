import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  DOUBLE_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { PAY_RECEIPT_REPORT_COLUMNS } from './payment-receipts-report-columns';

@Component({
  selector: 'app-payment-receipts-report',
  templateUrl: './payment-receipts-report.component.html',
  styles: [],
})
export class PaymentReceiptsReportComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  total: number = 0;

  @Output() onConfirm = new EventEmitter<any>();
  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...PAY_RECEIPT_REPORT_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareform();
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
      total: [null, [Validators.pattern(DOUBLE_PATTERN)]],
      receivedAmount: [
        null,
        [Validators.required, Validators.pattern(DOUBLE_PATTERN)],
      ],

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
      department: [null],
    });
  }

  confirm(): void {
    let params = {
      DESTYPE: this.form.controls['idEvent'].value,
      ID_RECIBOPAGO: this.form.controls['id'].value,
      FECHA_EMISION: this.form.controls['date'].value,
      RECIBIMOS_DE: this.form.controls['idEvent'].value,
      DOMICILIO: this.form.controls['domicile'].value,
      COLONIA: this.form.controls['suburb'].value,
      DELEGACION: this.form.controls['delegation'].value,
      ESTADO: this.form.controls['department'].value,
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

    //this.showSearch = true;
    console.log(params);
    const start = new Date(this.form.get('FECHA_EMISION').value);
    const end = new Date(this.form.get('FEC_EVENTO').value);

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
        'Fecha emisión no puede ser menor a fecha de evento'
      );
      return;
    }

    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RGEROFPRECEPDOCUM.pdf?PN_DELEG=${params.PN_DELEG}&PN_SUBDEL=${params.PN_SUBDEL}&PF_MES=${params.PF_MES}&PF_ANIO=${params.PF_ANIO}`;
    const pdfurl = `https://drive.google.com/file/d/1o3IASuVIYb6CPKbqzgtLcxx3l_V5DubV/view?usp=sharing`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, 'RCOMERRECIBOS.pdf');
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);

    this.loading = false;
    this.cleanForm();
  }

  cleanForm(): void {
    this.form.reset();
  }

  ngOnChanges() {}

  priceTotal(x: any) {
    // this.form.value.price = this.form.controls['price'].value;
    let appIva = this.form.value.iva / 100;
    let total = this.form.value.price * appIva + this.form.value.price;
    let remBalance =
      this.form.value.receivedAmount - total - this.form.value.NoAppIva;

    console.log(remBalance);

    if (
      this.form.value.price !== null &&
      this.form.value.price !== 0 &&
      this.form.value.iva !== null &&
      this.form.value.iva !== 0
    ) {
      // let remFormat = new Intl.NumberFormat('es-MX', {
      //   minimumFractionDigits: 2,
      // }).format(remBalance);

      this.form.controls['total'].setValue(total);
      this.form.controls['appIva'].setValue(appIva);
      this.form.controls['remBalance'].setValue(remBalance);

      // commissionPercent = parseFloat(commissionPercent);
      // let commission = price * (commissionPercent / 100);

      // this.numeraireExchangeForm.controls['commission'].setValue(
      //   commissionFormat
      // );
    }
  }

  handleSuccess() {
    const message: string = 'Duplicado';
    this.onLoadToast('success', `${message} Correctamente`, '');
    this.loading = false;
    this.onConfirm.emit(true);
    // this.getListBien();
  }

  data = [
    {
      noGood: 12,
      typeUbi: 'Tipo 01',
    },
    {
      noGood: 21,
      typeUbi: 'Tipo 42',
    },
    {
      noGood: 43,
      typeUbi: 'Tipo 234',
    },
  ];
}
