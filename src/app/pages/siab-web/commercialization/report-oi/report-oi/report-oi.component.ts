import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { maxDate } from 'src/app/common/validations/date.validators';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { REPORT_OI_COLUMNS } from './report-oi-columns';

@Component({
  selector: 'app-report-oi',
  templateUrl: './report-oi.component.html',
  styles: [],
})
export class reportOiComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  formReport: FormGroup = new FormGroup({});
  today: Date;
  maxDate: Date;
  minDate: Date;
  show = false;
  data: LocalDataSource = new LocalDataSource();
  columns: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  pdfurl = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  private isFirstLoad = true;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private orderentry: orderentryService,
    private excelService: ExcelService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...REPORT_OI_COLUMNS },
    };
    this.today = new Date();
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 2);
  }

  ngOnInit(): void {
    this.prepareForm();

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (!this.isFirstLoad) {
        this.ObtenerRepOI();
      }
    });
    this.isFirstLoad = false;
  }

  private prepareForm() {
    this.form = this.fb.group({
      rangeDate: [null, [Validators.required, maxDate(new Date())]],
      typeAuction: [null, [Validators.required]],
      idEvent: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    this.formReport = this.fb.group({
      NameReport: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  data1 = [
    {
      coordRegional: 'coordRegional',
      autoridad: 'autoridad',
      noBienSiab: 'noBienSiab',
      descBien: 'descBien',
      cant: 'cant',
      uniMedida: 'uniMedida',
      lote: 'lote',
      actaEntregaRecep: 'actaEntregaRecep',
      fechaDelActa: 'fechaDelActa',
      importGravIva: 'importGravIva',
      ivaV: 'ivaV',
      importExcIva: 'importExcIva',
      retenIva: 'retenIva',
    },
  ];

  openPrevPdf() {
    let config: ModalOptions = {
      initialState: {
        documento: {
          urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfurl),
          type: 'pdf',
        },
        callback: (data: any) => {},
      }, //pasar datos por aca
      class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      ignoreBackdropClick: true, //ignora el click fuera del modal
    };
    this.modalService.show(PreviewDocumentsComponent, config);
  }

  ObtenerRepOI() {
    const rangeDateValue = this.form.get('rangeDate').value;

    const fechaInicial = moment(rangeDateValue[0]).format('YYYY-MM-DD');
    const fechaFinal = moment(rangeDateValue[1]).format('YYYY-MM-DD');

    console.log('Fecha inicial:', fechaInicial);
    console.log('Fecha final:', fechaFinal);

    if (!this.form.get('typeAuction').value) {
      this.alert('warning', 'Debe Ingresar un Tipo de Subasta', '');
      return;
    }

    let body = {
      fInicio: fechaInicial,
      fFin: fechaFinal,
      direc: this.form.get('typeAuction').value,
      eventId: this.form.get('idEvent').value,
      ...this.params.getValue(),
    };

    let params = {
      ...this.params.getValue(),
    };

    console.log(body);

    this.orderentry.getorderentry(body, params).subscribe({
      next: resp => {
        console.log(resp);
        if (resp.data.length === 0) {
          this.alert(
            'warning',
            'No Existen Registros Correspondientes a este Rango de Fechas',
            ''
          );
          return;
        }
        this.show = true;
        this.data.load(resp.data);
        this.totalItems = resp.count;
      },
      error: err => {
        console.log(err);
      },
    });
  }

  exportXlsx() {
    const filename = this.formReport.get('NameReport').value;
    console.log(filename);

    const rangeDateValue = this.form.get('rangeDate').value;

    const fechaInicial = moment(rangeDateValue[0]).format('YYYY-MM-DD');
    const fechaFinal = moment(rangeDateValue[1]).format('YYYY-MM-DD');

    if (
      !this.form.get('idEvent').value ||
      !this.form.get('typeAuction').value
    ) {
      this.alert('warning', 'No existen datos para exportar', '');
      return;
    }
    // Hacer una copia de this.params1 si es necesario
    let params = { ...this.params.getValue() };

    let body = {
      fInicio: fechaInicial,
      fFin: fechaFinal,
      direc: this.form.get('typeAuction').value,
      eventId: this.form.get('idEvent').value,
    };

    this.orderentry.getorderentry(body, params).subscribe({
      next: resp => {
        const allData = resp.data;

        // Si hay más páginas de datos, recuperarlas
        const totalPages = Math.ceil(resp.count / params.pageSize);
        const additionalRequests = [];

        for (let page = 2; page <= totalPages; page++) {
          params.page = page;
          additionalRequests.push(this.orderentry.getorderentry(body, params));
        }

        // Combinar todos los registros en this.line
        forkJoin(additionalRequests).subscribe({
          next: additionalResponses => {
            for (const additionalResp of additionalResponses) {
              allData.push(...additionalResp.data);
            }
            this.alert('success', filename, 'Exportado Correctamente');
            this.excelService.export(allData, { type: 'csv', filename });
          },
          error: err => {
            console.log(err);
          },
        });
      },
      error: err => {
        console.log(err);
      },
    });
  }

  async exportCsv() {
    const filename = this.formReport.get('NameReport').value;
    this.excelService.export(await this.data.getAll(), {
      type: 'csv',
      filename,
    });
  }
}
