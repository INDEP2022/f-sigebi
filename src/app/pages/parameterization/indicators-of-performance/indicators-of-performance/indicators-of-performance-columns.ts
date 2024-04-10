import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
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
    type: 'html',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);

      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    /*valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },*/
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
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
    type: 'html',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${
        text
          ? text.split('T')[0].split('-').reverse().join('/') +
            ' ' +
            text.split('T')[1].split(':')[0] +
            ':' +
            text.split('T')[1].split(':')[1]
          : ''
      }`;
    },
    /*valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },*/
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
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
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'FRECEPCION', title: 'Fec. Recepción/Escaneo' },
          { value: 'FINICIA', title: 'Fecha de Inicio' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.initialDDate == 'FRECEPCION') {
        return 'Fec. Recepción/Escaneo';
      } else if (row.initialDDate == 'FINICIA') {
        return 'Fecha de Inicio';
      } else {
        return row.initialDDate;
      }
    },
    filterFunction: () => {
      return true;
    },
  },
  endDDate: {
    title: 'Fecha Ind.Término',
    //width: '20%',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'FFINALIZA', title: 'Fec. Término/Desahogo' },
          { value: 'FESCANEO', title: 'Fecha de Inicio' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.endDDate == 'FFINALIZA') {
        return 'Fec. Término/Desahogo';
      } else if (row.endDDate == 'FESCANEO') {
        return 'Fecha de Escaneo';
      } else {
        return row.endDDate;
      }
    },
    filterFunction: () => {
      return true;
    },
  },
  endDate: {
    title: 'Fin',
    //width: '10%',
    type: 'html',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);

      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    /*valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },*/
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
