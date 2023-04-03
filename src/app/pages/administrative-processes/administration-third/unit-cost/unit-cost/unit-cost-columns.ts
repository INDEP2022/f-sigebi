export const COSTKEY_COLUMNS = {
  processNumber: {
    title: 'N°',
    // width: '5%',
    sort: false,
  },
  strategyProcess: {
    title: 'Proceso',
    // width: '10%',
    sort: false,
    valuePrepareFunction: (value: any) => {
      if (value) return value.description;
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
  serviceNumber: {
    title: 'N°',
    // width: '5%',
    sort: false,
  },
  strategyService: {
    title: 'Servicio',
    // width: '10%',
    sort: false,
    valuePrepareFunction: (value: any) => {
      if (value) return value.description;
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
  serviceTypeNumber: {
    title: 'N°',
    // width: '5%',
    sort: false,
  },
  strategyServicetype: {
    title: 'Especificación',
    // width: '30%',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      if (value) return value.description;
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
  shiftNumber: {
    title: 'N°',
    // width: '5%',
    sort: false,
  },
  strategyShift: {
    title: 'Turno/Tipo',
    // width: '10%',
    sort: false,
    valuePrepareFunction: (value: any) => {
      if (value) return value.description;
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
  varCostNumber: {
    title: 'N°',
    // width: '5%',
    sort: false,
  },
  strategyVariableCost: {
    title: 'Variable costo',
    // width: '15%',
    sort: false,
    valuePrepareFunction: (value: any) => {
      if (value) return value.description;
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
  costId: {
    title: 'Id Costo',
    // width: '10%',
    sort: false,
  },
};
export const VALIDITYCOST_COLUMNS = {
  cveZoneContract: {
    title: 'Zona',
    // width: '5%',
    sort: false,
  },
  startDate: {
    title: 'Fecha inicial',
    // width: '10%',
    sort: false,
  },
  finalDate: {
    title: 'Fecha final',
    // width: '10%',
    sort: false,
  },
  costUnitarian: {
    title: 'Costo unitario',
    // width: '10%',
    sort: false,
  },
  porceInflation: {
    title: '% Indice inflación',
    // width: '10%',
    sort: false,
  },
  amount: {
    title: 'Importe',
    // width: '10%',
    sort: false,
  },
  validity: {
    title: 'Vig.',
    // width: '10%',
    sort: false,
  },
};
