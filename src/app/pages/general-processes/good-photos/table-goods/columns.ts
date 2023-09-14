import { CheckBoxComponent } from './check-box/check-box.component';

export const COLUMNS = {
  select: {
    title: 'Carga/Exportación',
    sort: false,
    filter: false,
    type: 'custom',
    renderComponent: CheckBoxComponent,
    valuePrepareFunction: (value: any, row: any) => {
      // DATA FROM HERE GOES TO renderComponent
      // console.log(value);
      return {
        checked: row.select,
        disabled: false,
        id: row.id,
      };
    },
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
