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
