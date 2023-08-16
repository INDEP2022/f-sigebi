export enum PaymentEndPoints {
  BasePath = `payment`,
  ComerPaymentRef = `comer-payment-ref`,
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
  BusquedaPagosDet = 'search-payments-det',
  BusquedaPagosMae = 'search-payments-mae',
}
