export const COLUMNS = {
  typeProcess: {
    title: 'Tipo de Penalización',
    sort: false,
  },
  eventId: {
    title: 'Clave Evento',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return cell.id;
    },
  },
  publicLot: {
    title: 'Lote',
    sort: false,
  },
  startDate: {
    title: 'Fecha Inicial',
    sort: false,
    // valuePrepareFunction: (cell: any, row: any) => {
    //   const parts = cell.split('-');
    //   const year = parts[0];
    //   const month = parts[1];
    //   const day = parts[2];
    //   const formattedDate = `${day}/${month}/${year}`;
    //   return formattedDate;
    // },
    // filter: {
    //   type: 'custom',
    //   component: CustomDateDayFilterComponent,
    // },
  },
  endDate: {
    title: 'Fecha Final',
    sort: false,
    // valuePrepareFunction: (cell: any, row: any) => {
    //   const parts = cell.split('-');
    //   const year = parts[0];
    //   const month = parts[1];
    //   const day = parts[2];
    //   const formattedDate = `${day}/${month}/${year}`;
    //   return formattedDate;
    // },
    // filter: {
    //   type: 'custom',
    //   component: CustomDateDayFilterComponent,
    // },
  },
  refeOfficeOther: {
    title: 'Referencia/Oficio/Otros',
    sort: false,
  },
  userPenalty: {
    title: 'Usuario Penaliza',
    sort: false,
  },
  penaltiDate: {
    title: 'Fecha Penaliza',
    sort: false,
    // valuePrepareFunction: (cell: any, row: any) => {
    //   const parts = cell.split('-');
    //   const year = parts[0];
    //   const month = parts[1];
    //   const day = parts[2];

    //   const formattedDate = `${day}/${month}/${year}`;
    //   return formattedDate;
    // },
    // filter: {
    //   type: 'custom',
    //   component: CustomDateDayFilterComponent,
    // },
  },
};
