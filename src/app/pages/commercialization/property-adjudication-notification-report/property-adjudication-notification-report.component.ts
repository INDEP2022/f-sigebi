import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BatchService } from 'src/app/core/services/catalogs/batch.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
//BasePage
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-property-adjudication-notification-report',
  templateUrl: './property-adjudication-notification-report.component.html',
  styleUrls: ['property-adjudication-notification-report.component.scss'],
})
export class PropertyAdjudicationNotificationReportComponent
  extends BasePage
  implements OnInit
{
  batchList: any;
  desc: any;
  descType: string;
  dataBatch: any;
  totalItems: number = 0;
  form: FormGroup;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private fb: FormBuilder,
    private batchService: BatchService,
    private reportService: ReportService
  ) {
    super();
  }

  settings4 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: { ...dataBatchColum },
    noDataMessage: 'No se encontrarón registros',
  };

  data4 = EXAMPLE_DAT4;

  ngOnInit(): void {
    this.prepareForm();
    this.getBatch();
  }

  prepareForm() {
    this.form = this.fb.group({
      evento: [null, [Validators.required]],
      claveOficio: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      fechaFallo: [null],
      FechaLimPago: [null],
      texto1: [null, [Validators.pattern(STRING_PATTERN)]],
      texto2: [null, [Validators.pattern(STRING_PATTERN)]],
      texto3: [null, [Validators.pattern(STRING_PATTERN)]],
      texto4: [null, [Validators.pattern(STRING_PATTERN)]],
      firmante: [null, [Validators.pattern(STRING_PATTERN)]],
      elaboro: [null, [Validators.pattern(STRING_PATTERN)]],
      ccp1: [null, [Validators.pattern(STRING_PATTERN)]],
      ccp2: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }
  userRowSelect(event: any) {
    this.reportService.getBatch(event.data.description).subscribe({
      next: data => {
        this.desc = data;
        console.log(this.desc);
      },
      error: error => (this.loading = false),
    });
  }

  getBatch() {
    this.loading = true;
    this.batchService.getAll(this.params.getValue()).subscribe({
      next: data => {
        this.batchList = data;
        this.dataBatch = this.batchList.data;
        this.totalItems = data.count;
        console.log(this.dataBatch);
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  confirm(): void {
    let params = {
      DESTYPE: this.descType,
      P_EVENTO: this.form.controls['evento'].value,
    };

    //this.showSearch = true;
    console.log(params);
    const start = new Date(this.form.get('fechaFallo').value);
    const end = new Date(this.form.get('FechaLimPago').value);

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
        'Fecha final no puede ser menor a fecha de inicio'
      );
      return;
    }

    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FCOMERNOTIFICAINMU.pdf?DESTYPE=${params.DESTYPE}&P_EVENTO=${params.P_EVENTO}`;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    window.open(pdfurl, ' FCOMERNOTIFICAINMU.pdf');
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);

    this.loading = false;
    this.cleanForm();
  }

  cleanForm(): void {
    this.form.reset();
  }
}

const EXAMPLE_DAT4 = [
  {
    lotePublico: 'prueba',
    decripcion: 'descripción',
    cliente: 'jose',
    noOficio: 1,
  },
  {
    lotePublico: 'prueba',
    decripcion: 'descripción',
    cliente: 'jose',
    noOficio: 1,
  },
  {
    lotePublico: 'prueba',
    decripcion: 'descripción',
    cliente: 'jose',
    noOficio: 1,
  },
  {
    lotePublico: 'prueba',
    decripcion: 'descripción',
    cliente: 'jose',
    noOficio: 1,
  },
  {
    lotePublico: 'prueba',
    decripcion: 'descripción',
    cliente: 'jose',
    noOficio: 1,
  },
  {
    lotePublico: 'prueba',
    decripcion: 'descripción',
    cliente: 'jose',
    noOficio: 1,
  },
];
export const dataBatchColum = {
  id: {
    title: 'id Lote',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Description',
    type: 'string',
    sort: false,
  },
  numRegister: {
    title: 'Número de registro',
    type: 'number',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
};
