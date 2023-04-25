import { IRequest } from 'src/app/core/models/requests/request.model';

export const COLUMNSDONATION = {
  requestId: {
    title: 'Id Solicitud',
    type: 'number',
    sort: false,
    valuePrepareFunction: (value: IRequest) => {
      return value?.id;
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.id;
      if (column || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  doneeId: {
    title: 'Id Donatario',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value?.id;
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.id;
      if (column || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  donee: {
    title: 'Descripción Donatorio',
    type: 'string',
    sort: false,
  },
  authorizeType: {
    title: 'Estatus',
    type: 'text',
    sort: false,
    valuePrepareFunction: (value: any) => {
      var status: any = [];
      status['T'] = () => 'Trámite';
      status['D'] = () => 'Donación';
      status['A'] = () => 'Asignación';

      return value ? status[value]() : value;
    },
  },
  requestDate: {
    title: 'Fecha Solicitud',
    type: 'string',
    sort: false,
  },
  authorizeCve: {
    title: 'Cve Autorización',
    type: 'string',
    sort: false,
  },
  authorizeDate: {
    title: 'Fecha Autorización',
    type: 'string',
    sort: false,
  },
  justification: {
    title: 'Justificación',
    type: 'string',
    sort: false,
  },
  state: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },
  municipality: {
    title: 'Municipio',
    type: 'string',
    sort: false,
  },
  direction: {
    title: 'Dirección',
    type: 'string',
    sort: false,
  },
};
