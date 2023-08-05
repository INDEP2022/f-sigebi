export const COLUMNS = {
  idStatus: {
    title: 'Estatus',
    sort: false,
    filter: true,
  },
  description: {
    title: 'Descripción',
    sort: false,
    filter: true,
  },
  idDirection: {
    title: 'Dirección',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'I')
        return '<strong><span class="badge badge-pill badge-success">Inmuebles</span></strong>';
      if (value == 'M')
        return '<strong><span class="badge badge-pill badge-success">Muebles</span></strong>';
      if (value == 'R')
        return '<strong><span class="badge badge-pill badge-success">Remesas</span></strong>';
      if (value == 'D')
        return '<strong><span class="badge badge-pill badge-success">Disponibles</span></strong>';
      if (value == 'V')
        return '<strong><span class="badge badge-pill badge-success">Validar SIRSAE</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'M', title: 'Muebles' },
          { value: 'I', title: 'Inmuebles' },
          { value: 'R', title: 'Remesas' },
          { value: 'D', title: 'Disponibles' },
          { value: 'V', title: 'Validar SIRSAE' },
        ],
      },
    },
  },
  comerTpevents: {
    title: 'Estatus del Proceso',
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.description;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
    sort: false,
  },
};
