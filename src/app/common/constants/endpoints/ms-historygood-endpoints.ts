export enum HistoryGoodEndpoints {
  HistoryGood = `historygood`,
  HistoryStatusGood = `historical-status-good`,
  SentSirsae = 'application/sentSirsae',
  HistoryStatusGoodFindById = `historical-status-good/find-by-ids`,
  ReturnStatusProcess = 'application/pup-return-status',
  GetPrexdoAnterior = 'application/pre-x-do-previous',
  GetChangeDate = 'application/get-change-date-historical',
  GetEstPreviousHistory = 'application/get-est-previous-historical',
  GetEstPreviousHistory2 = 'application/get-est-previous-historical-2',
  ValidateDatesToUpdateStatus = 'application/delete-office',
  GetProcessExtDom = 'historical/getProcessExtDom',
  UpdateGoodStatusWhenDelete = 'application/loop-delete-office',
}
