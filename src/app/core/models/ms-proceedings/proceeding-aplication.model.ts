export interface PBDelete {
  processingArea: string;
  user: string;
  actaNumber: number;
  goods: { status: string; noBien: number }[];
  // processingArea: string | null;
  // states: string | null;
  // selEli: number;
  // actaNumber: number;
  // user: string | null;
  // contEli:number;
  // aggregate:string
}
