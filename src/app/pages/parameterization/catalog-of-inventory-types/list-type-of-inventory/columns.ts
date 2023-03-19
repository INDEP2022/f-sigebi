import { TypesInventory } from 'src/app/core/models/ms-inventory-query/inventory-query.model';

export const DETAIL_INVENTOTY_COLUMNS = {
  cveTypeInventory: {
    title: 'Tipo Inventario',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
};
export const DETAIL_INVENTORI_TYPE_COLUMNS = {
  noTypeInventory: {
    title: 'Número',
    sort: false,
  },
  attributeInventory: {
    title: 'Atributo Inventario',
    sort: false,
  },
  typeData: {
    title: 'Tipo de Dato',
    sort: false,
  },
  typesInventory: {
    title: 'Tipo Inventario',
    valuePrepareFunction: (value: TypesInventory) => {
      return value.description;
    },
    sort: false,
  },
};
