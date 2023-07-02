import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const COLUMNS = {
  numberGood: {
    title: 'Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  record: {
    title: 'Expediente',
    sort: false,
  },
  originalUnit: {
    title: 'Unidad Original',
    sort: false,
  },
  originalAmount: {
    title: 'Cantidad Original',
    sort: false,
  },
};

export const ERRORCOLUMNS = {
  no_bien: {
    title: 'Bien',
    sort: false,
  },
  DES_ERROR: {
    title: 'Error',
    sort: false,
  },
};

export const GOODS_SELECTIONS_COLUMNS: Record<string, any> = {
  turnSelect: {
    title: 'Selección',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.turnSelect = data.toggle;
      });
    },
  },
  id: {
    title: 'Nº Bien',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  measurementUnit: {
    title: 'Unidad Medida',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  fileNumber: {
    title: 'Expediente',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  labelNumber: {
    title: 'Etiqueta Destino',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  goodStatus: {
    title: 'Estatus',
    sort: false,
    renderComponent: SeeMoreComponent,
  },

  clasif: {
    title: 'Clasificador',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  goodSsType: {
    title: 'Desc. Clasificador',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  adminCoord: {
    title: 'Coordinacíon Admín.',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  warehouseNumber: {
    title: 'Almacén',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  warehouseUbication: {
    title: 'Ubicacíon Almacén.',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  warehouseCity: {
    title: 'Ciudad Almacén.',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  warehosueState: {
    title: 'Entidad Almacén.',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  transfereeD: {
    title: 'Transferente',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  transfereeNumber: {
    title: 'Transferente',
    sort: false,
    visible: false,
    renderComponent: SeeMoreComponent,
  },
  goodDescription: {
    title: 'Descripción',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  emisorAuthority: {
    title: 'Emisora',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
  authority: {
    title: 'Autoridad',
    sort: false,
    renderComponent: SeeMoreComponent,
  },
};
