export interface ComerceDocumentsXmlT {
  name: string;
  post: string;
  signature: string;
  user: string;
  recordNumber: string;
  signatureDate: Date;
  consecNumber: string;
  documentsXMLId: {
    qualification: string;
    documentStatus: string;
    originId: string;
    motcancel: null;
    referenceId: string;
    cancelDate: null;
    documentId: string;
    recordNumber: string;
    xmlFinal: string;
    pathNamePdf: string;
    xmlBase: string;
    creationDate: Date;
    shipmentDate: Date;
    documentsXMLId: string;
  };
  signatoryTypeId: {
    denomination: string;
    orderId: string;
    recordNumber: string;
    signatoryTypeId: string;
  };
}

export interface IComerDocumentsXmlT {
  cargo: string;
  description: string;
  documentsXML: string;
  fec_firma: Date;
  firma: string;
  id_docums_xml: number;
  id_tipo_firmante: number;
  nb_origen: number;
  no_consec: number;
  no_registro: number;
  nombre: string;
  signatoryType: string;
  usuario: string;
}

export interface ComerceDocumentsXmlH {
  documentsXMLId: number;
  originId: number;
  referenceId: string;
  documentId: string;
  qualification: string;
  xmlBase: string;
  xmlFinal: string;
  creationDate: Date;
  documentStatus: number;
  pathNamePdf: string;
  motcancel: string;
  cancelDate: Date;
  shipmentDate: Date;
  recordNumber: number;
}
export interface IComerDocumsXmlT {
  documentTypeId: string;
  documentId: string;
}
