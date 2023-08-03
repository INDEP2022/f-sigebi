export const SIRSAE_MOVEMENT_SENDING_COLUMNS = {
  customerId: {
    title: 'ID Cliente',
    type: 'number',
    sort: false,
    width: '12%',
  },
  name: {
    title: 'Cliente',
    sort: false,
    type: 'string',
    width: '44%',
    // valuePrepareFunction: (cell: any, row: any) => {
    //   return row.customers ? row.customers.reasonName : null;
    // },
  },
  rfc: {
    title: 'R.F.C.',
    type: 'string',
    sort: false,
    width: '20%',
    // valuePrepareFunction: (cell: any, row: any) => {
    //   return row.customers ? row.customers.rfc : null;
    // },
  },
  sendedSirsae: {
    title: 'Enviado SIRSAE',
    type: 'string',
    sort: false,
    width: '12%',
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'S', title: 'SI' },
          { value: 'N', title: 'NO' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.sendedSirsae == 'N') {
        return 'NO';
      } else if (row.sendedSirsae == 'S') {
        return 'SI';
      } else {
        return row.sendedSirsae;
      }
    },
  },
  sendSirsae: {
    title: 'Enviar SIRSAE',
    type: 'string',
    sort: false,
    width: '12%',
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'S', title: 'SI' },
          { value: 'N', title: 'NO' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.sendSirsae == 'N') {
        return 'NO';
      } else if (row.sendSirsae == 'S') {
        return 'SI';
      } else {
        return row.sendSirsae;
      }
    },
  },
};
