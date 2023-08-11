import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ComerDirectInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-detinvoice.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { ComerRectInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-rectinvoice.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { BasePage } from 'src/app/core/shared';
import { NAME_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { ComerRediModalComponent } from '../comer-redi-modal/comer-redi-modal.component';
import { NewImageModalComponent } from '../new-image-modal/new-image-modal.component';
import { REDICET_FACTURAS } from './columna';

@Component({
  selector: 'app-invoice-rectification-process',
  templateUrl: './invoice-rectification-process.component.html',
  styles: [],
})
export class InvoiceRectificationProcessComponent
  extends BasePage
  implements OnInit
{
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  form: FormGroup = new FormGroup({});
  dataElabora: DefaultSelect = new DefaultSelect();
  dataVerifica: DefaultSelect = new DefaultSelect();
  dataExpide: DefaultSelect = new DefaultSelect();
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  parameter = {
    PDIRECCION: 'M',
  };
  totalItems: number = 0;
  loadingSearch: boolean = false;
  isSearch: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private comerRectInoviceService: ComerRectInvoiceService,
    private parameterModsService: ParameterModService,
    private route: ActivatedRoute,
    private comerDirectInovice: ComerDirectInvoiceService,
    private datePipe: DatePipe,
    private parameterComer: ParameterModService,
    private authService: AuthService,
    private comerInvoiceService: ComerInvoiceService,
    private jasperService: SiabService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        edit: true,
        delete: true,
        add: false,
      },
      columns: { ...REDICET_FACTURAS },
    };
    this.settings.hideSubHeader = false;
    this.parameter.PDIRECCION =
      this.route.snapshot.queryParamMap.get('PDIRECCION') ?? 'M';
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getParamElabora(new ListParams());
    this.getParamExpide(new ListParams());
    this.getParamVerifica(new ListParams());

    this.dataFilter
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          const { jobNot } = this.form.value;

          if (!jobNot) {
            this.alert(
              'warning',
              'Detalle Factura',
              'Ingrese un Número de Oficio'
            );
            return;
          }
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              invoicefield: () => (searchFilter = SearchFilter.ILIKE),
              worthCurrent: () => (searchFilter = SearchFilter.ILIKE),
              worthNew: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getComerDirectInvoice();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems > 0) this.getComerDirectInvoice();
    });
  }

  searchData() {
    const {
      Invoice,
      InvoiceAttention,
      attentionDate,
      billDate,
      billId,
      check,
      documentspresented,
      elaborates,
      eventId,
      expDate,
      hourAttention,
      inrepresentation,
      issues,
      jobNot,
      jobpriceNot,
      lastnameMat,
      lastnamePat,
      name,
      paragraph1,
      paragraph3,
      paragraph4,
      series,
      year,
      yearPrice,
    } = this.form.value;

    if (
      !jobNot &&
      !expDate &&
      !series &&
      !Invoice &&
      !name &&
      !lastnameMat &&
      !lastnamePat &&
      !inrepresentation
    )
      return;

    const params = new ListParams();

    if (jobNot) params['filter.jobNot'] = `${SearchFilter.EQ}:${jobNot}`;
    if (expDate)
      params['filter.expDate'] = `${SearchFilter.EQ}:${
        typeof expDate == 'string'
          ? expDate.split('/').reverse().join('-')
          : this.datePipe.transform(expDate, 'yyyy-MM-dd')
      }`;
    if (series) params['filter.series'] = `${SearchFilter.ILIKE}:${series}`;
    if (Invoice) params['filter.Invoice'] = `${SearchFilter.EQ}:${Invoice}`;
    if (name) params['filter.name'] = `${SearchFilter.ILIKE}:${name}`;
    if (lastnameMat)
      params['filter.lastnameMat'] = `${SearchFilter.ILIKE}:${lastnameMat}`;
    if (lastnamePat)
      params['filter.lastnamePat'] = `${SearchFilter.ILIKE}:${lastnamePat}`;
    if (inrepresentation)
      params[
        'filter.inrepresentation'
      ] = `${SearchFilter.ILIKE}:${inrepresentation}`;
    this.loadingSearch = true;
    this.getComerRectInovice(params);
  }

  getComerDirectInvoice() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.comerDirectInovice.getAll(params).subscribe({
      next: resp => {
        this.dataFilter.load(resp.data);
        this.dataFilter.refresh();
        this.totalItems = resp.count;
        this.loading = false;
      },
      error: err => {
        this.dataFilter.load([]);
        this.dataFilter.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  getComerRectInovice(params?: ListParams) {
    this.comerRectInoviceService.getAll(params).subscribe({
      next: resp => {
        this.loadingSearch = false;
        this.isSearch = true;
        const rectInvoice = resp.data[0];

        rectInvoice.expDate = rectInvoice.expDate
          ? rectInvoice.expDate.split('-').reverse().join('/')
          : '';
        rectInvoice.attentionDate = rectInvoice.attentionDate
          ? rectInvoice.attentionDate.split('-').reverse().join('/')
          : '';

        const fecha = rectInvoice.hourAttention
          ? rectInvoice.hourAttention.split(' ')
          : null;

        rectInvoice.hourAttention = rectInvoice.hourAttention
          ? `${fecha[0].split('-').reverse().join('/')} ${fecha[1]}`
          : null;

        this.form.patchValue(rectInvoice);
        this.paramsList.getValue()[
          'filter.notJob'
        ] = `${SearchFilter.EQ}:${rectInvoice.jobNot}`;
        this.getComerDirectInvoice();
      },
      error: err => {
        this.loadingSearch = false;
        this.alert('error', 'Error', 'No se encontraron resultados');
      },
    });
  }

  parseDateNoOffset(date: string | Date): Date {
    const dateLocal = new Date(date);
    return new Date(
      dateLocal.valueOf() - dateLocal.getTimezoneOffset() * 60 * 1000
    );
  }

  saveData() {
    if (!this.isSearch) this.setYear();

    const saveData = this.form.value;

    saveData.expDate =
      typeof saveData.expDate == 'string'
        ? saveData.expDate.split('/').reverse().join('-')
        : this.datePipe.transform(saveData.expDate, 'yyyy-MM-dd');
    saveData.attentionDate =
      typeof saveData.attentionDate == 'string'
        ? saveData.attentionDate.split('/').reverse().join('-')
        : this.datePipe.transform(saveData.attentionDate, 'yyyy-MM-dd');

    if (this.isSearch) {
      if (typeof saveData.hourAttention == 'string') {
        const fecha = saveData.hourAttention.split(' ');
        saveData.hourAttention = `${fecha[0].split('/').reverse().join('-')} ${
          fecha[1]
        }`;
      } else {
        saveData.hourAttention = this.parseDateNoOffset(saveData.hourAttention);
      }
      saveData.billDate =
        typeof saveData.billDate == 'string'
          ? saveData.billDate.split('/').reverse().join('-')
          : saveData.billDate;

      this.comerRectInoviceService.update(saveData).subscribe({
        next: () => {
          this.alert(
            'success',
            'Rectificación de Factura',
            'Actualizado correctamente'
          );
        },
        error: err => {
          this.alert('error', 'Error', err.error.message);
        },
      });
    } else {
      if (typeof saveData.hourAttention == 'string') {
        const fecha = saveData.hourAttention.split(' ');
        saveData.hourAttention = `${fecha[0].split('/').reverse().join('-')} ${
          fecha[1]
        }`;
      } else {
        saveData.hourAttention = this.parseDateNoOffset(saveData.hourAttention);
      }

      saveData.billDate =
        typeof saveData.billDate == 'string'
          ? saveData.billDate.split('/').reverse().join('-')
          : saveData.billDate;

      this.comerRectInoviceService.create(saveData).subscribe({
        next: () => {
          this.isSearch = true;
          this.alert(
            'success',
            'Rectificación de Factura',
            'Creado correctamente'
          );
        },
        error: err => {
          this.alert('error', 'Error', err.error.message);
        },
      });
    }
  }

  saveDataSilent() {
    if (!this.isSearch) this.setYear();

    const saveData = this.form.value;

    saveData.expDate =
      typeof saveData.expDate == 'string'
        ? saveData.expDate.split('/').reverse().join('-')
        : this.datePipe.transform(saveData.expDate, 'yyyy-MM-dd');
    saveData.attentionDate =
      typeof saveData.attentionDate == 'string'
        ? saveData.attentionDate.split('/').reverse().join('-')
        : this.datePipe.transform(saveData.attentionDate, 'yyyy-MM-dd');

    if (!this.isSearch) {
      if (typeof saveData.hourAttention == 'string') {
        const fecha = saveData.hourAttention.split(' ');
        saveData.hourAttention = `${fecha[0].split('/').reverse().join('-')} ${
          fecha[1]
        }`;
      } else {
        saveData.hourAttention = this.parseDateNoOffset(saveData.hourAttention);
      }

      saveData.billDate =
        typeof saveData.billDate == 'string'
          ? saveData.billDate.split('/').reverse().join('-')
          : saveData.billDate;

      this.comerRectInoviceService.create(saveData).subscribe({
        next: () => {
          this.isSearch = true;
        },
        error: err => {
          this.alert('error', 'Error', err.error.message);
        },
      });
    }
  }

  setYear() {
    const { expDate } = this.form.value;
    let year =
      typeof expDate == 'string'
        ? Number(expDate.split('/')[2])
        : expDate
        ? Number(this.datePipe.transform(expDate, 'yyyy'))
        : null;
    this.form.get('year').patchValue(year);
  }

  getParamElabora(params?: ListParams) {
    params[
      'filter.address'
    ] = `${SearchFilter.EQ}:${this.parameter.PDIRECCION}`;
    params['filter.parameter'] = `${SearchFilter.EQ}:USUELARECT`;
    this.parameterModsService.getAll(params).subscribe({
      next: resp => {
        this.dataElabora = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.dataElabora = new DefaultSelect();
      },
    });
  }
  getParamVerifica(params?: ListParams) {
    params[
      'filter.address'
    ] = `${SearchFilter.EQ}:${this.parameter.PDIRECCION}`;
    params['filter.parameter'] = `${SearchFilter.EQ}:USUVERRECT`;
    this.parameterModsService.getAll(params).subscribe({
      next: resp => {
        this.dataVerifica = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.dataVerifica = new DefaultSelect();
      },
    });
  }

  getParamExpide(params?: ListParams) {
    params[
      'filter.address'
    ] = `${SearchFilter.EQ}:${this.parameter.PDIRECCION}`;
    params['filter.parameter'] = `${SearchFilter.EQ}:USUEXPRECT`;
    this.parameterModsService.getAll(params).subscribe({
      next: resp => {
        this.dataExpide = new DefaultSelect(resp.data, resp.count);
      },
      error: err => {
        this.dataExpide = new DefaultSelect();
      },
    });
  }

  private prepareForm() {
    this.form = this.fb.group({
      Invoice: [null],
      InvoiceAttention: [null, Validators.pattern(STRING_PATTERN)],
      attentionDate: [null, Validators.pattern(STRING_PATTERN)],
      billDate: [null],
      billId: [null],
      check: [null],
      documentspresented: [null, Validators.pattern(STRING_PATTERN)],
      elaborates: [null],
      eventId: [null],
      expDate: [null, Validators.required],
      hourAttention: [
        `${this.datePipe.transform(new Date(), 'dd/MM/yyyy')} 12:00`,
        Validators.required,
      ],
      inrepresentation: [null, Validators.pattern(STRING_PATTERN)],
      issues: [null],
      jobNot: [null, Validators.required],
      jobpriceNot: [null],
      lastnameMat: [null, Validators.pattern(NAME_PATTERN)],
      lastnamePat: [null, Validators.pattern(NAME_PATTERN)],
      name: [null, Validators.pattern(NAME_PATTERN)],
      nbOrigin: [null],
      origin: [null],
      paragraph1: [null, Validators.pattern(STRING_PATTERN)],
      paragraph3: [null, Validators.pattern(STRING_PATTERN)],
      paragraph4: [null, Validators.pattern(STRING_PATTERN)],
      series: [null, Validators.pattern(STRING_PATTERN)],
      year: [null],
      yearPrice: [null],
    });
  }

  newData() {
    this.form.reset();
    this.dataFilter.load([]);
    this.dataFilter.refresh();
    this.totalItems = 0;
    this.isSearch = false;
    this.form.get('hourAttention').patchValue(`
    ${this.datePipe.transform(new Date(), 'dd/MM/yyyy')} 12:00
    `);
  }

  cleanData() {
    this.form.reset();
    this.dataFilter.load([]);
    this.dataFilter.refresh();
    this.totalItems = 0;
    this.isSearch = false;
    this.form.get('hourAttention').patchValue(`
    ${this.datePipe.transform(new Date(), 'dd/MM/yyyy')} 12:00
    `);
  }

  openModal(): void {
    const modalRef = this.modalService.show(NewImageModalComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  openForm(data: any) {}

  openPrevPdf() {
    const { jobNot } = this.form.value;

    if (!jobNot) {
      this.alert('error', 'Error', 'Ingrese un Número de Oficio');
      return;
    }

    this.jasperService.fetchReportBlank('blank').subscribe({
      next: resp => {
        const blob = new Blob([resp], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config: ModalOptions = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
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
      },
      error: () => {},
    });
  }

  postChangeFolio() {
    const { name, series, Invoice } = this.form.value;
    if (!name) {
      if (!series || !Invoice) return;
      this.getDataValue(series, Invoice);
    }
  }

  getDataValue(series: string, Invoice: number) {
    const filter = new FilterParams();
    filter.addFilter('series', series, SearchFilter.EQ);
    filter.addFilter('Invoice', Invoice, SearchFilter.EQ);
    this.comerInvoiceService.getAll(filter.getParams()).subscribe({
      next: resp => {
        const data = resp.data[0];

        this.form.get('name').patchValue(data.customer);
        this.form.get('billId').patchValue(data.billId);
        this.form.get('eventId').patchValue(data.eventId);

        let date = data.impressionDate ?? null;

        if (date) {
          date = date.split('-').reverse().join('/');
        }

        this.form.get('billDate').patchValue(date);
      },
      error: () => {},
    });
  }

  getFirmantes() {
    const { issues } = this.form.value;

    const user = this.authService.decodeToken();

    if (!issues) {
      this.parameterComer
        .getAsigna(user.username.toUpperCase(), this.parameter.PDIRECCION)
        .subscribe({
          next: resp => {
            this.form.get('elaborates').patchValue(resp.elabora);
            this.form.get('check').patchValue(resp.expide);
            this.form.get('issues').patchValue(resp.verifica);
          },
          error: () => {},
        });
    }
  }

  async setParaghrapAll(val: any) {
    if (!val) return;

    const {
      attentionDate,
      hourAttention,
      inrepresentation,
      name,
      lastnameMat,
      lastnamePat,
      InvoiceAttention,
      series,
      Invoice,
      billDate,
    } = this.form.value;
    let AUX_FECHA: string,
      AUX_CADENA: string,
      CADENA: string,
      AUX_INTERESADO: string,
      AUX_FECHAFACT: string,
      AUX_HORA: string;

    if (!attentionDate) return;

    const parr1 = await this.getValor('PARRAFO1_REF');
    const parr3 = await this.getValor('PARRAFO3_REF');
    const parr4 = await this.getValor('PARRAFO4_REF');

    let date = this.datePipe.transform(attentionDate, 'yyyy/MM/dd');

    const day = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const year = Number(date.split('/')[0]);

    const months = [
      'ENERO',
      'FEBRERO',
      'MARZO',
      'ABRIL',
      'MAYO',
      'JUNIO',
      'JULIO',
      'AGOSTO',
      'SEPTIEMBRE',
      'OCTUBRE',
      'NOVIEMBRE',
      'DICIEMBRE',
    ];
    AUX_CADENA = parr1;
    AUX_FECHA = `${day} de ${months[Number(month - 1)]} del ${year}`;
    CADENA = AUX_CADENA.replace('&DIA', AUX_FECHA);

    AUX_HORA =
      typeof hourAttention == 'string'
        ? this.datePipe.transform(
            new Date(
              `${hourAttention.split(' ')[0].split('/').reverse().join('/')} ${
                hourAttention.split(' ')[1]
              }`
            ),
            'h:mm a'
          ) //hourAttention.split(' ')[1]
        : this.datePipe.transform(hourAttention, 'h:mm a');
    CADENA = CADENA.replace('&HORA', AUX_HORA);

    let interesado: string = '';

    if (inrepresentation) {
      interesado = `${inrepresentation ?? ''} EN REPRESENTACION DE ${
        name ?? ''
      } ${lastnamePat ?? ''} ${lastnameMat ?? ''}`;
    } else {
      interesado = `${name ?? ''} ${lastnamePat ?? ''} ${lastnameMat ?? ''}`;
    }
    interesado = interesado.trim();

    AUX_INTERESADO = interesado;
    CADENA = CADENA.replace('&INTERESADO', AUX_INTERESADO);
    CADENA = CADENA.replace('&FOLIO', InvoiceAttention ?? '');
    CADENA = CADENA.replace('&SERIE', series ?? '');
    CADENA = CADENA.replace('&NOFACT', Invoice ?? '');

    const year2 = billDate ? Number(billDate.split('/')[2]) : null;
    const month2 = billDate ? Number(billDate.split('/')[1]) : null;
    const day2 = billDate ? Number(billDate.split('/')[0]) : null;

    AUX_FECHAFACT = billDate
      ? `${day2} de ${months[Number(month2 - 1)]} de ${year2}`
      : '';
    CADENA = CADENA.replace('&FECHAFACT', billDate ? AUX_FECHAFACT : '');

    this.form.get('paragraph1').patchValue(CADENA);
    this.form.get('paragraph3').patchValue(parr3);
    this.form.get('paragraph4').patchValue(parr4);
  }

  async getValor(param: string) {
    const filter = new ListParams();
    filter['filter.parameter'] = `${SearchFilter.EQ}:${param}`;
    return firstValueFrom(
      this.parameterModsService.getAll(filter).pipe(
        map(resp => resp.data[0].value),
        catchError(() => of(null))
      )
    );
  }

  openModalSeparate(context?: any) {
    const { jobNot } = this.form.value;

    if (!jobNot) {
      this.alert('error', 'Error', 'Ingrese un número de oficio');
      return;
    }

    this.saveDataSilent();

    let config: ModalOptions = {
      initialState: {
        allotment: context,
        factura: this.form.value,
        callback: (next: boolean) => {
          if (next) {
            if (!this.isSearch) {
              this.paramsList.getValue()[
                'filter.notJob'
              ] = `${SearchFilter.EQ}:${jobNot}`;
            }
            this.getComerDirectInvoice();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ComerRediModalComponent, config);
  }

  remove(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este registro?'
    ).then(answ => {
      if (answ.isConfirmed) {
        this.comerDirectInovice
          .remove({ year: data.year, row: data.row, notJob: data.notJob })
          .subscribe({
            next: () => {
              this.alert(
                'success',
                'Detalle Facturación',
                'Eliminado Correctamente'
              );
              this.getComerDirectInvoice();
            },
            error: err => {
              if (err.status == 500) {
                if (
                  err.error.message.includes('violates foreign key constraint')
                ) {
                  this.alert(
                    'error',
                    'Error',
                    'Debe eliminar las relaciones de este detalle facturación'
                  );
                  return;
                }
              }
              this.alert('error', 'Error', err.error.message);
            },
          });
      }
    });
  }
}
