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
  },
  observationsDestruction: {
    title: 'No. Oficio de Autorización y Fecha',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any, row: any) => {
      if (row.observationsDestruction != null) {
        return row.observationsDestruction;
      } else {
        if (row.cve_proceeding != null) {
          return `${row.cve_proceeding}  ${row.date_proceeding}`;
        } else {
          null;
        }
      }
    },
  },
  processExtDom: {
    title: 'Ext. Dom',
    type: 'string',
    sort: false,
  },
  approved: {
    title: 'Aprobado',
    type: 'custom',
    showAlways: true,
    filter: false,
    sort: false,
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return row.approved == 'SI' ? true : false;
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
