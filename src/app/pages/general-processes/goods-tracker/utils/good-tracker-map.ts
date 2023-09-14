interface IGoodTrackerMapClasif {
  selecSsstype: 'S' | 'N';
  selecSstype: 'S' | 'N';
  selecStype: 'S' | 'N';
  selecType: 'S' | 'N';
  clasifGoodNumber: string[] | number[];
  typeNumber: string[] | number[];
  subTypeNumber: string[] | number[];
  ssubTypeNumber: string[] | number[];
}
interface IGoodTrackerMapParval {
  status: string[] | number[];
  proExtDom: string[] | number[];
  label: string;
  goodNumber: string[] | number[];
  inventorySiabiId: string;
  invCurrentSiabi: string;
  propertyCisiId: string;
  goodFatherMenageNumber: number | string;
  tDescription: string;
  tAttribute: string;
  actKey: string;
  dictum: string;
  tValueIni: number;
  tValueFin: number;
  proceedingsNumber: string[] | number[];
  identifier: string;
  photoDate: string;
  destinationDateIni: string;
  destinationDateFin: string;
  statusChange: string[] | number[];
  processChange: string[] | number[];
  changeDateIni: string;
  changeDateFin: string;
  expTransfereeNumber: string;
  alienationProcessNumber: string;
  chkIrregular: string;
  chkListGood: string;
  chkListExpe: string;
  photography: string;
}
interface IGoodTrackerMapNotification {
  previousAscertainment: string;
  criminalCase: string;
  flierNumber: string[] | number[];
  flierType: string;
  judgedNumber: string;
  minpubNumber: string;
  nameIndicated: string;
  externalOfficeDate: string;
  receptionDate: string;
  receptionEndDate: string;
  protectionKey: string;
  touchPenaltyKey: string;
  externalOfficeKey: string;
}
interface IGoodTrackerMapGlobal {
  gstSelecProced: string;
  selecAuthority: string;
  caTransfereeNumber: string[] | number[];
  caStationNumber: string[] | number[];
  caAuthorityNumber: string[] | number[];
  selecStation: string;
  csTransfereeNumber: string[] | number[];
  csStationNumber: string[] | number[];
  selecTransferee: string;
  ctTransfereeNumber: string[] | number[];
  gstSelecStore: string;
  selecStore: string;
  cstStoreNumber: string[] | number[];
  gstSelecEntfed: string;
  selecEntfed: string;
  otKey: string[] | number[];
  gstSelecEntfedOne: string;
  selecEntfedTwo: string;
  otKeyOne: string[] | number[];
  gstSelecDeleg: string;
  selecDeleg: string;
  delegationNumber: string[] | number[];
  relGoods: string;
  relExpe: string;
}
export class GoodTrackerMap {
  clasifGood: IGoodTrackerMapClasif = {
    selecSsstype: null,
    selecSstype: null,
    selecStype: null,
    selecType: null,
    clasifGoodNumber: null,
    typeNumber: null,
    subTypeNumber: null,
    ssubTypeNumber: null,
  };
  parval: IGoodTrackerMapParval = {
    status: null,
    proExtDom: null,
    label: null,
    goodNumber: null,
    inventorySiabiId: null,
    invCurrentSiabi: null,
    propertyCisiId: null,
    goodFatherMenageNumber: null,
    tDescription: null,
    tAttribute: null,
    actKey: null,
    dictum: null,
    tValueIni: null,
    tValueFin: null,
    proceedingsNumber: null,
    identifier: null,
    photoDate: null,
    destinationDateIni: null,
    destinationDateFin: null,
    statusChange: null,
    processChange: null,
    changeDateIni: null,
    changeDateFin: null,
    expTransfereeNumber: null,
    alienationProcessNumber: null,
    chkIrregular: null,
    chkListGood: null,
    chkListExpe: null,
    photography: null,
  };
  notification: IGoodTrackerMapNotification = {
    previousAscertainment: null,
    criminalCase: null,
    flierNumber: null,
    flierType: null,
    judgedNumber: null,
    minpubNumber: null,
    nameIndicated: null,
    externalOfficeDate: null,
    receptionDate: null,
    receptionEndDate: null,
    protectionKey: null,
    touchPenaltyKey: null,
    externalOfficeKey: null,
  };
  global: IGoodTrackerMapGlobal = {
    gstSelecProced: null,
    selecAuthority: null,
    caTransfereeNumber: null,
    caStationNumber: null,
    caAuthorityNumber: null,
    selecStation: null,
    csTransfereeNumber: null,
    csStationNumber: null,
    selecTransferee: null,
    ctTransfereeNumber: null,
    gstSelecStore: null,
    selecStore: null,
    cstStoreNumber: null,
    gstSelecEntfed: null,
    selecEntfed: null,
    otKey: null,
    gstSelecEntfedOne: null,
    selecEntfedTwo: null,
    otKeyOne: null,
    gstSelecDeleg: null,
    selecDeleg: null,
    delegationNumber: null,
    relGoods: null,
    relExpe: null,
  };
  gabinete?: boolean;
  inventario?: any;
  request?: any;
}
