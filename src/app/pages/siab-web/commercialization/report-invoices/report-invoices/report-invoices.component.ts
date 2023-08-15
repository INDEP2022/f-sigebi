import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { MsInvoiceService } from 'src/app/core/services/ms-invoice/ms-invoice.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { REPORT_INVOICE_COLUMNS } from './report-invoices-columns';

@Component({
  selector: 'app-report-invoices',
  templateUrl: './report-invoices.component.html',
  styles: [],
})
export class reportInvoicesComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  today: Date;
  maxDate: Date;
  minDate: Date;
  event = new DefaultSelect();
  show: boolean = false;
  ddlAnio: number;
  anios: number[] = [];
  dataFormat: any[] = [];
  dataFormatPercentage: any[] = [];
  totInvoices: number = 0;
  totalItems: number = 0;
  data: any;

  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private msInvoiceService: MsInvoiceService,
    private comerEventService: ComerEventService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...REPORT_INVOICE_COLUMNS },
    };
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
    this.llenaDDLAnio();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
      typeCFDI: [null, [Validators.required]],
      statusInvoice: [null, [Validators.required]],
      goods: [null, [Validators.required]],
      event: [null, [Validators.required]],
      year: [null, [Validators.required]],
    });
    this.getEvent(new ListParams());
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
      this.show = false;
    }
    console.warn('Your order has been submitted');
  }

  consult() {
    this.show = true;
    this.consultInvoices();
  }

  async consultInvoices() {
    /*const idEvent = 0;
    const anio = 0;
    const tpInvoice = '';
    const status = '';
    const fecStart = '';
    const fecEnd = '';
    const tpGood = '';*/

    let getGrafica = await this.getInvoices();
    let array: any = getGrafica;
    console.log(array.length);
    for (let i = 0; i < array.length; i++) {
      if (array[i].cuenta_fac > 0) {
        const data: any = {
          color: array[i].color,
          cuenta_fac: array[i].cuenta_fac,
          descripcion: array[i].descripcion,
          id_delegacion: array[i].id_delegacion,
        };
        this.totInvoices += array[i].cuenta_fac;
        this.dataFormat.push(data);
      }
    }
    console.log(this.totInvoices);
    this.calculatePercentage(this.dataFormat);
  }

  calculatePercentage(data: any) {
    if (this.totInvoices > 0) {
      for (let i = 0; i < data.length; i++) {
        const percentage: number =
          (data[i].cuenta_fac * 100) / this.totInvoices;
        const data1: any = {
          color: data[i].color,
          cuenta_fac: data[i].cuenta_fac,
          descripcion: data[i].descripcion,
          id_delegacion: data[i].id_delegacion,
          porcentaje: `${Math.round(percentage).toFixed(2)} %`,
        };
        this.dataFormatPercentage.push(data1);
      }
      console.log(this.dataFormatPercentage);
    } else {
      this.alert(
        'warning',
        'No se Encontraron Facturas',
        `Con los criterios especificados`
      );
    }
  }

  getDataAll() {
    this.data = this.dataFormatPercentage;
    this.totalItems = this.data.length;
  }

  rowSelect(event: any) {
    console.log(event);
  }

  llenaDDLAnio() {
    this.ddlAnio = new Date().getFullYear();
    const anioInicial = 2010;
    if (this.ddlAnio) {
      for (let anio = anioInicial; anio <= this.ddlAnio; anio++) {
        this.anios.push(anio);
      }
    }
  }

  getEvent(params: ListParams) {
    this.comerEventService.getAllEvent(params).subscribe({
      next: resp => {
        this.event = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.event = new DefaultSelect();
      },
    });
  }

  changeEvent(event: any) {
    console.log(event);
  }

  async getInvoices() {
    return new Promise((resolve, reject) => {
      const date: any = this.form.get('rangeDate').value;
      const starDate = this.transforDate(date[0]);
      const endDate = this.transforDate(date[1]);

      //console.log(date, starDate, endDate);
      let body = {
        eventId: this.form.get('event').value,
        year: this.form.get('year').value,
        typeInvoice: this.form.get('typeCFDI').value,
        statusInvoice: this.form.get('statusInvoice').value,
        startDate: starDate,
        endDate: endDate,
        goodTp: this.form.get('goods').value,
      };
      let param = {
        ...this.params1.getValue(),
      };
      console.log(body);
      this.msInvoiceService.getGetGegrafica(body, param).subscribe({
        next: resp => {
          console.log(resp.message);
          if (resp.message) {
            resolve(resp.message);
          } else {
            resolve(null);
          }
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  transforDate(dateStart: Date) {
    const year = dateStart.getFullYear();
    const month = dateStart.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1
    const day = dateStart.getDate();
    return `${year}-${month}-${day}`;
  }

  clean() {
    //rangeDate
  }

  exportAll() {}
}
