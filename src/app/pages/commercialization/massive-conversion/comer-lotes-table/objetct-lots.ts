export class lote {
  loteId: string;
  process: string;
  lotePublic: string;
  eventId: string;

  constructor(
    loteId: string,
    process: string,
    lotePublic: string,
    eventId: string
  ) {
    this.loteId = loteId;
    this.process = process;
    this.lotePublic = lotePublic;
    this.eventId = eventId;
  }
}
