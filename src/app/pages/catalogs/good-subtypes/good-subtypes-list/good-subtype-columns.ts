import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';

export const GOOD_SUBTYPES_COLUMNS = {
  id: {
    title: 'ID',
    type: 'number',
    sort: false,
  },
  nameSubtypeGood: {
    title: 'Nombre Subtipo',
    type: 'string',
    sort: false,
  },
  typeGoodDetails: {
    title: 'Nombre Tipo',
    type: 'string',
    sort: false,
    valuePrepareFunction: (goodType: IGoodType) => {
      return goodType.nameGoodType;
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.nameGoodType;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  noPhotography: {
    title: 'No. Fotografías',
    type: 'string',
    sort: false,
  },
  descriptionPhotography: {
    title: 'Descripción Fotografía',
    type: 'string',
    sort: false,
  },
  /*noRegister: {
    title: 'No. Registro',
    type: 'number',
    sort: false,
  },
  version: {
    title: 'Versión',
    type: 'number',
    sort: false,
  },*/
};
