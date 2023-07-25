import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const NOTIFICATIONS_COLUMNS = {
  expedientNumber: {
    title: 'No. Expediente',
    type: 'string',
    sort: false,
  },
  preliminaryInquiry: {
    title: 'Averiguación Previa',
    type: 'string',
    sort: false,
  },
  criminalCase: {
    title: 'Causa Penal',
    type: 'string',
    sort: false,
  },
  wheelNumber: {
    title: 'No. Volante',
    type: 'number',
    sort: false,
  },
  versionUser: {
    title: 'Nombre Indiciado',
    type: 'string',
    sort: false,
  },
  receiptDate: {
    title: 'Fecha Recepción',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  protectionKey: {
    title: 'Amparo',
    type: 'string',
    sort: false,
  },
  touchPenaltyKey: {
    title: 'Toca Penal ',
    type: 'string',
    sort: false,
  },
  courtNumber: {
    title: 'No. Juzgado ',
    type: 'string',
    sort: false,
  },
  externalOfficeDate: {
    title: 'Fecha Oficio Externo',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  minpubNumber: {
    title: 'Ministerio Público',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      console.log(value);
      return value ? value.descripcion : '';
    },
  },
  institutionNumber: {
    title: 'Oficio Externo No.',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  entFedKey: {
    title: 'Entidad Federativa',
    type: 'string',
    sort: false,
  },
};

/* 
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
*/
export const GOODS_COLUMNS = {
  goodTypeId: {
    title: 'Tipo',
    type: 'number',
    sort: false,
  },
  subTypeId: {
    title: 'Subtipo',
    type: 'number',
    sort: false,
  },
  subTypeId1: {
    title: 'Ssubtipo',
    type: 'number',
    sort: false,
  },
  goodClassNumber: {
    title: 'Sssubtipo',
    type: 'number',
    sort: false,
  },
  fileNumber: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
  },
  goodId: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  delegationNumber: {
    title: 'Delegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  subDelegationNumber: {
    title: 'Subdelegación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
  },
  val1: {
    title: 'Val1',
    type: 'string',
    sort: false,
  },
  val2: {
    title: 'Val2',
    type: 'string',
    sort: false,
  },
  val3: {
    title: 'Val3',
    type: 'string',
    sort: false,
  },
  val4: {
    title: 'Val4',
    type: 'string',
    sort: false,
  },
  val5: {
    title: 'Val5',
    type: 'string',
    sort: false,
  },
  val6: {
    title: 'Val6',
    type: 'string',
    sort: false,
  },
  val7: {
    title: 'Val7',
    type: 'string',
    sort: false,
  },
  val8: {
    title: 'Val8',
    type: 'string',
    sort: false,
  },
  val9: {
    title: 'Val9',
    type: 'string',
    sort: false,
  },
  val10: {
    title: 'Val10',
    type: 'string',
    sort: false,
  },
  val11: {
    title: 'Val11',
    type: 'string',
    sort: false,
  },
  val12: {
    title: 'Val12',
    type: 'string',
    sort: false,
  },
  val13: {
    title: 'Val13',
    type: 'string',
    sort: false,
  },
  val14: {
    title: 'Val14',
    type: 'string',
    sort: false,
  },
  val15: {
    title: 'Val15',
    type: 'string',
    sort: false,
  },
  val16: {
    title: 'Val16',
    type: 'string',
    sort: false,
  },
  val17: {
    title: 'Val17',
    type: 'string',
    sort: false,
  },
  val18: {
    title: 'Val18',
    type: 'string',
    sort: false,
  },
  val19: {
    title: 'Val19',
    type: 'string',
    sort: false,
  },
  val20: {
    title: 'Val2',
    type: 'string',
    sort: false,
  },
  val21: {
    title: 'Val21',
    type: 'string',
    sort: false,
  },
  val22: {
    title: 'Val22',
    type: 'string',
    sort: false,
  },
  val23: {
    title: 'Val23',
    type: 'string',
    sort: false,
  },
  val24: {
    title: 'Val24',
    type: 'string',
    sort: false,
  },
  val25: {
    title: 'Val25',
    type: 'string',
    sort: false,
  },
  val26: {
    title: 'Val26',
    type: 'string',
    sort: false,
  },
  val27: {
    title: 'Val27',
    type: 'string',
    sort: false,
  },
  val28: {
    title: 'Val28',
    type: 'string',
    sort: false,
  },
  val29: {
    title: 'Val29',
    type: 'string',
    sort: false,
  },
  val30: {
    title: 'Val30',
    type: 'string',
    sort: false,
  },
  val31: {
    title: 'Val31',
    type: 'string',
    sort: false,
  },
  val32: {
    title: 'Val3',
    type: 'string',
    sort: false,
  },
  val33: {
    title: 'Val33',
    type: 'string',
    sort: false,
  },
  val34: {
    title: 'Val34',
    type: 'string',
    sort: false,
  },
  val35: {
    title: 'Val35',
    type: 'string',
    sort: false,
  },
  val36: {
    title: 'Val36',
    type: 'string',
    sort: false,
  },
  val37: {
    title: 'Val37',
    type: 'string',
    sort: false,
  },
  val38: {
    title: 'Val38',
    type: 'string',
    sort: false,
  },
  val39: {
    title: 'Val39',
    type: 'string',
    sort: false,
  },
  val40: {
    title: 'Val40',
    type: 'string',
    sort: false,
  },
};
