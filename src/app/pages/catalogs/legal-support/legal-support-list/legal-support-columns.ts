import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const LEGAL_SUPPORT_COLUMS = {
  doctoTypeId: {
    title: 'Identificador',
    type: 'number',
    width: '15%',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.id : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.id;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  support: {
    title: 'Sustento',
    width: '70%',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
  },
};
