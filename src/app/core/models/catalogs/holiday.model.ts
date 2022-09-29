export interface IHoliday {
  id: number | null;
  holidayDate: Date;
  description: string;
  creationUser: string;
  creationDate: Date;
  editionUser: string;
  modificationDate: Date;
  version: number | null;
  status: number | null;
}
