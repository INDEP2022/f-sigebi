import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const GTTRACKER_DOCUMENTS_COLUMNS = {
  folio_universal: {
    title: 'Folio',
    sort: false,
    columnFilter: 'id',
  },
  hojas: {
    title: 'Documentos',
    sort: false,
    columnFilter: 'sheets',
  },
  descripcion_documento: {
    title: 'Descripción del documento',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      return value ?? '';
    },
    operator: SearchFilter.ILIKE,
    columnFilter: 'descriptionDocument',
  },
};
