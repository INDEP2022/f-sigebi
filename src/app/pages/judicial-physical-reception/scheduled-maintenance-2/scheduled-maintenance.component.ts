import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-scheduled-maintenance',
  templateUrl: './scheduled-maintenance.component.html',
  styleUrls: ['scheduled-maintenance.scss'],
})
export class ScheduledMaintenanceComponent implements OnInit {
  itemsSelect = new DefaultSelect();
  form: FormGroup;
  settings1 = {
    ...TABLE_SETTINGS,
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      progRecepcionEntrega: {
        title: 'Programa Recepcion Entrega',
        type: 'string',
        sort: false,
      },
      Fechacaptura: {
        title: 'Fecha Captura',
        type: Date,
        sort: false,
      },
      ingreso: {
        title: 'Ingreso',
        type: 'string',
        sort: false,
      },
      estatusEvento: {
        title: 'Estatus Evento',
        type: 'number',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  data = EXAMPLE_DATA;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      fechaCaptura: [null, [Validators.required]],
      statusActa: [null, [Validators.required]],
      acta: [null, [Validators.required]],
      tipoEvento: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      prog: [null, [Validators.required]],
      transferente: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      area: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      usuario: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      folio: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      year: [null, [Validators.required]],
      month: [null, [Validators.required]],
      claveActa: [null, [Validators.required]],
      cantidadRegistros: [null, [Validators.required]],
      cantidadBienes: [null, [Validators.required]],
      cantidadExpedientes: [null, [Validators.required]],
      cantidadDictamenes: [null, [Validators.required]],
    });
  }
}

const EXAMPLE_DATA = [
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'no ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'no ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'ingresado',
  },
  {
    progRecepcionEntrega: '123',
    Fechacaptura: new Date(),
    ingreso: 'ejemplo',
    estatusEvento: 'no ingresado',
  },
];
