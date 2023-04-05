import { CheckboxElementComponent } from './../../../../../shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  maneuverRequired: {
    title: 'Requiere Maniobra',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  goodNameAllocator: {
    title: 'Nombre del Bien Asignador',
    type: 'string',
    sort: false,
  },
  initDate: {
    title: 'Fecha Hora page',
    type: 'string',
    sort: false,
  },
  endDate: {
    title: 'Fecha Hora Fin',
    type: 'string',
    sort: false,
  },
  file: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },
  requestNumb: {
    title: 'No. Solicitud',
    type: 'number',
    sort: false,
  },
  // reservedAmount: {
  //   title: 'Cantidad Reservada',
  //   type: 'number',
  //   sort: false,
  // },
  manageNumb: {
    title: 'No. Gestión',
    type: 'number',
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
    type: 'number',
    sort: false,
  },
  inventoryNumb: {
    title: 'No. Inventario',
    type: 'number',
    sort: false,
  },
  officeNumb: {
    title: 'No. Oficio',
    type: 'number',
    sort: false,
  },
  fileType: {
    title: 'Tipo Expediente',
    type: 'string',
    sort: false,
  },
};
