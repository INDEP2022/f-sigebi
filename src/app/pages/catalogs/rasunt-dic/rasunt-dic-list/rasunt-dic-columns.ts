export const R_ASUNT_DIC_COLUMNS = {
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
    type: 'string',
    sort: false,
  },
  property: {
    title: 'Propiedad',
    type: 'string',
    sort: false,
  },
  g_of: {
    title: 'G_of',
    type: 'string',
    sort: false,
  },
  i: {
    title: 'I',
    type: 'string',
    sort: false,
  },
  e: {
    title: 'E',
    type: 'html',
    sort: false,
  },
  // registryNumber: {
  //   title: 'Numero Registro',
  //   type: 'number',
  //   sort: false,
  // },
};
