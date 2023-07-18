export enum TransfergoodEndpoint {
  BasePath = 'transfergood',
  getNoBien = 'application/get-ftransf-cuen-regdev',
  getFileCSV = 'application/pupPreviewDatosCSV',
  TransNumDetail = 'transf-num-detail',
  EmailMessage = 'transf-num-detail/generate-body-email',
  SendEmail = 'transf-num-detail/send-email',
  SendEmailCheque = 'transf-num-detail/generate-body-email-cheque',
}
