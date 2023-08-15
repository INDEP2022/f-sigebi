export enum EventEndpoints {
  BasePath = 'event',
  BasePathTwo = 'prepareevent',
  ComerE = 'comer-event',
  ComerEventAll = 'comer-event/getEatEvents',
  ComerEvents = `comer-events-rel`, // comer_eventos
  ComerTEvents = 'comer-event-tprocess', // comer_tpeventos
  ComerStatusVta = 'comer-statusvta', // comer_satusvta
  ComerUsuaTxEvent = 'comer-usuatxevent',
  ComerLotEvent = 'comer-datamart-remevents',
  ComerTevents = 'comer-tevents',
  FilterEvent = '?search=&filter.eventDad',
  FilterGood = '?search=&filter.goodNumber',
  FilterLot = '?search=&filter.lo',
  EventXSerie = 'comer-tpeventxserie',
  Application = 'application',
  AppGetfComer = 'application/get-f-comer',
  Resumen = 'application/resumen',
  DetResumen = 'application/det-resumen',
  DetRemesa = 'application/det-consignment',
  MANDXEVENTO = 'application/valid-mand-x-event',
}
