import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

@Component({
  selector: 'app-layouts-configuration',
  templateUrl: './layouts-configuration.component.html',
  styleUrls: ['layouts-configuration.component.scss'],
})
export class LayoutsConfigurationComponent implements OnInit {
  settings1 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      id: {
        title: 'Id',
        type: 'number',
        sort: false,
      },
      clave: {
        title: 'Clave',
        type: 'string',
        sort: false,
      },
      status: {
        title: 'Status',
        type: 'string',
        sort: false,
      },
      d: {
        title: 'D',
        type: 'string',
        sort: false,
      },
      tipoDispersion: {
        title: 'Tipo Dispersion',
        type: 'string',
        sort: false,
      },
      origen: {
        title: 'Origen',
        type: 'string',
        sort: false,
      },
      fechaCreacion: {
        title: 'Fecha Creacion',
        type: Date,
        sort: false,
      },
      fechaTermino: {
        title: 'Fecha Termino',
        type: Date,
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  data = EXAMPLE_DATA;

  settings2 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      id: {
        title: 'Id',
        type: 'number',
        sort: false,
      },
      cveProceso: {
        title: 'C.V.E Proceso',
        type: 'string',
        sort: false,
      },
      cantidad: {
        title: 'Cantidad',
        type: 'number',
        sort: false,
      },
      monto: {
        title: 'Monto',
        type: 'number',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  data2 = EXAMPLE_DAT2;

  settings3 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      fis: {
        title: 'FIS',
        sort: false,
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            data.row.to = data.toggle;
          });
        },
      },
      cnt: {
        title: 'CNT',
        sort: false,
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            data.row.to = data.toggle;
          });
        },
      },
      pto: {
        title: 'PTO',
        sort: false,
        type: 'custom',
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction(instance: any) {
          instance.toggle.subscribe((data: any) => {
            data.row.to = data.toggle;
          });
        },
      },
      TSR: {
        title: 'TSR',
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

  data3 = EXAMPLE_DAT3;

  settings4 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      fechaTransf: {
        title: 'Fecha Transferencia',
        type: Date,
        sort: false,
      },
      claveValida: {
        title: 'Clave Validad',
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

  settings5 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      id: {
        title: 'Id',
        type: 'number',
        sort: false,
      },
      descripcion: {
        title: 'Descripción',
        type: 'string',
        sort: false,
      },
      pantalla: {
        title: 'Pantalla',
        type: 'string',
        sort: false,
      },
      tablaVista: {
        title: 'Tabla o Vista',
        type: 'string',
        sort: false,
      },
      filtro: {
        title: 'Filtro de Selección',
        type: 'string',
        sort: false,
      },
      activo: {
        title: 'Activo',
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

  data5 = EXAMPLE_DAT5;

  settings6 = {
    ...TABLE_SETTINGS,
    actions: false,
    columns: {
      posicion: {
        title: 'Posición',
        type: 'number',
        sort: false,
      },
      columna: {
        title: 'Columna',
        type: 'string',
        sort: false,
      },
      tipoDato: {
        title: 'Tipo Dato',
        type: 'string',
        sort: false,
      },
      longitud: {
        title: 'Longitud',
        type: 'number',
        sort: false,
      },
      constante: {
        title: 'Constante',
        type: 'string',
        sort: false,
      },
      caracterRelleno: {
        title: 'Caracter de Relleno',
        type: 'string',
        sort: false,
      },
      relleno: {
        title: 'Relleno',
        type: 'string',
        sort: false,
      },
      decimales: {
        title: 'Decimales',
        type: 'string',
        sort: false,
      },
      formatoFecha: {
        title: 'Formato Fecha',
        type: 'string',
        sort: false,
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  data6 = EXAMPLE_DAT6;

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      evento: [null, [Validators.required]],
      lote: [null, [Validators.required]],
      oficio: [null, [Validators.required]],
      diridoA: [null, [Validators.required]],
      puesto: [null, [Validators.required]],
      parrafo1: [null, [Validators.required]],
      adjudicatorio: [null, [Validators.required]],
      factura: [null, [Validators.required]],
      fechaFactura: [null, [Validators.required]],
      parrafo2: [null, [Validators.required]],
      firmante: [null, [Validators.required]],
      ccp1: [null, [Validators.required]],
      ccp2: [null, [Validators.required]],
    });
  }
}

const EXAMPLE_DATA = [
  {
    id: 1,
    clave: 'clave',
    status: 'activo',
    d: 'ejemplo',
    tipoDispersion: 'ejemplo',
    origen: 'ejemplo',
    fechaCreacion: new Date(),
    fechaTermino: new Date(),
  },
  {
    id: 1,
    clave: 'clave',
    status: 'activo',
    d: 'ejemplo',
    tipoDispersion: 'ejemplo',
    origen: 'ejemplo',
    fechaCreacion: new Date(),
    fechaTermino: new Date(),
  },
  {
    id: 1,
    clave: 'clave',
    status: 'activo',
    d: 'ejemplo',
    tipoDispersion: 'ejemplo',
    origen: 'ejemplo',
    fechaCreacion: new Date(),
    fechaTermino: new Date(),
  },
  {
    id: 1,
    clave: 'clave',
    status: 'activo',
    d: 'ejemplo',
    tipoDispersion: 'ejemplo',
    origen: 'ejemplo',
    fechaCreacion: new Date(),
    fechaTermino: new Date(),
  },
  {
    id: 1,
    clave: 'clave',
    status: 'activo',
    d: 'ejemplo',
    tipoDispersion: 'ejemplo',
    origen: 'ejemplo',
    fechaCreacion: new Date(),
    fechaTermino: new Date(),
  },
];

const EXAMPLE_DAT2 = [
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
  {
    id: 1,
    cveProceso: 'proceso',
    cantidad: 5,
    monto: 500,
  },
];

const EXAMPLE_DAT3 = [{}, {}, {}, {}];

const EXAMPLE_DAT4 = [
  {
    fechaTransf: new Date(),
  },
  {
    fechaTransf: new Date(),
  },
  {
    fechaTransf: new Date(),
  },
  {
    fechaTransf: new Date(),
  },
];

const EXAMPLE_DAT5 = [
  {
    id: 1,
    descripcion: 'ejemplo',
    pantalla: 'ejemplo',
    tablaVista: 'pantalla',
    filtro: 'criterio',
  },
  {
    id: 1,
    descripcion: 'ejemplo',
    pantalla: 'ejemplo',
    tablaVista: 'pantalla',
    filtro: 'criterio',
  },
  {
    id: 1,
    descripcion: 'ejemplo',
    pantalla: 'ejemplo',
    tablaVista: 'pantalla',
    filtro: 'criterio',
  },
  {
    id: 1,
    descripcion: 'ejemplo',
    pantalla: 'ejemplo',
    tablaVista: 'pantalla',
    filtro: 'criterio',
  },
  {
    id: 1,
    descripcion: 'ejemplo',
    pantalla: 'ejemplo',
    tablaVista: 'pantalla',
    filtro: 'criterio',
  },
  {
    id: 1,
    descripcion: 'ejemplo',
    pantalla: 'ejemplo',
    tablaVista: 'pantalla',
    filtro: 'criterio',
  },
];

const EXAMPLE_DAT6 = [
  {
    posicion: 1,
    columna: 'ejemplo',
    tipoDato: 'ejemplo',
    longitud: 3,
    constante: 'criterio',
    caracterRelleno: 'caracter',
    relleno: 'relleno',
    decimales: 3,
    formatoFecha: 'dd/mm/aaaa',
  },
  {
    posicion: 1,
    columna: 'ejemplo',
    tipoDato: 'ejemplo',
    longitud: 3,
    constante: 'criterio',
    caracterRelleno: 'caracter',
    relleno: 'relleno',
    decimales: 3,
    formatoFecha: 'dd/mm/aaaa',
  },
  {
    posicion: 1,
    columna: 'ejemplo',
    tipoDato: 'ejemplo',
    longitud: 3,
    constante: 'criterio',
    caracterRelleno: 'caracter',
    relleno: 'relleno',
    decimales: 3,
    formatoFecha: 'dd/mm/aaaa',
  },
  {
    posicion: 1,
    columna: 'ejemplo',
    tipoDato: 'ejemplo',
    longitud: 3,
    constante: 'criterio',
    caracterRelleno: 'caracter',
    relleno: 'relleno',
    decimales: 3,
    formatoFecha: 'dd/mm/aaaa',
  },
  {
    posicion: 1,
    columna: 'ejemplo',
    tipoDato: 'ejemplo',
    longitud: 3,
    constante: 'criterio',
    caracterRelleno: 'caracter',
    relleno: 'relleno',
    decimales: 3,
    formatoFecha: 'dd/mm/aaaa',
  },
  {
    posicion: 1,
    columna: 'ejemplo',
    tipoDato: 'ejemplo',
    longitud: 3,
    constante: 'criterio',
    caracterRelleno: 'caracter',
    relleno: 'relleno',
    decimales: 3,
    formatoFecha: 'dd/mm/aaaa',
  },
];
