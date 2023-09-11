import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { maxDate } from 'src/app/common/validations/date.validators';
import { MsInvoiceService } from 'src/app/core/services/ms-invoice/ms-invoice.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ButtonColumnComponent } from 'src/app/shared/components/button-column/button-column.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  DETAIL_REPORT_COLUMNS,
  REPORT_INVOICE_COLUMNS,
} from './report-invoices-columns';

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
  totalItems2: number = 0;
  data: any;
  year1: number;
  inputControl = new FormControl('');
  validateExcel: boolean = true;

  array: any;
  arrayData: any;

  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();

  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters1: any = [];
  columnFilters2: any = [];

  dataDetail: string | number;

  settings1 = { ...this.settings };

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
      rowClassFunction: (row: any) => {
        console.log(row.data);
        switch (row.data.id_delegacion) {
          case '0':
            return 'bg-info0 text-white';
          //break;
          case '1':
            return 'bg-info1 text-white';
          //break;
          case '2':
            return 'bg-info2 text-white';
          //break;
          case '3':
            return 'bg-info3 text-white';
          //break;
          case '4':
            return 'bg-info4 text-white';
          //break;
          case '5':
            return 'bg-info5 text-white';
          //break;
          case '6':
            return 'bg-info6 text-white';
          //break;
          case '7':
            return 'bg-info7 text-white';
          //break;
          case '8':
            return 'bg-info8 text-white';
          //break;
          case '9':
            return 'bg-info9 text-white';
          //break;
          case '10':
            return 'bg-info10 text-white';
          //break;
          case '11':
            return 'bg-info11 text-white';
          //break;
          /*case '12':
            return 'bg-info12 text-white'*/
          //break;
          default:
            return 'bg-light text-black';
        }
      },
    };

    this.settings1 = {
      ...this.settings,
      hideSubHeader: false,
      columns: {
        officialConclusion: {
          title: 'Ver PDF',
          width: '5%',
          type: 'custom',
          sort: false,
          renderComponent: ButtonColumnComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              console.log(row);
              //this.seeOfficialConclusion(row);
            });
          },
        },
        seeClaimLetter: {
          title: 'Ver XML',
          width: '5%',
          type: 'custom',
          sort: false,
          renderComponent: ButtonColumnComponent,
          onComponentInitFunction: (instance: any) => {
            instance.onClick.subscribe((row: any) => {
              console.log(row);
              //this.seeClaimLetter(row);
            });
          },
        },

        ...DETAIL_REPORT_COLUMNS,
      },
    };

    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
    this.llenaDDLAnio();

    this.form = this.fb.group({
      rangeDate: [null, [Validators.required]],
      year: [null, []],
    });
  }

  get rangeDate() {
    return this.form.get('rangeDate') as FormControl;
  }

  get year() {
    return this.form.get('year') as FormControl;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id_delegacion':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cuenta_fac':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDataAll();
        }
      });

    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id_delegacion':
                searchFilter = SearchFilter.EQ;
                break;
              case 'cuenta_fac':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getDetailInvoices();
        }
      });
  }

  private prepareForm() {
    this.form = this.fb.group({
      rangeDate: [null, [maxDate(new Date())]],
      typeCFDI: [null, [Validators.required]],
      statusInvoice: [null, [Validators.required]],
      goods: [null, [Validators.required]],
      event: [null, [Validators.required]],
      year: [null, [Validators.required]],
      valid: ['A', [Validators.required]],
    });
    setTimeout(() => {
      this.getEvent(new ListParams());
    }, 1000);
    this.form.get('rangeDate').disable();
  }

  changeValid(event: any) {
    if (event == 'A') {
      this.year.setValidators([Validators.required]);
      this.rangeDate.setValidators([]);
      this.form.get('rangeDate').setValue('');
      this.form.get('rangeDate').disable();
      this.form.get('year').enable();
    } else if (event == 'R') {
      this.year.setValidators([]);
      this.rangeDate.setValidators([Validators.required]);
      this.form.get('year').setValue('');
      this.form.get('year').disable();
      this.form.get('rangeDate').enable();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.form.reset();
      this.array = [];
      this.dataFormatPercentage = [];
      this.dataFormat = [];
      this.data1.load([]);
      this.data1.refresh();
      this.data2.load([]);
      this.data2.refresh();
      console.log(this.data);
    }
    console.warn('Your order has been submitted');
  }

  consult() {
    this.validateExcel = true;
    this.show = true;
    this.array = [];
    this.dataFormatPercentage = [];
    this.dataFormat = [];
    this.data1.load([]);
    this.data1.refresh();
    this.data2.load([]);
    this.data2.refresh();
    this.consultInvoices();
  }

  async consultInvoices() {
    let getGrafica = await this.getInvoices();
    console.log(getGrafica);
    this.array = getGrafica;
    this.arrayData = this.array.data;
    console.log(this.arrayData);
    for (let i = 0; i < this.array.count; i++) {
      if (this.arrayData[i].accountFac > 0) {
        const data: any = {
          color: this.arrayData[i].color,
          cuenta_fac: this.arrayData[i].accountFac,
          descripcion: this.arrayData[i].description,
          id_delegacion: this.arrayData[i].delegationId,
        };
        this.totInvoices =
          Number(this.totInvoices) + Number(this.arrayData[i].accountFac);
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
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getDataAll());

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
    console.log(this.dataFormatPercentage);
    if (this.dataFormatPercentage) {
      this.data1.load(this.dataFormatPercentage);
      this.data1.refresh();
      this.totalItems = this.dataFormatPercentage.length;
      this.loading = false;
    }
    /*this.data = this.dataFormatPercentage;
    console.log(this.data);
    this.totalItems = this.data.length;
    console.log(this.totalItems);*/
  }

  rowSelect(event: any) {
    let data3 = event.data;
    console.log(data3.id_delegacion);
    this.dataDetail = data3.id_delegacion;
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDetailInvoices(this.dataDetail));
    console.log(event.data);
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
    console.log(params.text);
    if (params.text) {
      params['filter.processKey'] = `$ilike:${params.text}`;
    }
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
      let startDate = '';
      let endDate = '';
      let year1 = 0;
      if (this.form.get('rangeDate').value) {
        const date: any = this.form.get('rangeDate').value;
        startDate = this.transforDate(date[0]);
        endDate = this.transforDate(date[1]);
      }
      if (this.form.get('year').value) {
        year1 = this.form.get('year').value;
      }
      //console.log(date, starDate, endDate);
      let body = {
        eventId: this.form.get('event').value,
        year: year1,
        typeInvoice: this.form.get('typeCFDI').value,
        statusInvoice: this.form.get('statusInvoice').value,
        startDate: startDate,
        endDate: endDate,
        goodTp: this.form.get('goods').value,
      };
      this.params1.getValue()['limit'] = 20;
      let param = {
        ...this.params1.getValue(),
        ...this.columnFilters1,
      };
      console.log(body);
      this.msInvoiceService.getGetGegrafica(body, param).subscribe({
        next: resp => {
          console.log(resp);
          if (resp.data) {
            resolve(resp);
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

  getDetailInvoices(noDel?: number | string) {
    if (noDel) {
      this.loading = true;
      let startDate = '';
      let endDate = '';
      let year1 = 0;
      if (this.form.get('rangeDate').value) {
        const date: any = this.form.get('rangeDate').value;
        startDate = this.transforDate(date[0]);
        endDate = this.transforDate(date[1]);
      }
      if (this.form.get('year').value) {
        year1 = this.form.get('year').value;
      }
      //console.log(date, starDate, endDate);
      let body = {
        idEvento: this.form.get('event').value,
        anio: year1,
        tipoFac: this.form.get('typeCFDI').value,
        estatusFac: this.form.get('statusInvoice').value,
        fecInicio: startDate,
        fecFin: endDate,
        tpBien: this.form.get('goods').value,
        noRegional: noDel,
      };
      let param = {
        ...this.params2.getValue(),
        ...this.columnFilters2,
      };
      console.log(body);
      this.msInvoiceService.getDetailGetGegrafica(body, param).subscribe({
        next: resp => {
          this.validateExcel = false;
          //console.log(resp.data);
          this.data2.load(resp.data);
          this.data2.refresh();
          let resp1 = resp.data;
          this.totalItems2 = resp1.length;
          //console.log(this.totalItems2, resp);
          this.loading = false;
        },
        error: err => {
          this.validateExcel = true;
          this.loading = false;
          this.data2.load([]);
          this.data2.refresh();
          this.totalItems2 = 0;
        },
      });
    }
  }

  getDetailInvoicesExcel() {
    this.loading = true;
    let startDate = '';
    let endDate = '';
    let year1 = 0;
    if (this.form.get('rangeDate').value) {
      const date: any = this.form.get('rangeDate').value;
      startDate = this.transforDate(date[0]);
      endDate = this.transforDate(date[1]);
    }
    if (this.form.get('year').value) {
      year1 = this.form.get('year').value;
    }
    //console.log(date, starDate, endDate);
    let body = {
      eventId: this.form.get('event').value,
      year: year1,
      typeInvoice: this.form.get('typeCFDI').value,
      statusInvoice: this.form.get('statusInvoice').value,
      dateStart: startDate,
      dateEnd: endDate,
      goodTp: this.form.get('goods').value,
      regionalNo: this.dataDetail,
    };
    console.log(body);
    this.msInvoiceService.getGetGegraficaDetailExcel(body).subscribe({
      next: resp => {
        this.downloadDocument('Detalle de Facturas', 'excel', resp.base64File);
      },
      error: err => {
        console.log(err);
      },
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
  changeValue(event: any) {
    const value = this.form.get('year').value;
    console.log(event, value);
  }

  //Descargar Excel
  downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.loading = false;
    this.alert('success', 'Reporte Excel', 'Descarga Finalizada');
    URL.revokeObjectURL(objURL);
  }

  base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
