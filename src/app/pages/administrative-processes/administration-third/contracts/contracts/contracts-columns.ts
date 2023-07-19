import { format } from 'date-fns';
import { IZoneContract } from 'src/app/core/models/catalogs/zone-contract.model';

export const CONTRACTS_COLUMNS = {
  contractKey: {
    title: 'Contrato',
    type: 'string',
    sort: false,
  },
  zoneContractKey: {
    title: 'N°',
    sort: false,
  },
  zone: {
    title: 'Zonas',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IZoneContract) => {
      return value != undefined ? value.description : '';
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
    sort: false,
    valuePrepareFunction: (value: string | number) => {
      return format(new Date(value), 'dd-MM-yyyy');
      return value;
    },
  },
  endDate: {
    title: 'Fecha final',
    sort: false,
    valuePrepareFunction: (value: string | number) => {
      return format(new Date(value), 'dd-MM-yyyy');
      return value;
    },
  },
  statusContract: {
    title: 'Vigente',
    sort: false,
    valuePrepareFunction: (value: string | number) => {
      if (value === '1') {
        return 'Sí';
      } else if (value === '0') {
        return 'No';
      } else {
        return '';
      }
    },
  },
};
