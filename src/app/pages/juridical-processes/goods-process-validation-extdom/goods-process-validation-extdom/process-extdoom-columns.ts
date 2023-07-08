import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS_GOODS_LIST_EXTDOM = {
  goodId: { title: 'No. Bien' },
  description: { title: 'Descripción' },
  unit: { title: 'Unidad' },
  quantity: { title: 'Cantidad' },
  status: { title: 'Estatus' },
  extDomProcess: { title: 'Proceso' },
  selection: {
    title: '',
    sort: false,
    type: 'custom',
    showAlways: true,
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
};
export const RELATED_FOLIO_COLUMNS = {
  id: {
    title: 'Folio',
    sort: false,
  },
  sheets: {
    title: 'Documentos',
    sort: false,
  },
  descriptionDocument: {
    title: 'Descripción del documento',
    sort: false,
  },
};
