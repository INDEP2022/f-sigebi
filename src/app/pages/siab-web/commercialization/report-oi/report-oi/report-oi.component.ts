import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
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
      rangeDate: [null, [maxDate(new Date()), Validators.required]],
      typeAuction: [null, [Validators.required]],
      idEvent: [null, [Validators.pattern(NUMBERS_PATTERN)]],
    });
    this.formReport = this.fb.group({
      NameReport: [null, [Validators.pattern(STRING_PATTERN)]],
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
    if (this.form.get('rangeDate').value) {
      this.loading = true;
      const rangeDateValue = this.form.get('rangeDate').value;

      const fechaInicial = moment(rangeDateValue[0]).format('YYYY-MM-DD');
      const fechaFinal = moment(rangeDateValue[1]).format('YYYY-MM-DD');

      console.log('Fecha inicial:', fechaInicial);
      console.log('Fecha final:', fechaFinal);

      // if (!this.form.get('typeAuction').value) {
      //   this.alert('warning', 'Debe Ingresar un Tipo de Subasta', '');
      //   return;
      // }

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
            this.alert('warning', 'No se encontraron registros', '');
            return;
          }
          this.show = true;
          this.data.load(resp.data);
          this.totalItems = resp.count;
          this.loading = false;
        },
        error: err => {
          console.log(err);
          this.loading = false;
        },
      });
    } else {
      this.alert(
        'warning',
        'Verificar Rango de Fechas o Selecciona un tipo de Evento',
        ``
      );
    }
  }

  exportXlsx() {
    if (this.formReport.get('NameReport').value) {
      const filename = this.formReport.get('NameReport').value;
      console.log(filename);

      const rangeDateValue = this.form.get('rangeDate').value;

      const fechaInicial = moment(rangeDateValue[0]).format('YYYY-MM-DD');
      const fechaFinal = moment(rangeDateValue[1]).format('YYYY-MM-DD');

      let body = {
        fInicio: fechaInicial,
        fFin: fechaFinal,
        direc: this.form.get('typeAuction').value,
        eventId: this.form.get('idEvent').value
          ? this.form.get('idEvent').value
          : null,
      };
      this.orderentry.getorderentryExcel(body).subscribe({
        next: resp => {
          this._downloadExcelFromBase64(resp.base64File, filename);
          this.loader.load = false;
        },
        error: err => {
          console.log(err);
          this.loader.load = false;
        },
      });
    } else {
      this.alert('error', 'No se epecifico el nombre de la descarga', '');
      return;
    }
  }

  async exportCsv() {
    const filename = this.formReport.get('NameReport').value;
    this.excelService.export(await this.data.getAll(), {
      type: 'csv',
      filename,
    });
  }
}
