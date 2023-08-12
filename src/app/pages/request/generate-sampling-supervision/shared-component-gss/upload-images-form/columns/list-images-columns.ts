import { VerImagenInputComponent } from '../../ver-imagen-input/ver-imagen-input.component';

export const LIST_IMAGES_COLUMNS = {
  dDocName: {
    title: 'No. Fotografia',
    type: 'string',
    sort: false,
  },
  xidBien: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  xTipoDoc: {
    title: 'Tipo Documento',
    type: 'string',
    sort: false,
  },
  ddocTitle: {
    title: 'Título Documento',
    type: 'string',
    sort: false,
  },
  dDocAuthor: {
    title: 'Autor',
    type: 'string',
    sort: false,
  },
  dInDate: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
  },
  xnoProgramacion: {
    title: 'No. Programación',
    type: 'string',
    sort: false,
  },
  xfolioProgramacion: {
    title: 'Folio Programación',
    type: 'string',
    sort: false,
  },
  button: {
    title: '',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: VerImagenInputComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
};
