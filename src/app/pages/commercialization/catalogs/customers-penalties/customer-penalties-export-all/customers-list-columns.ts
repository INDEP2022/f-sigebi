export const COLUMNS = {
  typeProcess: {
    title: 'Tipo de Penalización',
    sort: false,
  },
  eventId: {
    title: 'Cve. Evento',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? `${value.id} ${value.processKey}` : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
    /*valuePrepareFunction: (cell: any, row: any) => {
      return cell.id;
    },*/
  },
  lotId: {
    title: 'Lote',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? `${value.publicLot} - ${value.description}` : '';
    },
  },
  /*publicLot: {
    title: 'Lote',
    sort: false,
  },*/
  refeOfficeOther: {
    title: 'Referencia/Oficio/Otros',
    sort: false,
  },
  userPenalty: {
    title: 'Usuario Penaliza',
    sort: false,
  },
};
