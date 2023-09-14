import { IParameterConcept } from 'src/app/core/models/ms-comer-concepts/parameter-concept';

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
    // valuePrepareFunction: (cell: any, row: IParameterConcept) => {
    //   if (row.address) {
    //     switch (row.address) {
    //       case 'I':
    //         return 'INMUEBLES';
    //       case 'C':
    //         return 'GENERAL';
    //       case 'V':
    //         return 'VIGILANCIA';
    //       case 'S':
    //         return 'SEGUROS';
    //       case 'J':
    //         return 'JURIDICO';
    //       case 'A':
    //         return 'ADMINISTRACIÓN';
    //       default:
    //         return null;
    //     }
    //   } else {
    //     return null;
    //   }
    // },
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
