export interface Iformalizeprogramming {
  id?: number;
  actId: number;

  idPrograming: number;
  idStation: number;
  idAuthority: number;
  statusProceeedings?: number;
  dateProceeedings: Date;
  noOfficie: number;
  dateOfficie: Date;
  city: string;
  home: string;
  evet: string;
  otherFacts: string;
  nameWorker1: string;
  positionWorker1: string;
  residentialWorker1: string;
  idCatWorker1: string;
  idNoWorker1: number;
  idExpWorker1: string;
  nameWorker2: string;
  positionWorker2: string;
  idCatWorker2: string;
  idNoWorker2: number;
  idExpWorker2: string;
  nameWorker3: string;
  nameWorkerOic: string;
  positionWorkerOic: string;
  idCatWorkerOic: string;
  idNoWorkerOic: number;
  idExpWorkerOic: string;
  nameWorker4: string;
  positionWorker4: string;
  nameWorkerUvfv: string;
  positionWorkerUvfv: string;
  nameWitness1: string;
  idCatWitness1: string;
  idNoWitness1: number;
  nameWitness2: string;
  idCatWitness2: string;
  idNoWitness2: number;
  bases: string;
  celebrates: string;
  closingDateProceeding: Date;
  cveState: string;
  electronicSignatureWorker1: 'Firma electrónica funcionario 1 de la acta';
  electronicSignatureWorker2: 'Firma electrónica funcionario 2 de la acta';
  electronicSignatureWitness1: 'Firma electrónica testigo 1 de la acta';
  electronicSignatureWitness2: 'Firma electrónica testigo 2 de la acta';
  electronicSignatureOic: 'Firma electrónica oic de la acta';
  electronicSignatureUvfv: 'Firma electrónica uvfv de la acta';
  observationProceedings: string;
  folioProceedings: number;
  emailWorker1: string;
  emailWorker2: string;
  emailWitness1: string;
  emailWitness2: string;
  emailOic: string;
  emailUvfv: string;
  id_content: number;
  startTime: string;
  closingDate: Date;
  reg_envio_sat: string;
  instance_bpel: string;
  creationUser: string;
  creationDate: Date;
  editionUser: string;
  modificationDate: Date;
  version: number;
}
