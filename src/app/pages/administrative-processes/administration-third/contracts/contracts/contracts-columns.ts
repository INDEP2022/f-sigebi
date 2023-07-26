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
    valuePrepareFunction: (value: string) => {
      const partesFecha = value.split('-'); // Dividir la fecha en partes: [año, mes, día]
      const fechaFormateada = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;
      return fechaFormateada;
    },
  },
  endDate: {
    title: 'Fecha final',
    sort: false,
    valuePrepareFunction: (value: string) => {
      const partesFecha = value.split('-'); // Dividir la fecha en partes: [año, mes, día]
      const fechaFormateada = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;
      return fechaFormateada;
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
