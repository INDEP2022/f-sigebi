// export interface IHistoryOfficial {
//   flyerNumber: number;
//   reassignmentDate: string | Date;
//   officialNumber: number;
//   personPrevious: string;
//   areaDestinationPrevious: number;
//   personNew: string;
//   areaDestinationNew?: number;
//   argument: string;
//   registryNumber?: number;
//   externalOfficialKey?: string;
//   destinationPreviousNumber?: number;
//   subDestinationPreviousNumber?: number;
//   destinationNewNumber?: number;
//   subDestinationNewNumber?: number;
// }
export interface IHistoryOfficial {
  numberSteeringwheel: number;
  datereassignment: string | Date;
  numberJob: number;
  personbefore: string;
  areaDestinationbefore: number;
  personnew: string;
  areaDestinationnew?: number;
  argument: string;
  numberRecord?: number;
  cveJobExternal: string;
  numberOftheDestinationbefore: number;
  numberSubdelDestinationbefore: number;
  numberOftheDestinationnew: number;
  numberSubdelDestinationnew: number;
  nbOrigin: string;
}
