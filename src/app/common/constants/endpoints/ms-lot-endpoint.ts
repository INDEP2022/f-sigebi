export enum LotEndpoints {
  BasePath = 'lot',
  ComerLot = 'eat-lots',
  pubFmtoPackage = 'apps/fmto-paquete',
  pubCancelPackage = 'apps/package-cancel',
  Event = 'apps/get-global-event-id',
  EventGlobalGood = 'apps/get-global-good-number',
  GoodByLotsEvent = 'eat-lots/getGoods',
  FindAllRegistersTot = 'eat-lots/findAllRegistersTot',

  CargaPagosRefGens = 'apps/carga-pagos-ref-gens', // CARGA_PAGOSREFGENS
  CargaComerDetalles = 'apps/carga-comer-detalles', // CARGA_COMER_DETALLES
  ValidaMandato = 'apps/validaMandato', //VALIDA_MANDATO
  PupEntra = 'apps/pup-entra', // PUP_ENTRA
  ValidateStatus = 'apps/valida-estatus',
  ValidaListaNegra = 'apps/valida-lista-negra',
  GetBankReference = 'apps/get-bank-reference',
}
