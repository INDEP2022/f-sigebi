import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';

export const GOOD_SSUBTYPES_COLUMNS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  noType: {
    title: 'Tipo Bien',
    type: 'string',
    valuePrepareFunction: (value: IGoodType) => {
      return value.nameGoodType;
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.nameGoodType;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
    sort: false,
  },

  /*nameGoodType: {
    title: 'Tipo Bien',
    type: 'string',
    sort: false,
  },*/

  noSubType: {
    title: 'Subtipo Bien',
    type: 'string',
    valuePrepareFunction: (value: IGoodSubType) => {
      return value.nameSubtypeGood;
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.nameSubtypeGood;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
    sort: false,
  },

  /*nameSubtypeGood: {
    title: 'Subtipo Bien',
    type: 'string',
    sort: false,
  },*/
};
