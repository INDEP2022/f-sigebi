import { NgSelectElementComponent } from 'src/app/shared/components/select-element-smarttable/ng-select-element';

export const RATE_CATALOG_COLUMNS = {
  month: {
    title: 'Mes',
    type: 'custom',
    sort: false,
    valuePrepareFunction: (month: number) => {
      return Number(month);
    },
    renderComponent: NgSelectElementComponent,
    onComponentInitFunction(instance: any) {
      const values = [
        {
          label: 'Enero',
          value: 1,
        },
        {
          label: 'Febrero',
          value: 2,
        },
        {
          label: 'Marzo',
          value: 3,
        },
        {
          label: 'Abril',
          value: 4,
        },
        {
          label: 'Mayo',
          value: 5,
        },
        {
          label: 'Junio',
          value: 6,
        },
        {
          label: 'Julio',
          value: 7,
        },
        {
          label: 'Agosto',
          value: 8,
        },
        {
          label: 'Septiembre',
          value: 9,
        },
        {
          label: 'Octubre',
          value: 10,
        },
        {
          label: 'Noviembre',
          value: 11,
        },
        {
          label: 'Diciembre',
          value: 12,
        },
      ];
      instance.values.emit(values);
      instance.toggle.subscribe((data: any) => {
        console.log(data);

        //data.row.avance_propu = data.toggle;
      });
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          {
            title: 'Enero',
            value: 1,
          },
          {
            title: 'Febrero',
            value: 2,
          },
          {
            title: 'Marzo',
            value: 3,
          },
          {
            title: 'Abril',
            value: 4,
          },
          {
            title: 'Mayo',
            value: 5,
          },
          {
            title: 'Junio',
            value: 6,
          },
          {
            title: 'Julio',
            value: 7,
          },
          {
            title: 'Agosto',
            value: 8,
          },
          {
            title: 'Septiembre',
            value: 9,
          },
          {
            title: 'Octubre',
            value: 10,
          },
          {
            title: 'Noviembre',
            value: 11,
          },
          {
            title: 'Diciembre',
            value: 12,
          },
        ],
      },
    },
  },
  year: {
    title: 'Año',
    type: 'number',
    sort: false,
  },
  pesos: {
    title: 'Tasa Pesos',
    type: 'string',
    sort: false,
  },
  dollars: {
    title: 'Tasa Dólares',
    type: 'number',
    sort: false,
  },
  euro: {
    title: 'Tasa Euros',
    type: 'number',
    sort: false,
  },
};
