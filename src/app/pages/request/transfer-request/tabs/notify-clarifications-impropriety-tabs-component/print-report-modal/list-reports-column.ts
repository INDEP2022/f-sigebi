export const LIST_REPORTS_COLUMN = {
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  post: {
    title: 'Cargo',
    type: 'string',
    sort: false,
  },
  validationocsp: {
    title: 'Estatus registro',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'true')
        return `<span><i class="fa fa-check text-success"></i> Datos completos</span>`;
      if (value == 'false')
        return `<span><i class="fa fa-times text-danger"></i> Datos incorrectos</span>`;
      if (value == null)
        return `<span><i class="fa fa-times text-danger"></i> Datos incompletos</span>`;

      return value;
    },
  },

  /*
  button: {
    title: '',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },*/
};
