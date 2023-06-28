export const IDENTIFIER_DBS_COLUMNS = {
  code: {
    title: 'Codigo',
    type: 'number',
    sort: false,
  },
  dictumData: {
    title: 'Dictamen',
    type: 'number',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
    },
  },
  flyerType: {
    title: 'Tipo Volante',
    type: 'string',
    sort: false,
  },
  doc: {
    title: 'Documento',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'S') return 'Si';
      if (value == 'N') return 'No';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'S', title: 'Si' },
          { value: 'N', title: 'No' },
        ],
      },
    },
  },
  property: {
    title: 'Propiedad',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'S') return 'Si';
      if (value == 'N') return 'No';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'S', title: 'Si' },
          { value: 'N', title: 'No' },
        ],
      },
    },
  },
  g_of: {
    title: 'G_of',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'S') return 'Si';
      if (value == 'N') return 'No';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'S', title: 'Si' },
          { value: 'N', title: 'No' },
        ],
      },
    },
  },
  i: {
    title: 'I',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'S') return 'Si';
      if (value == 'N') return 'No';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'S', title: 'Si' },
          { value: 'N', title: 'No' },
        ],
      },
    },
  },
  e: {
    title: 'E',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'S') return 'Si';
      if (value == 'N') return 'No';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'S', title: 'Si' },
          { value: 'N', title: 'No' },
        ],
      },
    },
  },
  // registryNumber: {
  //   title: 'Numero Registro',
  //   type: 'number',
  //   sort: false,
  // },
};
