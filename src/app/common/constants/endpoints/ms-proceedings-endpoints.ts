export enum ProceedingsEndpoints {
  BasePath = 'proceeding',
  Proceedings = 'proceedings',
  ProeedingsDevolution = 'proceedings-devolution',
  //ProceedingsDeliveryReception = 'proceedings-delivery-reception',
  DetailProceedingsDevollution = 'detail-proceedings-devolution',
  DetailProceedingsDeliveryReception = 'detail-proceedings-delivery-reception',
  ProceedingsValidations = 'proceedings-validations',
  ProceedingsDeliveryReception = 'proceedings-delivery-reception',
  ProceedingDeliveryReceptionTranfer = 'proceedings-delivery-reception/get-transferent-number-key-and-name',
  PADelActaEntrega = 'aplication/pa-of-act-delivery',
  MaximunClosingTime = 'maximun-closing-time',
  UpdateVaultByProceedingNumber = 'updateSafe',
  UpdateVaultByKeyProceeding = 'updateSafeByAct',
  UpdateWarehouseByProceedingNumber = 'updateWarehouse',
  UpdateWarehouseByKeyProceeding = 'updateWarehouseByAct',
  DeleteProceedinGood = 'aplication/pbDelete',
  blkBienPost = 'aplication/blkBiePosquery',
  blkConversions = 'aplication/blkConversions',
  UpdateActasEntregaRecepcion = 'aplication/update-actasEntregaRecepcion',
  UpdateActasRDelegation = 'aplication/minutesNumberXdelegation2',
  GoStatus = 'aplication/get-count-good',
  ExistProceedings = 'aplication/getExistsproceedings',
  GetUnion = 'aplication/getUnionTables',
  GetFactDbConvBien = 'aplication/getFactDbConvBien',
}
