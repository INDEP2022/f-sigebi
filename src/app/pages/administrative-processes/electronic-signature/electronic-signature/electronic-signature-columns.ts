import { formatearFecha } from '../../administration-assets/search-tab/search-columns';

export const ELECTRONICSIGNATURE_COLUMNS = {
  clave_oficio_armada: {
    title: 'Clave oficio Armada',
    width: '20%',
    sort: false,
  },
  fec_dictaminacion: {
    title: 'Fecha Dictámen',
    width: '20%',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return formatearFecha(new Date(value));
    },
  },
  tipo_dictaminacion: {
    title: 'Tipo Dictámen',
    width: '20%',
    sort: false,
  },
  remitente: {
    title: 'Remitente',
    width: '10%',
    sort: false,
  },
  estatus_of: {
    title: 'Estatus',
    width: '10%',
    sort: false,
  },

  firma: {
    title: 'Firma electrónica',
    width: '20%',
    sort: false,
  },
};

export const DATA = [
  {
    armedTradeKey: 'CRE/FDER/232/300/3',
    opinionDate: '02/02/2022',
    opinionType: 'Tipo 1',
    sender: 'SAE',
    status: 'Activo',
    electronicSignature: 'SI',
    noRecord: '233',
    noSteeringWheel: '245',
    remitente: 'sigebiadmon',
  },
  {
    armedTradeKey: 'CRE/FDER/232/300/3',
    opinionDate: '02/02/2022',
    opinionType: 'Tipo 1',
    sender: 'SAE',
    status: 'Activo',
    electronicSignature: 'S/FIRMA',
    noRecord: '555',
    noSteeringWheel: '23',
    remitente: 'sigebiadmon',
  },
  {
    armedTradeKey: 'CRE/FDER/232/300/3',
    opinionDate: '02/02/2022',
    opinionType: 'Tipo 2',
    sender: 'SAE',
    status: 'Activo',
    electronicSignature: 'SI',
    noRecord: '666',
    noSteeringWheel: '111',
    remitente: 'sige',
  },
];
