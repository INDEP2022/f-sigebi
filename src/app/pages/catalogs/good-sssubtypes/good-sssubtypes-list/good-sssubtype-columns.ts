import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';

export const GOOD_SSSUBTYPE_COLUMNS = {
  id: {
    title: 'Código SubsubsubTipo',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  numType: {
    title: 'Tipo Bien',
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
    title: 'Subtipo Bien',
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
    title: 'Subsubtipo Bien',
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
    with: '200px',
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
