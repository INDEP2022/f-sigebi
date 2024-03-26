export class cliente {
  eventId: string;
  process: string;
  rfc: string;
  clientId: string;

  constructor(eventId: string, process: string, rfc: string, clientId: string) {
    this.eventId = eventId;
    this.process = process;
    this.rfc = rfc;
    this.clientId = clientId;
  }
}
