export interface IRequest {
  date?: string;
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
  officeDate?: any;
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
  fretwork?: string;
  volumem3Boat?: string;
  eslora?: number;
  originBoat?: string;
  manga?: string;
  typeUseBoat?: string;
  boatName?: string;
  yearProduction?: number;
  boatRegistration?: string;
  capacityLtsBoat?: string;
  boats?: string;

  //

  //aircraft
  aircraftArmored?: boolean;
  yearProductionAircraft?: number;
  modelAircraft?: string;
  operativeStatusAircraf?: string;
  engineNumAircraft?: number;
  numEnginesAircraft?: number;
  enrollmentAircraft?: string;
  AeronauticsRegistry?: string;
  serieAircraft?: number;
  typeAirplane?: string;
  originAircraft?: string;
  flagAircraft?: string;
  typeUseAirCraft?: string;

  //inmueble
  descriptionImmovable?: string;
  custody?: string;
  statusImmovable?: string;
  requireVigilance?: string;
  levelVigilance?: string;
  typeImmovable?: string;
  metersWarehouse?: string;
  metersLand?: number;
  rooms?: number;
  metersBuiltLand?: number;
  bathRoom?: string;
  kitchen?: string;
  dinningRoom?: string;
  livingRoom?: string;
  studyRoom?: string;
  garage?: string;
  publicDeed?: string;
  appraisedValue?: string;
  valueDate?: string;
  gravamen?: string;
}
