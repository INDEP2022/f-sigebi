import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
export const COLUMNS = {
  idDonee: {
    title: 'Id Donatario',
    type: 'number',
    sort: false,
  },
  donee: {
    title: 'Donatario',
    type: 'string',
    sort: false,
  },
  numbWarehouse: {
    title: 'No. Almacén',
    type: 'number',
    sort: false,
  },
  warehouse: {
    title: 'Almacén',
    type: 'string',
    sort: false,
  },
  proposedScope: {
    title: 'Acance de Propuesta',
    type: 'string',
    sort: false,
  },
  cveAuth: {
    title: 'Cve Autorización',
    type: 'string',
    sort: false,
  },
  authDate: {
    title: 'Fecha Autorización',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  request: {
    title: 'Solicitud',
    type: 'string',
    sort: false,
  },
  select: {
    title: 'Sel',
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
