import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];

export const ASSETS_DESTRUCTION_COLUMLNS = {
  numberGood: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.good && row.good.description) {
        return row.good.description;
      } else {
        return null;
      }
    },
  },
  di_cve_ubicacion: {
    title: 'Ubicación',
    type: 'string',
    sort: false,
  },
  di_ubicacion1: {
    title: 'Ubicación Exacta',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.good && row.good.status) {
        return row.good.status;
      } else {
        return null;
      }
    },
  },
  fecha: {
    title: 'No. Oficio de Autorización y Fecha',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.good && row.good.observationDestruction) {
        return row.good.observationDestruction;
      } else {
        return null;
      }
    },
  },
  process: {
    title: 'Ext. Dom',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.good && row.good.extDomProcess) {
        return row.good.extDomProcess;
      } else {
        return null;
      }
    },
  },
  received: {
    title: 'Aprobado',
    type: 'custom',
    showAlways: true,
    filter: false,
    sort: false,
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return row.received == 'S' ? true : false;
    },
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
};
