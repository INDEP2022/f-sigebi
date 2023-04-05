import { CheckboxElementComponent } from './../../../../shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  goodsWarehouse: {
    title: 'Bienes del Almacén',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  validated: {
    title: 'Validado',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  contributingResult: {
    title: 'Resultado del Contribuyente',
    type: 'string',
    sort: false,
  },
  nameGoodGrouper: {
    title: 'Nombre del Bien Agrupador',
    type: 'string',
    sort: false,
  },
  warehouse: {
    title: 'Almacén',
    type: 'string',
    sort: false,
  },
  dateInitTime: {
    title: 'Fecha Hora page',
    type: 'string',
    sort: false,
  },
  dateEndTime: {
    title: 'Fecha Hora Fin',
    type: 'string',
    sort: false,
  },
  managementNumb: {
    title: 'No. Gestión',
    type: 'string',
    sort: false,
  },
  reservedQuantity: {
    title: 'Cantidad Reservada',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  saeNumb: {
    title: 'No. INDEP',
    type: 'string',
    sort: false,
  },
  inventoryNumb: {
    title: 'No. Inventario',
    type: 'number',
    sort: false,
  },
  fileType: {
    title: 'Tipo Expediente',
    type: 'string',
    sort: false,
  },
  uniqueKey: {
    title: 'Clave Única',
    type: 'string',
    sort: false,
  },
  unitMeasure: {
    title: 'Unidad Medida',
    type: 'string',
    sort: false,
  },
};
