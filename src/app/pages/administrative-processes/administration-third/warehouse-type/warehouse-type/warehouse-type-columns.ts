import { IWarehouseTypeWarehouse } from 'src/app/core/models/catalogs/type-warehouse.model';

export const WAREHOUSE_TIPE_COLUMNS = {
  warehouseTypeId: {
    title: 'Tipo Almacén',
    width: '2%',
    sort: false,
  },
  descriptionType: {
    title: 'Tipo de descripción',
    // width: '20%',
    sort: false,
  },
  porcAreaA: {
    title: 'Porc. Area A',
    // width: '20%',
    sort: false,
  },
  porcAreaB: {
    title: 'Porc. Area B',
    // width: '20%',
    sort: false,
  },
  porcAreaC: {
    title: 'Porc. Area C',
    // width: '20%',
    sort: false,
  },
  porcAreaD: {
    title: 'Porc. Area D',
    // width: '20%',
    sort: false,
  },
  timeMaxContainer: {
    title: 'Tiempo Max. Contenedor',
    // width: '20%',
    sort: false,
  },
  timeMaxDestruction: {
    title: 'Tiempo Max. Destrucción',
    // width: '20%',
    sort: false,
  },
};
export const QUALIFIERS_COLUMNS = {
  classifGoodNumber: {
    title: 'Calificadores',
    // width: '10%',
    sort: false,
  },
  descClassif: {
    title: 'Descripción',
    // width: '20%',
    sort: false,
  },
  costId: {
    title: 'Id Costo',
    // width: '10%',
    sort: false,
  },
  descCost: {
    title: 'Proceso/Servicio/Tipo Servicio/Turno/Costo Variable',
    // width: '20%',
    sort: false,
  },
  warehouseTypeId: {
    title: 'Tipo Almacén',
    valuePrepareFunction: (value: IWarehouseTypeWarehouse) => {
      return value != null ? value.descriptionType : '-';
    },
    // width: '2%',
    sort: false,
  },
};
