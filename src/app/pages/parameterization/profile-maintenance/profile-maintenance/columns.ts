//Components

/*export const COLUMNS_PERFIL = {
  screenKey: {
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
};*/

export const COLUMNS_PERFIL = {
  profile: {
    title: 'Perfil',
    sort: false,
  },
  screenKey: {
    title: 'Pantalla',
    sort: false,
  },
  permissionReading: {
    title: 'Lectura',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Lectura',
        list: [
          { value: 'N', title: 'NO' },
          { value: 'S', title: 'SI' },
        ],
      },
    },
  },
  permissionWriting: {
    title: 'Escritura',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Escritura',
        list: [
          { value: 'N', title: 'NO' },
          { value: 'S', title: 'SI' },
        ],
      },
    },
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
