export interface ISegAppScreen {
  screenKey: string;
  description: string;
  inMenu: string;
  nameMenu: string;
  registryNumber: string;
  assignAttrib: string;
  assignAll: string;
}

export interface IScreenStatusCValUniversalFolio {
  screen: string;
  adminTypeKey: string;
  goodNumber: number;
}

export interface IScreenStatusCValRevocation {
  screen: string;
  adminTypeKey: string;
  goodNumber: number;
}
