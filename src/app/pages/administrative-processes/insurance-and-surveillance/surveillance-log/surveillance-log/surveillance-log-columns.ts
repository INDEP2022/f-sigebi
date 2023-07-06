import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';

export const SURVEILLANCE_LOG_COLUMNS: any = {
  binnacleId: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  requestDate: {
    title: 'Fecha Solicitud',
    sort: false,
    valuePrepareFunction: (text: string) => {
      if (text) {
        const parts = text.split('-');
        if (parts.length === 3) {
          return parts.reverse().join('/');
        }
      }
      return '';
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  attentionDate: {
    title: 'Fecha Atención',
    type: 'number',
    sort: false,
    valuePrepareFunction: (text: string) => {
      if (text) {
        const parts = text.split('-');
        if (parts.length === 3) {
          return parts.reverse().join('/');
        }
      }
      return '';
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  processMnto: {
    title: 'Tipo de Mantenimiento',
    type: 'string',
    sort: false,
    width: '200',
  },
  reasonMnto: {
    title: 'Motivo de Cambio',
    type: 'number',
    sort: false,
  },
  usrRequest: {
    title: 'Usuario Solicita',
    type: 'number',
    sort: false,
  },
  usrRun: {
    title: 'Usuario Ejecuta',
    type: 'number',
    sort: false,
  },
  usrAuthorize: {
    title: 'Usuario Autoriza',
    type: 'number',
    sort: false,
  },
  /*delegationNumber: {
    title: 'Delegación',
    type: 'string',
    sort: false,
    valuePrepareFuntion: (value: IDelegation) => {
      return value?.description;
    }
  },*/
  delegation: {
    title: 'Delegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IDelegation) => {
      return value?.description;
    },
    filterFunction: (cell?: any, search?: string) => {
      return search != null ? search : '';
    },
  },
};
