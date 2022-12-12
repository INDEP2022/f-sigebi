import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
      tipoEvento: [null, [Validators.required]],
      fechaInicio: [null, [Validators.required]],
      fechaFin: [null, [Validators.required]],
      statusEvento: [null, [Validators.required]],
      coordRegional: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      usuario: [null, [Validators.required]],
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
