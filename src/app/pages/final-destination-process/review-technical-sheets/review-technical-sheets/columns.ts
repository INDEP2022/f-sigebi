import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
export let COLUMNS = {
  program: {
    title: 'Programa',
    type: 'string',
    sort: false,
  },
  goodNumb: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  destination: {
    title: 'Destino',
    type: 'string',
    sort: false,
  },
  receptDate: {
    title: 'Fecha Recepción',
    type: 'string',
    sort: false,
  },
  photoDate: {
    title: 'Fecha Fotografía',
    type: 'string',
    sort: false,
  },
  photo: {
    title: 'Fotografía',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  //   correct: {
  //     title: 'Correcta',
  //     type: 'string',
  //     sort: false,
  //   },
  revised: {
    title: 'Revisó',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  fulfilled: {
    title: 'Cumplió',
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
