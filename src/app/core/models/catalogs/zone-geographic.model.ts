/*
 * Nueva Version con campos en Ingles segun servicio.
 * Necesario actualizar componentes antes de implementar
 */
// export interface IZoneGeographic {
//   id?: number;
//   description: string;
//   contractNumber: number;
//   userCreation?: string;
//   creationDate?: Date;
//   userModification?: string;
//   modificationDate?: Date;
//   version: number;
//   thirdPartySpecialized: string;
//   vat?: number;
//   status?: number;
// }
export interface IZoneGeographic {
  id?: number;
  description: string;
  contractNumber: number;
  userCreation?: string;
  creationDate?: Date;
  userModification?: string;
  modificationDate?: Date;
  version: number;
  thirdPartySpecialized: string;
  vat?: number;
  status?: number;
}
