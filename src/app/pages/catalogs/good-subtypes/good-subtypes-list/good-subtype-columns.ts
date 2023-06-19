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
  idTypeGood: {
    title: 'Nombre Tipo',
    type: 'string',
    valuePrepareFunction: (goodType: IGoodType) => {
      return goodType.nameGoodType;
    },
    sort: false,
  },
  noPhotography: {
    title: 'No. Fotografías',
    type: 'string',
    sort: false,
  },
  descriptionPhotography: {
    title: 'Descripción fotografía',
    type: 'string',
    sort: false,
  },
  noRegister: {
    title: 'No. Registro',
    type: 'number',
    sort: false,
  },
  version: {
    title: 'Versión',
    type: 'number',
    sort: false,
  },
};
