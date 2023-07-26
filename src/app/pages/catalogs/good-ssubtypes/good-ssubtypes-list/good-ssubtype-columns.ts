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
    sort: false,
  },
  noSubType: {
    title: 'Subtipo Bien',
    type: 'string',
    valuePrepareFunction: (value: IGoodSubType) => {
      return value.nameSubtypeGood;
    },
    sort: false,
  },
};
