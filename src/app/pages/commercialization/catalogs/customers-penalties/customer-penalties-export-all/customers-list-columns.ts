export const COLUMNS = {
  typeProcess: {
    title: 'Tipo de Penalización',
    sort: false,
  },
  eventId: {
    title: 'Clave Evento',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.id : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
    /*valuePrepareFunction: (cell: any, row: any) => {
      return cell.id;
    },*/
  },
  publicLot: {
    title: 'Lote',
    sort: false,
  },
  refeOfficeOther: {
    title: 'Referencia/Oficio/Otros',
    sort: false,
  },
  userPenalty: {
    title: 'Usuario Penaliza',
    sort: false,
  },
};
