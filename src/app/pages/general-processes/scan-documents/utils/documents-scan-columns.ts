import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const DOCUMENTS_SCAN_COLUMNS = {
  id: {
    title: 'Folio',
    sort: false,
  },
  sheets: {
    title: 'Documentos',
    sort: false,
  },
  descriptionDocument: {
    title: 'Descripción',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => value ?? '',
    onComponentInitFunction: (instance: SeeMoreComponent) =>
      (instance.maxLenght = 6),
  },
};
