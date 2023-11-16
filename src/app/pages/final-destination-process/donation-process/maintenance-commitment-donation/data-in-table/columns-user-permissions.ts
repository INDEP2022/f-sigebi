import { CheckboxElementComponent_ } from './CheckboxDisabled';
export const COLUMNS_USER_PERMISSIONS = {
  otvalor: {
    title: 'Usuario',
    type: 'string',
    sort: false,
  },
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  yes: {
    title: 'S',
    type: 'custom',
    // filter: false,
    renderComponent: CheckboxElementComponent_,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  not: {
    title: 'N',
    type: 'custom',
    // filter: false,
    renderComponent: CheckboxElementComponent_,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
};
