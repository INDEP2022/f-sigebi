import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];

export function resetGoodCheck() {
  goodCheck = [];
}
export const V_GOOD_COLUMNS = {
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
        if (data.toggle) {
          console.log(goodCheck);
          goodCheck.push(data);
        } else {
          goodCheck = goodCheck.filter(valor => valor.row.id != data.row.id);
        }
      });
    },
  },
  goodNumber: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  goodDescription: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  clasif: {
    title: 'No. Clasificación',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  measurementUnit: {
    title: 'Unidad Medida',
    type: 'string',
    sort: false,
  },
  fileNumber: {
    title: 'Expediente',
    type: 'number',
    sort: false,
  },
  labelNumber: {
    title: 'Etiqueta',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  transfereeD: {
    title: 'Transferente',
    type: 'string',
    sort: false,
  },
  warehouseNumber: {
    title: 'No. Almacén',
    type: 'string',
    sort: false,
  },
  vaultNumber: {
    title: 'No. Bodega',
    type: 'string',
    sort: false,
  },
};

export function clearGoodCheck() {
  goodCheck = [];
}
