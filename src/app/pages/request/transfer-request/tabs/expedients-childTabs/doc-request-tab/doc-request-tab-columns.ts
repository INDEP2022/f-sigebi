import { BtnRequestComponent } from "../btn-request/btn-request.component";

export const DOC_REQUEST_TAB_COLUMNS = {
  noDoc: {
    title: 'No. Documento',
    type: 'string',
    sort: false,
  },
  noReq: {
    title: 'No. Solicitud',
    type: 'string',
    sort: false,
  },
  docTit: {
    title: 'Titulo del Documento',
    type: 'string',
    sort: false,
  },
  docType: {
    title: 'Tipo de Documento',
    type: 'string',
    sort: false,
  },
  author: {
    title: 'Autor',
    type: 'string',
    sort: false,
  },
  dateCrea: {
    title: 'Fecha Creada',
    type: 'string',
    sort: false,
  },
  button: {
    title: 'PDF',
    type: 'custom',
    filter: false,
    renderComponent: BtnRequestComponent,
    onComponentInitFunction(instance?:any) {},
    sort: false
  }
}
