export interface IGoodPhoto {
  goodNumber: number;
  consesNumber: number;
  recordNumber: number;
  location: string;
  publicImgcatWeb: number;
  existsfs: number;
  existsproduction: number;
}
export interface GoodPhotoFav {
  eventId: string | number;
  batchId: string | number;
  goodNumber: string | number;
  consecNumber?: string | number;
}
