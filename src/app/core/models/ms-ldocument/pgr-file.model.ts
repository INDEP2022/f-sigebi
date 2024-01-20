export interface IPgrFile {
  id: string;
  pgrJob: string;
  pgrDescriptionImage: string;
  pgrProKey: any;
  flag: string;
  flagImgdes: any;
  saeInserDate: string;
  pgrImages: string;
}

export interface IPupRepBillMore {
  pTypeA: number;
  pSubType: number;
  type: number;
  eventId: number;
  lotId: number;
  billId: number;
  statusFactId: string;
  impressionDate: Date | null;
  typeVoucher: string;
  series: string;
  invoice: number;
  tpEvent: number;
  delegationNumber: number;
}

export interface IPupRepBillMoreI {
  pTypeA: number;
  pSubType: number;
  type: number;
  eventId: number;
  lotId: number;
  billId: number;
  statusFactId: string;
  impressionDate: Date | null;
  typeVoucher: string;
  series: string;
  invoice: number;
  tpEvent: number;
}
