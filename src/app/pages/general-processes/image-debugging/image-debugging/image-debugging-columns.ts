import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

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

export const IMAGE_DEBUGGING_COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
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

// export const IMAGE_DEBUGGING_COLUMNS = {
//   // goodNumber: {
//   //   title: 'No. Bien',
//   //   sort: false,
//   // },
//   // desGood: {
//   //   title: 'Descripción',
//   //   sort: false,
//   // },
//   // consecNumber: {
//   //   title: 'Consecutivo',
//   //   sort: false,
//   // },
//   // program: {
//   //   title: 'Programa',
//   //   type: 'string',
//   //   sort: false,
//   // },
//   goodNumb: {
//     title: 'No. Bien',
//     type: 'number',
//     sort: false,
//   },
//   description: {
//     title: 'Descripción',
//     type: 'string',
//     sort: false,
//   },
//   status: {
//     title: 'Estatus',
//     type: 'string',
//     sort: false,
//   },
//   destination: {
//     title: 'Destino',
//     type: 'string',
//     sort: false,
//   },
//   receptDate: {
//     title: 'Fecha Recepción',
//     type: 'string',
//     sort: false,
//   },
//   photoDate: {
//     title: 'Fecha Fotografía',
//     type: 'string',
//     sort: false,
//   },
//   photo: {
//     title: 'Fotografía',
//     type: 'custom',
//     renderComponent: CheckboxElementComponent,
//     onComponentInitFunction(instance: any) {
//       instance.toggle.subscribe((data: any) => {
//         data.row.to = data.toggle;
//       });
//     },
//     sort: false,
//   },
//   publicImgcatWeb: {
//     title: 'Publicado',
//     type: 'custom',
//     renderComponent: CheckboxElementComponent,
//     onComponentInitFunction(instance: any) {
//       instance.toggle.subscribe((data: any) => {
//         data.row.to = data.toggle;
//       });
//     },
//     sort: false,
//   },
//   existsfs: {
//     title: 'Existe',
//     type: 'custom',
//     renderComponent: CheckboxElementComponent,
//     onComponentInitFunction(instance: any) {
//       instance.toggle.subscribe((data: any) => {
//         data.row.to = data.toggle;
//       });
//     },
//     sort: false,
//   },
// };

export const EXPEDIENT_COLUMNS = {
  id: {
    title: 'No. Expedient',
    type: 'string',
    sort: false,
  },

  preliminaryInquiry: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },

  criminalCase: {
    title: 'Causa Pemal',
    type: 'string',
    sort: false,
  },

  expedientType: {
    title: 'Tipo de Expediente',
    type: 'string',
    sort: false,
  },
  expedientStatus: {
    title: 'Estatus de Expediente',
    type: 'string',
    sort: false,
  },
  stationNumber: {
    title: 'Número de Estación',
    type: 'string',
    sort: false,
  },
};
