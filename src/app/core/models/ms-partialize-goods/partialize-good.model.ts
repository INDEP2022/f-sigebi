import { IGood } from '../ms-good/good';

export interface IPartializedGoods {
  partializedId: string;
  goodNumber: IGood;
  description: string;
  fatherIndicator: string;
  childIndicator?: any;
  grandSonIndicator?: any;
  greatGrandsonIndicator?: any;
  gGrandsonIndicator?: any;
  gGreatGrandsonIndicator?: any;
  ggGreatGrandsonIndicator?: any;
  gggGreatGrandsonIndicator?: any;
  ggggGreatGrandsonIndicator?: any;
  gggggGreatGrandsonIndicator?: any;
  captureDate: string;
  nbOrigin?: any;
}

export interface IPartializedGoodList {
  goodNumber: number;
  partializedId: string;
  description: string;
}
