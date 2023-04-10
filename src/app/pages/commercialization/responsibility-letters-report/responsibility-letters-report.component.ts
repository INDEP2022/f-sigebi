import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFederative } from 'src/app/core/models/administrative-processes/siab-sami-interaction/federative.model';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { IComerLotsEG } from 'src/app/core/models/ms-parametercomer/parameter';
import { ComerLotService } from 'src/app/core/services/ms-parametercomer/comer-lot.service';
import { ReportService } from 'src/app/core/services/reports/reports.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
@Component({
  selector: 'app-responsibility-letters-report',
  templateUrl: './responsibility-letters-report.component.html',
  styles: [],
})
export class ResponsibilityLettersReportComponent
  extends BasePage
  implements OnInit
{
  goodList: IGood;
  dataGood: any;
  totalItems: number = 0;
  idEvent: number = 0;
  valid: boolean = false;
  selectEvent = new DefaultSelect<IComerLotsEG>();
  selectLot = new DefaultSelect<IComerLotsEG>();
  entidad = new DefaultSelect<IFederative>();
  select = new DefaultSelect<IDelegation>();
  idLot: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      ...RELEASE_REPORT_COLUMNS,
    },
    noDataMessage: 'No se encontrarón registros',
  };
  setting2 = {
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
      adjudicatorio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      domicilio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      colonia: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delegacion: [null, [Validators.required]],
      estado: [null, [Validators.required]],
      cp: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      // puesto: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      parrafo1: [null, [Validators.pattern(STRING_PATTERN)]],
      parrafo2: [null, [Validators.pattern(STRING_PATTERN)]],
      parrafo3: [null, [Validators.pattern(STRING_PATTERN)]],
      bienes: [null],
    });
  }

  confirm(): void {
    // console.log(this.reportForm.value);
    // let params = { ...this.form.value };
    // for (const key in params) {
    //   if (params[key] === null) delete params[key];
    // }
    let params = {
      DESTYPE: this.form.controls['evento'].value,
      DOMICILIO: this.form.controls['domicilio'].value,
      ID_LOTE: this.form.controls['lote'].value,
      COLONIA: this.form.controls['colonia'].value,
      DELEGACION: this.form.controls['delegacion'].value,
      ESTADO: this.form.controls['estado'].value,
      CP: this.form.controls['cp'].value,
      PARRAFO1: this.form.controls['parrafo1'].value,
      ADJUDICATARIO: this.form.controls['adjudicatorio'].value,
      PARRAFO2: this.form.controls['parrafo2'].value,
      PARRAFO3: this.form.controls['parrafo3'].value,
    };
    console.log(params);
    // open the window
    setTimeout(() => {
      this.onLoadToast('success', 'procesando', '');
    }, 1000);

    //const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/SIAB/FCOMERCARTARESP.pdf?DESTYPE=${params.DESTYPE}&DOMICILIO=${params.DOMICILIO}&ID_LOTE=${params.ID_LOTE}&COLONIA=${params.COLONIA}&DELEGACION=${params.DELEGACION}&ESTADO=${params.ESTADO}&CP=${params.CP}&PARRAFO1=${params.PARRAFO1}&ADJUDICATARIO=${params.ADJUDICATARIO}&PARRAFO2=${params.PARRAFO2}&PARRAFO3=${params.PARRAFO3}`;
    const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);
    setTimeout(() => {
      this.onLoadToast('success', 'Reporte generado', '');
    }, 2000);

    window.open(pdfurl, 'FCOMERCARTARESP.pdf');
    this.loading = false;
    this.cleanForm();
  }
  cleanForm(): void {
    this.form.reset();
  }
  getGood(search: any) {
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
          this.valid = true;
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
}

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
