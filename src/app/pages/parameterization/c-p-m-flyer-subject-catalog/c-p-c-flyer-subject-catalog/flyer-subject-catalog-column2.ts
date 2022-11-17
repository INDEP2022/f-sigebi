import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

const options: any[] = [
  { value: 'Administrativo', title: 'Administrativo' },
  { value: 'Procesal', title: 'Procesal' },
  { value: 'Transferente', title: 'Transferente' },
  { value: 'AdminTransferente', title: 'AdminTransferente' },
];

export const FLYER_SUBJECT_CAT_COLUMNS2 = {
  typeFyer: {
    title: 'Tipo de volante',
    sort: false,
    filter: false,
    defaultValue: 'Administrativo',
    editor: {
      type: 'list',
      config: {
        list: options,
      },
    },
  },
  relationGoods: {
    title: 'Relación con bien',
    sort: false,
    filter: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
  userPermission: {
    title: 'Permiso Usuario',
    sort: false,
    filter: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
};
