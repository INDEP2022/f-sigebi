// PGR Transfer
export interface IPgrTransfer {
  pgrGoodNumber: number;
  office: string;
  aveprev: string;
  description: string;
  saeGoodNumber: number;
  estatus: string;
  pgrBusinessSae: string;
  pgrOffice: string;
  pgrAveprev: string;
  pgrNumaveprevrel: string | null;
  pgrCriminalCase: string | null;
  pgrTransEmiAut: string;
  pgrPhysicalLocation: string | null;
  pgrFeacueaseg: Date | null;
  pgrFedilfeminis: Date | null;
  pgrFenotint: Date;
  pgrTypeGoodVeh: number | null;
  pgrDescrGoodVeh: string | null;
  pgrAmountVeh: number | null;
  pgrUnitMeasureVeh: string | null;
  pgrEdoPhysicalVeh: string | null;
  pgrVehBrand: string | null;
  pgrVehotramarc: string | null;
  pgrVehsubBrand: string | null;
  pgrVehModel: string | null;
  pgrVehnoserie: string | null;
  pgrVehnoEngine: string | null;
  pgrVehcolor: string | null;
  pgrVehOrigin: string | null;
  pgrVehnvlblindaje: string | null;
  pgrTypeGoodAer: number | null;
  pgrDescrGoodAer: string | null;
  pgrAmountAer: number | null;
  pgrUniMeasureAer: string | null;
  pgrEdoPhysicalAer: string | null;
  pgrAerBrand: string | null;
  pgrAerModel: string | null;
  pgrAercolor: string | null;
  pgrAernoEngine: string | null;
  pgrAernoEngine2: string | null;
  pgrAermatriaseg: string | null;
  pgrAermatriactu: string | null;
  pgrTypeGoodEmb: number | null;
  pgrDescrGoodEmb: string | null;
  pgrAmountEmb: number | null;
  pgrUniMeasureEmb: string | null;
  pgrEdoPhysicalEmb: string | null;
  pgrEmbType: string | null;
  pgrEmbModel: string | null;
  pgrEmbOrigin: string | null;
  pgrEmbnoTuition: string | null;
  pgrEmbnoEngine: string | null;
  pgrEmbcolor: string | null;
  pgrEmbName: string | null;
  pgrEmbdimen: string | null;
  pgrTypeGoodInm: number | null;
  pgrDescrGoodInm: string | null;
  pgrAmountInm: number | null;
  pgrUniMeasureInm: string | null;
  pgrEdoPhysicalInm: string | null;
  pgrInmcalle: string | null;
  pgrInmnoofi: string | null;
  pgrInmnoint: string | null;
  pgrInmCity: string | null;
  pgrInmLot: string | null;
  pgrInmApple: string | null;
  pgrInmSuburb: string | null;
  pgrInmentfed: string | null;
  pgrInmcontMenage: string | null;
  pgrInmdelegmuni: string | null;
  pgrInmcp: string | null;
  pgrInmgeore: string | null;
  pgrInmtitregis: string | null;
  pgrTypeGoodNum: number | null;
  pgrDescrGoodNum: string | null;
  pgrAmountNum: number | null;
  pgrUniMeasureNum: string | null;
  pgrEdoPhysicalNum: string | null;
  pgrNueimport: number | null;
  pgrNueTypemon: string | null;
  pgrNuenoBill: string | null;
  pgrNuefedepos: Date | null;
  pgrNuefolficdep: string | null;
  pgrTypeGoodJoy: number | null;
  pgrDescrGoodJoy: string | null;
  pgrAmountJoy: number | null;
  pgrUniMeasureJoy: string | null;
  pgrEdoPhysicalJoy: string | null;
  pgrJoyBrand: string | null;
  pgrJoyModel: string | null;
  pgrJoynoSerie: string | null;
  pgrJoyMaterial: string | null;
  pgrJoykilataje: string | null;
  pgrTypeGoodMen: number | null;
  pgrDescrGoodMen: string | null;
  pgrAmountMen: number | null;
  pgrUniMeasureMen: string | null;
  pgrEdoPhysicalMen: string | null;
  pgrMenProperty: number | null;
  pgrTypeGoodDiv: number | null;
  pgrDescrGoodDiv: string | null;
  pgrAmountDiv: number | null;
  pgrUniMeasureDiv: string | null;
  pgrEdoPhysicalDiv: string | null;
  pgrDivColor: string | null;
  pgrDivmaterial: string | null;
  id: number;
  pgrTransfDate: Date | null;
  pgrCoordregsae: string | null;
  pgrOfficialEnttransf: string | null;
  pgrChargeTransferring: string | null;
  saeRecepopDate: Date | null;
  saeDictamenKey: string | null;
  saeDictamenDate: Date | null;
  saeClarificationKey: string | null;
  saeClarificationDate: Date | null;
  saeProgWithdrawalDate: Date | null;
  saeProgWithdrawalKey: string | null;
  saeSuspensionWithdrawalDate: Date | null;
  saeMinutesSuspensionKey: string | null;
  saeMinutesCancelationKey: string | null;
  saeCancelationWithdrawalDate: Date | null;
  saeMinutesReceptionKey: string | null;
  saeMinutesReceptionDate: Date | null;
  saePersonDeliverySae: string | null;
  saePersonReceiveSae: string | null;
  saeAmountSale: number | null;
  saeNoGood: number | null;
  saeNoGoodBiased: string | null;
  saeNoProceeding: number | null;
  saeStatus: string | null;
  pgrNumofictransf: string | null;
  saeInsertionDate: Date | null;
  saeAtrbMissing: string | null;
  managementNumber: string | null;
  saeDetination: number | null;
}
