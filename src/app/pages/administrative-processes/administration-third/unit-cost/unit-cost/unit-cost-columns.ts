import { IZoneContract } from 'src/app/core/models/catalogs/zone-contract.model';
import { IStrategyProcess } from 'src/app/core/models/ms-strategy-process/strategy-process.model';
import { IStrategyServiceType } from 'src/app/core/models/ms-strategy-service-type/strategy-service-type.model';
import { IStrategyService } from 'src/app/core/models/ms-strategy-service/strategy-service.model';
import { IStrategyShift } from 'src/app/core/models/ms-strategy-shift/strategy-shift.model';
import { IStrategyVariableCost } from 'src/app/core/models/ms-strategy-variable-cost/strategy-variable-cost.model';

export const COSTKEY_COLUMNS = {
  processNumber: {
    title: 'N°',
    // width: '5%',
    sort: false,
  },
  strategyProcess: {
    title: 'Proceso',
    sort: false,
    valuePrepareFunction: (value: IStrategyProcess) => {
      if (value) {
        return value.description;
      } else {
        return '';
      }
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
    sort: false,
  },
  strategyService: {
    title: 'Servicio',
    sort: false,
    valuePrepareFunction: (value: IStrategyService) => {
      if (value) {
        return value.description;
      } else {
        return '';
      }
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
    sort: false,
  },
  strategyServicetype: {
    title: 'Especificación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IStrategyServiceType) => {
      if (value) {
        return value.description;
      } else {
        return '';
      }
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
    sort: false,
  },
  strategyShift: {
    title: 'Turno/Tipo',
    sort: false,
    valuePrepareFunction: (value: IStrategyShift) => {
      if (value) {
        return value.description;
      } else {
        return '';
      }
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
    sort: false,
  },
  strategyVariableCost: {
    title: 'Variable costo',
    sort: false,
    valuePrepareFunction: (value: IStrategyVariableCost) => {
      if (value) {
        return value.description;
      } else {
        return '';
      }
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
    sort: false,
  },
};
export const VALIDITYCOST_COLUMNS = {
  zone: {
    title: 'Zona',
    sort: false,
    valuePrepareFunction: (value: IZoneContract) => {
      if (value) {
        return value.description;
      } else {
        return '';
      }
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
  },
  finalDate: {
    title: 'Fecha final',
    sort: false,
  },
  costUnitarian: {
    title: 'Costo unitario',
    sort: false,
  },
  porceInflation: {
    title: '% Indice inflación',
    sort: false,
  },
  validity: {
    title: 'Vigente',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value === '0') {
        return 'No';
      } else if (value === '1') {
        return 'Sí';
      } else {
        return '';
      }
    },
  },
};
