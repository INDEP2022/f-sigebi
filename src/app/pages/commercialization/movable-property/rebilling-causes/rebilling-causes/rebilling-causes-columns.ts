export const REBILLING_CAUSES_COLUMNS = {
  id: {
    title: 'ID',
    width: '25px',
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
  },
  comments: {
    title: 'Comentarios',
    type: 'string',
    sort: false,
  },
};
