import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const REL_OPINION_COLUMNS = {
  idD: {
    title: 'No. Dictamen',
    sort: false,
    filter: false,
  },
  name: {
    title: 'Dictamen',
    sort: false,
    filter: false,
  },
  d: {
    title: 'D',
    sort: false,
    filter: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
  b: {
    title: 'B',
    sort: false,
    filter: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
  u: {
    title: 'U',
    sort: false,
    filter: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
  i: {
    title: 'I',
    sort: false,
    filter: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
  e: {
    title: 'E',
    sort: false,
    filter: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
};

export const AFFAIR_COLUMNS = {
  id: {
    title: 'Código',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  referralNoteType: {
    title: 'tipo_volante',
    sort: false,
  },
  creationUser: {
    title: 'Usuario creado',
    sort: false,
  },
  creationDate: {
    title: 'Fecha creación',
    sort: false,
  },
  additionUser: {
    title: 'usuario_adicion',
    sort: false,
  },
  modificationDate: {
    title: 'Fecha modificación',
    sort: false,
  },
  versionUser: {
    title: 'ver_usuario',
    sort: false,
  },
  status: {
    title: 'Estado',
    sort: false,
  },
  registerNumber: {
    title: 'Número registrado',
    sort: false,
  },
  version: {
    title: 'Versión',
    sort: false,
  },
  processDetonate: {
    title: 'processDetonate',
    sort: false,
  },
  clv: {
    title: 'clv',
    sort: false,
  },
};
