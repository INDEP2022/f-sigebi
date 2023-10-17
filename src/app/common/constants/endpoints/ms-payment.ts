export enum PaymentEndPoints {
  BasePath = `payment`,
  ComerPaymentRef = `comer-payment-ref`,
  ComerPaymentRef2 = `comer-payment-ref?filter.SystemValid=$not:$in:R,D,B`,
  CreateHeader = 'application/createHeader',
  CreateHeaderFcomer113 = 'application/createHeaderFcomer113',
  SendReadSirsaeFcomer113 = 'application/sendReadSirsaeFcomer113',
  SendSirsaeFcomer112 = 'application/sendSirsaeFcomer112',
  GetAllV2 = 'comer-payment-ref/getAllV2',
  getAllV2Total = 'comer-payment-ref/getAllV2Total',
  getFcomerC1 = 'comer-payment-ref/get-fcomer-c1',
  getFcomerC2 = 'comer-payment-ref/get-fcomer-c2',
  getFcomerC3 = 'comer-payment-ref/get-fcomer-c3',
  getFcomerC4 = 'comer-payment-ref/get-fcomer-c4',
  desagregarPagos = 'payment/pup-applied',
  BusquedaPagosDet = 'search-payments-det',
  BusquedaPagosMae = 'search-payments-mae',
  getOI = 'application/obtener-oi',
  UpdatePayments = 'payment/update-payments',
  Delete = 'search-payments-det/delete-search-payments',
  validSystem = 'comer-valid-system',
  postIndentifiesPayments = 'payment/identifies-payments-inconsistency',
  ComerCtldevpagB = `comer-ctldevpag-b`,
  ComerCtldevpagBfindAllRegistersV2 = `comer-ctldevpag-b/findAllRegistersV2`,
  PaymentsxConfirm = 'views/v-comer-paymentsxconfirm',
  GetDataFromView = 'application/getDataFromView',
  InsComerpagrefweb = 'application/ins-comerpagrefweb',
  ApplicationExpRefSol = 'application/exp-ref-sol',
}
