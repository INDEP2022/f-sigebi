export const COLUMNS = {
  parameter: {
    title: 'Parámetro',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  value: {
    title: 'Valor',
    sort: false,
  },
  address: {
    title: 'Dirección',
    type: 'html',
    valuePrepareFunction: (value: string) => {
      if (value == 'M')
        return '<strong><span class="badge badge-pill badge-success">Muebles</span></strong>';
      if (value == 'C')
        return '<strong><span class="badge badge-pill badge-success">Comercial</span></strong>';
      if (value == 'D')
        return '<strong><span class="badge badge-pill badge-success">Conciliación</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'M', title: 'Muebles' },
          { value: 'C', title: 'Comercial' },
          { value: 'D', title: 'Conciliación' },
        ],
      },
    },
    sort: false,
  },
  typeEventId: {
    title: 'Tipo de Evento',
    sort: false,
  },
};
