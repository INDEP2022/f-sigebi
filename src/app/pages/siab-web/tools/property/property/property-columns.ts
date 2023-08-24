export const REAL_STATE_COLUMNS = {
  numClasifGoods: {
    title: 'Clasificador',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  /*seleccion: {
        title: 'Selección',
        type: 'custom',
        renderComponent: CheckboxSelectElementComponent, //CheckboxElementComponent,
        onComponentInitFunction(instance: any) {
            instance.toggle.subscribe((data: any) => {
                data.row.to = data.toggle;
            });
        },
        sort: false,
    },*/
};
