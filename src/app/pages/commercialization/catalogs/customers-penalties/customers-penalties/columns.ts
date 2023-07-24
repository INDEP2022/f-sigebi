import { CustomDateDayFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-mounth-custom/custom-date-day-filter';

export const COLUMNS = {
  typeProcess: {
    //
    title: 'Tipo de Penalización',
    sort: false,
  },
  event: {
    title: 'Evento',
    sort: false,
  },
  eventKey: {
    title: 'Clave Evento',
    sort: false,
  },
  publicLot: {
    title: 'Lote',
    sort: false,
  },
  startDate: {
    title: 'Fecha Inicial',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];

      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
  endDate: {
    title: 'Fecha Final',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];

      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
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
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];

      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
};

export const COLUMNS2 = {
  processType: {
    title: 'Tipo de Penalización',
    sort: false,
  },
  eventId: {
    title: 'Evento',
    sort: false,
  },
  eventKey: {
    title: 'Clave Evento',
    sort: false,
  },
  batchPublic: {
    title: 'Lote',
    sort: false,
  },
  initialDate: {
    title: 'Fecha Inicial',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];

      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
  finalDate: {
    title: 'Fecha Final',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];

      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
  referenceJobOther: {
    title: 'Motivo Penalización',
    sort: false,
  },
  causefree: {
    title: 'Motivo Liberación',
    sort: false,
  },
  usrPenalize: {
    title: 'Usuario Penaliza',
    sort: false,
  },
  usrfree: {
    title: 'Usuario Libera',
    sort: false,
  },
  penalizesDate: {
    title: 'Fecha Penaliza',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];

      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
  releasesDate: {
    title: 'Fecha Libera',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      const parts = cell.split('-');
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];

      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
};
