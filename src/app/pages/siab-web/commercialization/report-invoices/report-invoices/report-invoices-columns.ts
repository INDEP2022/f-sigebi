import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const REPORT_INVOICE_COLUMNS = {
  id_delegacion: {
    title: 'No. Delegación',
    sort: false,
  },
  descripcion: {
    title: 'Delegación',
    sort: false,
  },
  cuenta_fac: {
    title: 'Facturas Emitidas',
    sort: false,
  },
  porcentaje: {
    title: 'Porcentaje',
    sort: false,
  },
};

export const DETAIL_REPORT_COLUMNS = {
  evento: {
    title: 'Evento',
    type: 'string',
    sort: false,
  },
  id_factura: {
    title: 'Factura',
    type: 'number',
    sort: false,
  },
  id_lote: {
    title: 'Lote',
    type: 'number',
    sort: false,
  },
  id_estatusfact: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  rfc: {
    title: 'RFC',
    type: 'string',
    sort: false,
  },
  fecha: {
    title: 'Fecha Vigencia',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  tpfactura: {
    title: 'Tipo de CFDI',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'Ingreso')
        return '<strong><span class="badge badge-pill badge-success">Ingreso</span></strong>';
      if (value == 'Egreso')
        return '<strong><span class="badge badge-pill badge-success">Egreso</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          {
            value: 'Ingreso',
            title: 'Ingreso',
          },
          {
            value: 'Egreso',
            title: 'Egreso',
          },
        ],
      },
    },
  },
  tpbien: {
    title: 'Tipo Bien',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'Mueble')
        return '<strong><span class="badge badge-pill badge-success">Mueble</span></strong>';
      if (value == 'Inmueble')
        return '<strong><span class="badge badge-pill badge-success">Inmueble</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          {
            value: 'Mueble',
            title: 'Mueble',
          },
          {
            value: 'Inmueble',
            title: 'Inmueble',
          },
        ],
      },
    },
  },
  rutapdf: {
    title: 'Ruta PDF',
    type: 'string',
    sort: false,
    filter: false,
  },
  ferutaxml: {
    title: 'Ruta XML',
    type: 'string',
    sort: false,
    filter: false,
  },
};

/*{
  "color": "#636EBF",
    "cuenta_fac": "13",
      "descripcion": "Occidente",
        "id_delegacion": "6",
          "porcentaje": "100.00 %"
}*/
