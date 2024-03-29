import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const PERMISSIONSUSER_COLUMNS = {
  value: {
    title: 'Usuario',
    sort: false,
  },
  // usuario: {
  //   title: 'Usuario',
  //   valuePrepareFunction: (value: IUserAccessAreas) => {
  //     return value.user;
  //   },
  //   sort: false,
  // },
  user: {
    title: 'Nombre',
    sort: false,
  },
  s: {
    title: 'S',
    sort: false,
  },
  n: {
    title: 'N',
    sort: false,
  },
};
export const PRIVILEGESUSER_COLUMNS = {
  proy: {
    title: 'PROY.',
    width: '5%',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.proy = data.toggle;
      });
    },
  },
  val: {
    title: 'VAL.',
    width: '5%',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.val = data.toggle;
      });
    },
  },
  aut: {
    title: 'AUT.',
    width: '5%',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.aut = data.toggle;
      });
    },
  },
  cerr: {
    title: 'CERR.',
    width: '5%',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.cerr = data.toggle;
      });
    },
  },
  can: {
    title: 'CAN.',
    width: '5%',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.can = data.toggle;
      });
    },
  },
};
