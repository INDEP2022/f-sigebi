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
  id_zona_geografica?: number;
  descripcion: string;
  no_contrato: number;
  usuario_creacion?: string;
  fecha_creacion?: Date;
  usuario_modificacion?: string;
  fecha_modificacion?: Date;
  version: number;
  tercero_especializado: string;
  iva?: number;
  estatus?: number;
}
