import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { IComerLotsEG } from 'src/app/core/models/ms-parametercomer/parameter';
import { ComerLotService } from 'src/app/core/services/ms-parametercomer/comer-lot.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
export interface IReport {
  data: File;
}

@Component({
  selector: 'app-release-letter-report',
  templateUrl: './release-letter-report.component.html',
  styleUrls: ['release-letter-report.component.scss'],
})
export class ReleaseLetterReportComponent extends BasePage implements OnInit {
  goodList: IGood;
  dataGood: any;
  totalItems: number = 0;
  idEvent: number = 0;
  selectEvent = new DefaultSelect<IComerLotsEG>();
  selectLot = new DefaultSelect<IComerLotsEG>();
  idLot: number = 0;
  valid: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      goodId: {
        title: 'Bien',
        type: 'string',
        sort: false,
      },
      description: {
        title: 'Descripcion',
        type: 'string',
        sort: false,
      },
      quantity: {
        title: 'Valor',
        type: 'string',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  settings2 = {
    ...this.settings,
    actions: false,
    columns: { ...RELEASE_REPORT_COLUMNS },
  };

  data = EXAMPLE_DATA;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private comerLotService: ComerLotService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getEvent(this.params.getValue());
    this.getLot(this.params.getValue());
  }

  prepareForm() {
    this.form = this.fb.group({
      evento: [null, [Validators.required]],
      lote: [null, [Validators.required]],
      oficio: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      diridoA: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      puesto: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      parrafo1: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      adjudicatorio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      factura: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      fechaFactura: [null, [Validators.required]],
      parrafo2: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      firmante: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ccp1: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      ccp2: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      puestoFirma: [null],
      puestoCcp1: [null],
      puestoCcp2: [null],
      fechaCarta: [null],
    });
  }

  confirm(): void {
    console.log(this.form.value);
    this.valid = true;
    let params = {
      DESTYPE: this.form.controls['evento'].value,
      ID_LOTE: this.form.controls['lote'].value,
      OFICIO_CARTALIB: this.form.controls['oficio'].value,
      DIRIGIDO_A: this.form.controls['diridoA'].value,
      PUESTO: this.form.controls['puesto'].value,
      PARRAFO1: this.form.controls['parrafo1'].value,
      ADJUDICATARIO: this.form.controls['adjudicatorio'].value,
      NO_FACTURA: this.form.controls['factura'].value,
      FECHA_FACTURA: this.form.controls['fechaFactura'].value,
      PARRAFO2: this.form.controls['parrafo2'].value,
      FIRMANTE: this.form.controls['firmante'].value,
      PUESTOFIRMA: this.form.controls['puestoFirma'].value,
      CCP1: this.form.controls['ccp1'].value,
      CCP2: this.form.controls['ccp1'].value,
      PUESTOCCP1: this.form.controls['puestoCcp1'].value,
      PUESTOCCP2: this.form.controls['puestoCcp2'].value,
      FECHA_CARTA: this.form.controls['fechaCarta'].value,
    };
    // console.log(this.reportForm.value);

    // let params = { ...this.form.value };

    // for (const key in params) {
    //   if (params[key] === null) delete params[key];
    // }

    console.log(params);
    // open the window
    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);
    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/RCOMERCARTALIB.pdf?ID_LOTE=${params.ID_LOTE}&OFICIO_CARTALIB=${params.OFICIO_CARTALIB}&DIRIGIDO_A=${params.DIRIGIDO_A}&PUESTO=${params.PUESTO}&PARRAFO1=${params.PARRAFO1}&ADJUDICATARIO=${params.ADJUDICATARIO}&NO_FACTURA=${params.NO_FACTURA}&FECHA_FACTURA=${params.FECHA_FACTURA}&PARRAFO2=${params.PARRAFO2}&FIRMANTE=${params.FIRMANTE}&PARRAFO2=${params.PARRAFO2}&PUESTOFIRMA=${params.PUESTOFIRMA}&CCP1=${params.CCP1}&CCP2=${params.CCP2}&CCP1=${params.CCP1}&PUESTOCCP1=${params.PUESTOCCP1}&PUESTOCCP2=${params.PUESTOCCP2}&FECHA_CARTA=${params.FECHA_CARTA}`;

    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);

    window.open(pdfurl, 'RCOMERCARTALIB.pdf');
    this.loading = false;
    this.cleanForm();
  }

  // Generar() {
  //   this.reportService.getReportDiario(this.form.value).subscribe({
  //     next: (resp: any) => {
  //       if (resp.file.base64 !== '') {
  //         this.preview(url, params);
  //       } else {
  //         this.onLoadToast(
  //           'warning',
  //           'advertencia',
  //           'Sin datos para los rangos de fechas suministrados'
  //         );
  //       }

  //       return;
  //     },
  //   });
  // }
  getGood(search: any) {
    this.loading = true;
    this.comerLotService.findGLot(search).subscribe({
      next: data => {
        this.goodList = data.data;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  getEvent(params?: ListParams) {
    params['filter.event.statusvtaId'] = `$ilike:${params.text}`;
    params['filter.event.id'] = `$eq:${this.idEvent}`;
    this.comerLotService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.description = `${data.event.id}- ${data.event.statusvtaId}`;
          this.getGood(data.goodNumber);
          return data;
        });
        this.selectEvent = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.selectEvent = new DefaultSelect();
      },
    });
  }
  getLot(params?: ListParams) {
    params['filter.event.id'] = `$eq:${this.idEvent}`;
    this.comerLotService.getAll(params).subscribe({
      next: data => {
        data.data.map(data => {
          data.description = `${data.lotId}- ${data.description}`;
          return data;
        });
        this.selectLot = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.selectLot = new DefaultSelect();
      },
    });
  }

  cleanForm(): void {
    this.form.reset();
  }
  preview(url: string, params: ListParams) {
    try {
      this.reportService.download(url, params).subscribe(response => {
        if (response !== null) {
          let blob = new Blob([response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
}

export const RELEASE_REPORT_COLUMNS = {
  goodNumber: {
    title: 'Bien',
    type: 'text',
    sort: true,
  },
  description: {
    title: 'Descripcion',
    type: 'text',
    sort: true,
  },
  amount: {
    title: 'Valor',
    type: 'text',
    sort: true,
  },
};

const EXAMPLE_DATA = [
  {
    description: 'Comercialización',
  },
  {
    description: 'Siap',
  },
  {
    description: 'Entrega de bienes',
  },
  {
    description: 'Inmuebles',
  },
  {
    description: 'Muebles',
  },
  {
    description: 'Importaciones',
  },
  {
    description: 'Enajenación',
  },
  {
    description: 'Lícito de bienes',
  },
];
