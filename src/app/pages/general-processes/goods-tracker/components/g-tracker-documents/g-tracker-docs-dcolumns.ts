import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const GTTRACKER_DOCUMENTS_COLUMNS = {
  folio_universal: {
    title: 'Folio',
    sort: false,
  },
  hojas: {
    title: 'Documentos',
    sort: false,
  },
  descripcion_documento: {
    title: 'Descripción del documento',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      return value ?? '';
    },
  },
};
