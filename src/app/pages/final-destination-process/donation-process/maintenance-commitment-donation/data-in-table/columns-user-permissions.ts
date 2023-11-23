import { CheckboxElementComponent_ } from './CheckboxDisabled';
export const COLUMNS_USER_PERMISSIONS = {
  otvalor: {
    title: 'Usuario',
    type: 'string',
    sort: false,
    width: '20%',
  },
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
    width: '80%',
  },
  yes: {
    title: 'S',
    type: 'custom',
    width: '10%',
    // filter: false,
    renderComponent: CheckboxElementComponent_,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    filter: {
      type: 'checkbox',
      config: {
        true: true,
        false: false,
        resetText: ' ',
      },
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
    sort: false,
  },
  not: {
    title: 'N',
    type: 'custom',
    // filter: false,
    width: '10%',
    renderComponent: CheckboxElementComponent_,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    filter: {
      type: 'checkbox',
      config: {
        true: true,
        false: false,
        resetText: ' ',
      },
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
    sort: false,
  },
};
