import { IZoneContract } from 'src/app/core/models/catalogs/zone-contract.model';

export const CONTRACTS_COLUMNS = {
  contractKey: {
    title: 'Contrato',
    width: '10%',
    type: 'string',
    sort: false,
  },
  zoneContractKey: {
    title: 'N°',
    width: '5%',
    sort: false,
  },
  zone: {
    title: 'Zonas',
    width: '30%',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IZoneContract) => {
      return value.description;
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.description;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  startDate: {
    title: 'Fecha inicial',
    width: '30%',
    sort: false,
  },
  endDate: {
    title: 'Fecha final',
    width: '30%',
    sort: false,
  },
  statusContract: {
    title: 'Vigente',
    width: '5%',
    sort: false,
  },
};
