import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let propContratosSelect: any[] = [];
export const COLUMNS = {
  select: {
    title: 'Sel',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.SELEC = data.toggle;
        if (data.toggle === true) {
          propContratosSelect.push(data.row);
        } else {
          propContratosSelect.splice(propContratosSelect.indexOf(data.row), 1);
        }
      });
    },
    sort: false,
    filter: false,
  },
  doneeId: {
    title: 'Id Donatario',
    type: 'number',
    sort: false,
  },
  donee: {
    title: 'Donatario',
    type: 'string',
    sort: false,
  },
  delegationNumber: {
    title: 'No. Almacén',
    type: 'number',
    sort: false,
  },
  warehouseDesc: {
    title: 'Almacén',
    type: 'string',
    sort: false,
  },
  propAdvance: {
    title: 'Avance de Propuesta',
    type: 'string',
    sort: false,
  },
  authorizeKey: {
    title: 'Cve Autorización',
    type: 'string',
    sort: false,
  },
  authorizeDate: {
    title: 'Fecha Autorización',
    type: 'string',
    sort: false,
  },
  justification: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  requestId: {
    title: 'Solicitud',
    type: 'string',
    sort: false,
  },
};

export function clearCheck() {
  propContratosSelect = [];
}
