export interface IRequest {
  date?: Date;
  noOfi?: string;
  regDelega?: string;
  entity?: string;
  tranfe?: string;
  transmitter?: string;
  authority?: string;
  typeUse?: string;
  receiUser?: string;
  noExpedient?: string;
  typeExpedient?: string;
  noRequest?: string;

  //
  responsible?: string;

  //Reception Requests
  priority?: boolean;
  infoProvenance?: string;
  receptDate?: string;
  officeDate?: Date;
  //typeExpedient?: string;
  indiciado?: string;
  nameSender?: string;
  publicMinister?: string;
  roleSender?: string;
  tribunal?: string;
  phoneSender?: number;
  crime?: string;
  emailSender?: string;
  typeReception?: string;
  sender?: string;
  destinationManage?: string;
  contributor?: string;
  subject?: string;
  transExpedient?: number;
  typeTransfer?: string;
  transferEntityNotes?: string;
  observations?: string;

  //solicitud del expediente
  status?: string;

  //registro solicitud o bien
  noManagement?: string;
  descripTransfeAsset?: string;
  typeAsset?: string;
  physicalState?: string;
  conservationState?: string;
  tansferUnitMeasure?: string;
  transferAmount?: string;
  destinyLigie?: string;
  destinyTransfer?: string;
  householdAsset?: string;

  //registro solicitud -> bienes
  duplicity?: boolean;
  capacityLts?: number;
  volumem3?: number;
  origin?: string;
  LigieUnitMeasure?: string;
  avaluo?: boolean;
  meetNormal?: boolean;
  notes?: [null];
  destintSae?: string;
  referenceVia2?: string;
  state?: string;
  municipe?: string;
  referenceVia3?: string;
  longitud?: string;
  latitud?: string;
  suburb?: string;
  cp?: string;
  nameRoute?: string;
  numExt?: string;
  originRoute?: string;
  numInt?: string;
  routeDestination?: string;
  referenceVia1?: number;
  description?: number;

  //Vehiculo
  brand?: string;
  enrollment?: string;
  subBrand?: string;
  serie?: string;
  armored?: boolean;
  chassis?: string;
  model?: string;
  numDoors?: number;
  cabin?: number;
  numEje?: number;
  originVehicle?: string;
  engineNum?: string;
  canCirculate?: boolean;
  hasTheftReport?: boolean;

  //Embarcaciones
  boatArmored?: boolean;
  operativeStatus?: string;
  engineNumBoat?: string;
  numEngines?: string;
  enrollmentBoat?: string;
  flag?: string;
  cabinBoat?: number;
}
