import { PhotosActionComponent } from '../actions/see-action/photos-action.component';

export const LIST_ASSETS_COLUMNS = {
  noManagement: {
    title: 'No. Gestion',
    type: 'string',
    sort: false,
  },
  noRequest: {
    title: 'No. Solicitud',
    type: 'string',
    sort: false,
  },
  typeAsset: {
    title: 'Tipo Bien',
    type: 'string',
    sort: false,
  },
  uniqueKey: {
    title: 'Clave Única',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  transferDescription: {
    title: 'Descripción del Bien Transferente',
    type: 'string',
    sort: false,
    width: '200px',
  },
  destinityLigie: {
    title: 'Destino Ligie',
    type: 'string',
    sort: false,
  },
  phisicState: {
    title: 'Estado Fisico',
    type: 'string',
    sort: false,
  },
  stateConsercation: {
    title: 'Estado de Conservación',
    type: 'string',
    sort: false,
  },
  fraction: {
    title: 'Fracción',
    type: 'string',
    sort: false,
  },
  actions: {
    title: 'Acciones',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: PhotosActionComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
};
