//Components

import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS_PERFIL = {
  display: {
    title: 'Pantalla',
    sort: false,
  },
  descriptionDisplay: {
    title: 'Descripcion',
    sort: false,
  },
  menu: {
    title: 'Menu',
    sort: false,
  },
  readingPermission: {
    title: 'Lectura',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  writingPermission: {
    title: 'Escritura',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
};

export const COLUMNS_I = {
  profile: {
    title: 'Perfil',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    sort: false,
  },
};
