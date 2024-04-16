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
    width: '30%',
  },
  screenKey: {
    title: 'Pantalla',
    sort: false,
    width: '40%',
  },
  permissionReading: {
    title: 'Lectura',
    sort: false,
    width: '15%',
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'N', title: 'NO' },
          { value: 'S', title: 'SI' },
        ],
      },
    },
    valuePrepareFunction: (value: any) => {
      if (value == 'S') {
        return 'SI';
      } else if (value == 'N') {
        return 'NO';
      } else {
        return '';
      }
    },
  },
  permissionWriting: {
    title: 'Escritura',
    sort: false,
    width: '15%',
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'N', title: 'NO' },
          { value: 'S', title: 'SI' },
        ],
      },
    },
    valuePrepareFunction: (value: any) => {
      if (value == 'S') {
        return 'SI';
      } else if (value == 'N') {
        return 'NO';
      } else {
        return '';
      }
    },
  },
};

export const COLUMNS_I = {
  profile: {
    title: 'Perfil',
    sort: false,
    width: '30%',
  },
  description: {
    title: 'Descripcion',
    sort: false,
    width: '70%',
  },
};
