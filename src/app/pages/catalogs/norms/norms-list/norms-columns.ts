import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const NORMS_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  norm: {
    title: 'Norma',
    type: 'string',
    sort: false,
  },
  article: {
    title: 'Artículo',
    type: 'string',
    sort: false,
  },
  type: {
    title: 'Tipo',
    type: 'number',
    sort: false,
  },
  characteristics: {
    title: 'Características',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      value !== null ? (value = value) : (value = '');
      return value;
    },
  },
  merchandise: {
    title: 'Mercancías',
    type: 'string',
    sort: false,
  },
  fundament: {
    title: 'Fundamento',
    type: 'string',
    sort: false,
  },
  objective: {
    title: 'Objetivo',
    type: 'string',
    sort: false,
  },

  /*name: {
    title: 'Destino',
    type: 'string',
    sort: false,
    /*filterFunction(cell?: any, search?: string): boolean {
      let column = cell.name;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Destino',
        list: [
          { value: 'ADMINISTRACIÓN', title: 'ADMINISTRACIÓN' },
          { value: 'DESTRUCCIÓN', title: 'DESTRUCCIÓN' },
          { value: 'DONACIÓN', title: 'DONACIÓN' },
          { value: 'VENTA', title: 'VENTA' },
        ],
      },
    },
  },*/

  destination: {
    title: 'Destino',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '4')
        return '<strong><span class="badge badge-pill badge-success">ADMINISTRACIÓN</span></strong>';
      if (value == '3')
        return '<strong><span class="badge badge-pill badge-success">DESTRUCCIÓN</span></strong>';
      if (value == '2')
        return '<strong><span class="badge badge-pill badge-success">DONACIÓN</span></strong>';
      if (value == '1')
        return '<strong><span class="badge badge-pill badge-warning">VENTA</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '1', title: 'VENTA' },
          { value: '2', title: 'DONACIÓN' },
          { value: '3', title: 'DESTRUCCIÓN' },
          { value: '4', title: 'ADMINISTRACIÓN' },
        ],
      },
    },
  },

  condition: {
    title: 'Condición',
    type: 'string',
    sort: false,
  },
  // userCreation: {
  //   title: 'Creado por',
  //   type: 'string',
  //   sort: false,
  // },
  // userModification: {
  //   title: 'Modificado por',
  //   type: 'string',
  //   sort: false,
  // },
};
