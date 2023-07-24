import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';

export const GOOD_SSSUBTYPE_COLUMNS = {
  id: {
    title: 'Código SssubTipo',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  numType: {
    title: 'Tipo bien',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IGoodType) => {
      return value.nameGoodType;
    },
    filterFunction: (cell?: any, search?: string) => {
      return search != null ? search : '';
    },
  },
  numSubType: {
    title: 'Subtipo bien',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IGoodSubType) => {
      return value.nameSubtypeGood;
    },
    filterFunction: (cell?: any, search?: string) => {
      return search != null ? search : '';
    },
  },
  numSsubType: {
    title: 'Ssubtipo bien',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IGoodSsubType) => {
      return value.description;
    },
    filterFunction: (cell?: any, search?: string) => {
      return search != null ? search : '';
    },
  },
  numClasifGoods: {
    title: 'No. Clasif Bien',
    type: 'number',
    sort: false,
  },
  // numClasifAlterna: {
  //   title: 'No. Clasif alterna',
  //   type: 'number',
  //   sort: false,
  // },
  // numRegister: {
  //   title: 'No. Registro',
  //   type: 'number',
  //   sort: false,
  // },
};
