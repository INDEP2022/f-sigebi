import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
export const IMAGE_DEBUGGING_COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  desGood: {
    title: 'Descripción',
    sort: false,
  },
  consecNumber: {
    title: 'Consecutivo',
    sort: false,
  },
  publicImgcatWeb: {
    title: 'Publicado',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  existsfs: {
    title: 'Existe',
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

export const PHOTOGRAPHY_COLUMNS = {
  dDocName: {
    title: 'No. Fotografía',
    type: 'string',
    sort: false,
  },

  xidBien: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },

  xtipoDocumento: {
    title: 'Tipo de documento',
    type: 'string',
    sort: false,
  },

  ddocTitle: {
    title: 'Título del Documento',
    type: 'string',
    sort: false,
  },
  dDocAuthor: {
    title: 'Autor',
    type: 'string',
    sort: false,
  },
  dInDate: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
  },
};
