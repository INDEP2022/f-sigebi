export interface INotifyDTO {
  goodArray: { goodNumber: number }[];
  delegationNumber: number;
  subdelegationNumber: number;
  departamentNumber: number;
  universalFolio: number;
}

export interface IValidGood {
  goodNumber: number;
  description: string;
  mandate2: number;
  transferorNumber: string;
  amount2: number;
  iva2: number;
  total2: number;
}
