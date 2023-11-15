import { IParameterConcept } from 'src/app/core/models/ms-comer-concepts/parameter-concept';
import { getAddress } from 'src/app/core/services/ms-commer-concepts/concepts.service';

export const COLUMNS = {
  parameter: {
    title: 'Parámetro',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (cell: any, row: IParameterConcept) => {
      if (row.parameterFk) {
        return row.parameterFk.description;
      } else {
        return null;
      }
    },
  },
  value: {
    title: 'Valor',
    type: 'string',
    sort: false,
  },
  address: {
    title: 'Dirección',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any, row: any) => {
      // DATA FROM HERE GOES TO renderComponent
      return row.address ? getAddress(row.address) : '';
    },
  },
  // creationDate: {
  //   title: 'Fecha de creación',
  //   type: 'string',
  //   sort: false,
  //   editable: false,
  //   valuePrepareFunction: (cell: any, row: IParameterConcept) => {
  //     return row.creationDate
  //       ? formatForIsoDate(row.creationDate, 'string')
  //       : null;
  //   },
  // },
  // creationUser: {
  //   title: 'Usuario de creación',
  //   type: 'string',
  //   sort: false,
  //   editable: false,
  // },
};
