export const NON_DELIVERY_REASONS_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  reasonType: {
    title: 'Tipo motivo',
    type: 'string',
    sort: false,
  },
  eventType: {
    title: 'Tipo evento',
    type: 'string',
    sort: false,
  },
  reason: {
    title: 'Descripción Motivo',
    type: 'string',
    sort: false,
  },
  // status: {
  //   title: 'Estado',
  //   type: 'html',
  //   valuePrepareFunction: (value: number) => {
  //     if (value == 0) {
  //       return '<strong><span class="badge rounded-pill text-bg-success">Activo</span></strong>';
  //     } else {
  //       return '<strong><span class="badge rounded-pill text-bg-warning">Inactivo</span></strong>';
  //     }
  //   },
  //   sort: false,
  // },
};
