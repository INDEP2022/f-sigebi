export const COLUMNS = {
  parametro: {
    title: 'Parámetro',
    width: '5%',
    sort: false,
  },
  descriptionparameter: {
    title: 'Descripción',
    width: '30%',
    sort: false,
  },
  valor: {
    title: 'Valor',
    width: '20%',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.replace(/,/g, ', ') : ''}`;
    },
    sort: false,
  },
  direccion: {
    title: 'Dirección',
    type: 'html',
    valuePrepareFunction: (value: string) => {
      if (value == 'I')
        return '<strong><span class="badge badge-pill badge-success">Inmuebles</span></strong>';
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
          { value: 'I', title: 'Inmuebles' },
          { value: 'M', title: 'Muebles' },
          { value: 'C', title: 'Comercial' },
          { value: 'D', title: 'Conciliación' },
        ],
      },
    },
    sort: false,
  },
  tpevent: {
    title: 'Tipo de Evento',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.descripcion : '';
    },
  },
};
