import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

@Component({
  selector: 'app-property-adjudication-notification-report',
  templateUrl: './property-adjudication-notification-report.component.html',
  styleUrls: ['property-adjudication-notification-report.component.scss'],
})
export class PropertyAdjudicationNotificationReportComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

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
      claveOficio: [null, [Validators.required]],
      fechaFallo: [null, [Validators.required]],
      FechaLimPago: [null, [Validators.required]],
      texto1: [null, [Validators.required]],
      texto2: [null, [Validators.required]],
      texto3: [null, [Validators.required]],
      texto4: [null, [Validators.required]],
      firmante: [null, [Validators.required]],
      elaboro: [null, [Validators.required]],
      ccp1: [null, [Validators.required]],
      ccp2: [null, [Validators.required]],
    });
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
