export interface IMassiveGoodTracker {
  bienes_aceptados: IAprovedGoods[];
  bienes_rechazados: string[];
  aceptados: number;
  rechazados: number;
}

export interface IAprovedGoods {
  goodNumber: string;
  description: string;
  amount: string;
  approved: string;
  keyAct: string;
}
