export interface IHistoryOfficial {
  flyerNumber: number;
  reassignmentDate: string | Date;
  officialNumber: number;
  personPrevious: string;
  areaDestinationPrevious: number;
  personNew: string;
  areaDestinationNew?: number;
  argument: string;
  registryNumber?: number;
  externalOfficialKey?: string;
  destinationPreviousNumber?: number;
  subDestinationPreviousNumber?: number;
  destinationNewNumber?: number;
  subDestinationNewNumber?: number;
}
