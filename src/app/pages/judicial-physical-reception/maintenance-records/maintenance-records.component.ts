import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-maintenance-records',
  templateUrl: './maintenance-records.component.html',
  styleUrls: ['maintenance-records.scss'],
})
export class MaintenanceRecordsComponent implements OnInit {
  itemsSelect = new DefaultSelect();
  form: FormGroup;
  settings = {
    ...TABLE_SETTINGS,
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      noBien: {
        title: 'No Bien',
        type: 'string',
        sort: false,
      },
      cantidad: {
        title: 'Cantidad',
        type: Date,
        sort: false,
      },
      descripcion: {
        title: 'Descripcion',
        type: 'string',
        sort: false,
      },
      fechaAprobacion: {
        title: 'Fecha Aprobacion',
        type: Date,
        sort: false,
      },
      usuarioAprobado: {
        title: 'Usuario Aprobado por Admon',
        type: 'string',
        sort: false,
      },
      fechaIndicaAprobacion: {
        title: 'Fecha Indica Usuario Aprobacion',
        type: Date,
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  data = EXAMPLE_DATA;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // this.prepareForm();
  }
}

const EXAMPLE_DATA = [
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
  {
    noBien: '123',
    cantidad: 3,
    descripcion: 'ejemplo',
    fechaAprobacion: new Date(),
    usuarioAprobado: 'juan',
    fechaIndicaAprobacion: new Date(),
  },
];
