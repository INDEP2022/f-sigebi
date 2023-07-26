export const REBILLING_CAUSES_COLUMNS = {
  id: {
    title: 'Id',
    width: '100px',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  rebill: {
    title: 'Refactura/Cancela',
    type: 'string',
    sort: false,
    valuePrepareFunction: (val: string) => {
      const values = [
        { id: 'R', value: 'REFACTURA' },
        { id: 'C', value: 'CANCELA' },
        { id: 'N', value: 'REFAC/NOIMG' },
      ];
      let desc: string = '';
      const exist = values.filter(v => v.id == val);

      if (exist.length > 0) {
        desc = exist[0].value;
      } else {
        desc = '';
      }
      return desc;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'R', title: 'REFACTURA' },
          { value: 'C', title: 'CANCELA' },
          { value: 'N', title: 'REFAC/NOIMG' },
        ],
      },
    },
  },
  apply: {
    title: 'Aplica',
    type: 'string',
    sort: false,
    valuePrepareFunction: (val: string) => {
      const values = [
        { id: 'F', value: 'FACTURA' },
        { id: 'D', value: 'DEVOLUCION' },
        { id: 'A', value: 'AMBAS' },
      ];
      let desc: string = '';
      const exist = values.filter(v => v.id == val);

      if (exist.length > 0) {
        desc = exist[0].value;
      } else {
        desc = '';
      }
      return desc;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'F', title: 'FACTURA' },
          { value: 'D', title: 'DEVOLUCION' },
          { value: 'A', title: 'AMBAS' },
        ],
      },
    },
  },
  comments: {
    title: 'Comentarios',
    type: 'string',
    sort: false,
  },
};
