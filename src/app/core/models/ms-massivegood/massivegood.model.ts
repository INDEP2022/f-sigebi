export interface IMassiveGood {
  id: string;
  goodNumber: number;
  fileNumber: number | null;
  flyerNumber: number | null;
  user: string | null;
  massiveChargeDate: Date | null;
  daydayEviction: number | null;
}
