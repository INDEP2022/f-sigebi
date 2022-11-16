import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  keyServices: {
    title: 'Cve Servicio',
    type: 'string',
    sort: false,
  },

  descriptionServices: {
    title: 'Descripcion de Servicios',
    type: 'string',
    sort: false,
  },

  typeExpenditure: {
    title: 'Tipo de Gasto',
    type: 'string',
    sort: false,
  },
  unaffordable: {
    title: 'Incosteables',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  cost: {
    title: 'Costo',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  expenditure: {
    title: 'Gasto',
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
