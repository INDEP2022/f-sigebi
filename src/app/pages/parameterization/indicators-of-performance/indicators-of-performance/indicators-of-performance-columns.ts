import { IProcedureArea } from 'src/app/core/models/catalogs/indicators-parameter.model';

export const INDICATORSOFPERFORMANCE_COLUMNS = {
  id: {
    title: 'Consecutivo',
    width: '10%',
    sort: false,
  },
  description: {
    title: 'Descripción',
    //width: '20%',
    sort: false,
  },
  procedureArea: {
    title: 'Codigo Área de Trámite',
    //width: '10%',
    sort: false,
  },
  procedureAreaDetails: {
    title: 'Área de Trámite',
    valuePrepareFunction: (value: IProcedureArea) => {
      return value != null ? value.description : '';
    },
    filterFunction: (cell?: any, search?: string) => {
      return search != null ? search : '';
    },
    //width: '10%',
    sort: false,
  },
  certificateType: {
    title: 'Etiqueta Acta',
    //width: '10%',
    sort: false,
  },
};
export const INDICATORSPERFORMANCE_COLUMNS = {
  indicatorNumber: {
    title: 'No. Indicador',
    width: '10%',
    sort: false,
  },
  initialDate: {
    title: 'Término',
    //width: '10%',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },
  },
  daysLimNumber: {
    title: 'Días Límite',
    width: '10%',
    sort: false,
  },
  hoursLimNumber: {
    title: 'Hora Límite',
    //width: '10%',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },
  },
  contractZoneKey: {
    title: 'Zona Contrato',
    width: '10%',
    sort: false,
  },
  initialDDate: {
    title: 'Fecha Ind. Page',
    //width: '20%',
    sort: false,
  },
  endDDate: {
    title: 'Fecha Ind.Término',
    //width: '20%',
    sort: false,
  },
  endDate: {
    title: 'Fin',
    //width: '10%',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },
  },
};
