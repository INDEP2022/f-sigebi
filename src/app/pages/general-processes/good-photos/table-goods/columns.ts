import { CheckboxDisabledElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-disabled-element';

export const COLUMNS = {
  select: {
    title: '',
    sort: false,
    filter: false,
    type: 'custom',
    renderComponent: CheckboxDisabledElementComponent,
  },
  id: {
    title: 'No. Bien',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  descriptionDelegation: {
    title: 'Delegación',
    sort: false,
  },
  descriptionSubdelegation: {
    title: 'Sub Delegación',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
};
