import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';

export const GOOD_SSSUBTYPE_COLUMNS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    type: 'string',
    sort: false,
  },
  numType: {
    title: 'Tipo bien',
    type: 'string',
    valuePrepareFunction: (value: IGoodType) => {
      return value.nameGoodType;
    },
    sort: false,
  },
  numSubType: {
    title: 'Subtipo bien',
    type: 'string',
    valuePrepareFunction: (value: IGoodSubType) => {
      return value.nameSubtypeGood;
    },
    sort: false,
  },
  numSsubType: {
    title: 'Ssubtipo bien',
    type: 'string',
    valuePrepareFunction: (value: IGoodSsubType) => {
      return value.description;
    },
    sort: false,
  },
  numClasifGoods: {
    title: 'N Clasif Bien',
    type: 'number',
    sort: false,
  },
  numClasifAlterna: {
    title: 'N Clasif alterna',
    type: 'number',
    sort: false,
  },
  numRegister: {
    title: 'N registro',
    type: 'number',
    sort: false,
  },
};
