import { IProcedureArea } from 'src/app/core/models/catalogs/indicators-parameter.model';

export const INDICATORSOFPERFORMANCE_COLUMNS = {
  id: {
    title: 'Consecutivo',
    width: '10%',
    sort: false,
  },
  description: {
    title: 'Descripción',
    width: '20%',
    sort: false,
  },
  procedureArea: {
    title: 'Área de Trámite',
    valuePrepareFunction: (value: IProcedureArea) => {
      return value != null ? value.description : '';
    },
    width: '10%',
    sort: false,
  },
  certificateType: {
    title: 'Etiqueta acta',
    width: '10%',
    sort: false,
  },
};
export const INDICATORSPERFORMANCE_COLUMNS = {
  indicatorNumber: {
    title: 'page',
    width: '10%',
    sort: false,
  },
  initialDate: {
    title: 'Término',
    width: '10%',
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
    width: '10%',
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
    title: 'Fecha Ind.page',
    width: '20%',
    sort: false,
  },
  endDDate: {
    title: 'Fecha Ind.Término',
    width: '20%',
    sort: false,
  },
};
