export const COLUMNS = {
  code: {
    title: 'Código',
    type: 'string',
    sort: false,
  },

  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },

  subaccount: {
    title: 'Tipo de Gasto',
    type: 'string',
    sort: false,
  },
  unaffordabilityCriterion: {
    title: 'Incosteables',
    type: 'html',
    valuePrepareFunction: (value: string) => {
      if (value == 'Y')
        return '<strong><span class="badge badge-pill badge-success">Sí</span></strong>';
      if (value == 'N')
        return '<strong><span class="badge badge-pill badge-success">No</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'Y', title: 'Sí' },
          { value: 'N', title: 'No' },
        ],
      },
    },
    sort: false,
  },
  cost: {
    title: 'Costo',
    type: 'html',
    valuePrepareFunction: (value: string) => {
      if (value == 'GASTO')
        return '<strong><span class="badge badge-pill badge-success">Gasto</span></strong>';
      if (value == 'COSTO')
        return '<strong><span class="badge badge-pill badge-success">Costo</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          {
            value: 'GASTO',
            title: 'Gasto',
          },
          {
            value: 'COSTO',
            title: 'Costo',
          },
        ],
      },
    },
    sort: false,
  },
};
