import { TextInputComponent } from '../../../afs-shared-components/text-input/text-input.component';

export const ASSETS_LIST_SELECTED_COLUMNS = {
  noAsset: {
    title: 'No. Bien SIGEBI',
    type: 'string',
    sort: false,
  },
  noInventory: {
    title: 'No. Inventario',
    type: 'string',
    sort: false,
  },
  classifier: {
    title: 'Clasificador',
    type: 'string',
    sort: false,
  },
  descripTransfer: {
    title: 'Descripción Transferente',
    type: 'string',
    sort: false,
  },
  input: {
    title: 'Cantidad para estudio',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: TextInputComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  quantityTransfer: {
    title: 'Cantidad Transferente',
    type: 'string',
    sort: false,
  },
  unitTransfer: {
    title: 'Unidad Transferente',
    type: 'string',
    sort: false,
  },
  descriptIndep: {
    title: 'Descripción INDEP',
    type: 'string',
    sort: false,
  },
  quantityIndep: {
    title: 'Cantidad INDEP',
    type: 'string',
    sort: false,
  },
  unitIndep: {
    title: 'Unidad INDEP',
    type: 'string',
    sort: false,
  },
  descriptWarehouse: {
    title: 'Descripción Almacén',
    type: 'string',
    sort: false,
  },
  quantityWarehouse: {
    title: 'Cantidad Almacén',
    type: 'string',
    sort: false,
  },
  unitWarehouse: {
    title: 'Unidad Almacén',
    type: 'string',
    sort: false,
  },
  statePhysicWarehouse: {
    title: 'Estado Físico Almacén',
    type: 'string',
    sort: false,
  },
  stateConsercationWarehouse: {
    title: 'Estado de Conservación Almacén',
    type: 'string',
    sort: false,
  },
  warehouse: {
    title: 'Almacén',
    type: 'string',
    sort: false,
  },
};
