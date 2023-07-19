export const ZONES_COLUMNS = {
  id: {
    title: 'Número',
    width: '10%',
    sort: false,
  },
  description: {
    title: 'Descripción',
    width: '30%',
    sort: false,
  },
  vigente: {
    title: 'Vigente',
    width: '5%',
    sort: false,
  },
};
export const COORDINATIONSZONES_COLUMNS = {
  zoneContractKey: {
    title: 'Coordinación ',
    width: '10%',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    width: '30%',
    sort: false,
  },
};

export interface IDataZones {
  id: number;
  description: string;
  statusZone: string;
}
