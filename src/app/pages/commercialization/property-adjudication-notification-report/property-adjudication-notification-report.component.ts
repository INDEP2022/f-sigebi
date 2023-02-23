import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

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
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  settings4 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      lotePublico: {
        title: 'Lote Publico',
        type: 'string',
        sort: false,
      },
      descripcion: {
        title: 'Lote Publico',
        type: 'string',
        sort: false,
      },
      cliente: {
        title: 'Cliente',
        type: 'string',
        sort: false,
      },
      noOficio: {
        title: 'Lote Publico',
        type: 'string',
        sort: false,
      },
      imprimir: {
        title: 'Imprimir',
        sort: false,
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            data.row.to = data.toggle;
          });
        },
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  data4 = EXAMPLE_DAT4;

  ngOnInit(): void {
    this.prepareForm();
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

  confirm(): void {
    let params = {
      DESTYPE: this.form.controls['firmante'].value,
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
    const pdfurl = `https://drive.google.com/file/d/1o3IASuVIYb6CPKbqzgtLcxx3l_V5DubV/view?usp=sharing`; //window.URL.createObjectURL(blob);
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
