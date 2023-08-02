export const COLUMNS = {
  /*id: {
    title: 'Id Evento',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.comerDetail.id;
    },
    filterFunction(cell?: any, search?: string): boolean {
      console.log('c ' + cell);
      console.log('s ' + search);
      const cellValue = cell.toString().toLowerCase();
      const searchValue = search.toLowerCase();
      return cellValue.includes(searchValue);
    },
  },
  processKey: {
    title: 'CVE Proceso',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.comerDetail.processKey != null
        ? row.comerDetail.processKey
        : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  tpeventoId: {
    title: 'Tipo',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.comerDetail.tpeventoId;
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  statusvtaId: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.comerDetail.statusvtaId;
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  phase: {
    title: 'Fase',
    sort: false,
  },
  year: {
    title: 'Año',
    sort: false,
  },
  warrantyDate: {
    title: 'Fecha Garantía',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  topost: {
    title: 'Publicar',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return text ? (text == '1' ? '☑️' : '🔲') : '';
    },
    filter: {
      type: 'checkbox',
      config: {
        true: '1',
        false: '0',
        resetText: 'clear',
      },
    },
  },*/
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  processKey: {
    title: 'Clave',
    type: 'string',
    sort: false,
  },
  eventTpId: {
    title: 'Tipo',
    type: 'number',
    sort: false,
  },
  statusVtaId: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
};

export const COLUMNS_PROCESS = {
  phase: {
    title: 'Fase',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1')
        return '<strong><span class="badge badge-pill badge-success">PROCESO ANTERIOR</span></strong>';
      if (value == '2')
        return '<strong><span class="badge badge-pill badge-warning">PROCESO NUEVO</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '1', title: 'PROCESO ANTERIOR' },
          { value: '2', title: 'PROCESO NUEVO' },
        ],
      },
    },
  },
  year: {
    title: 'Año',
    type: 'string',
    sort: false,
  },

  warrantyDate: {
    title: 'Fecha Garantía',
    type: 'string',
    sort: false,
  },

  topost: {
    title: 'Publicar',
    type: 'number',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1')
        return '<strong><span class="badge badge-pill badge-success">SI</span></strong>';
      if (value == '0')
        return '<strong><span class="badge badge-pill badge-warning">NO</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '1', title: 'SI' },
          { value: '0', title: 'NO' },
        ],
      },
    },
  },
};
