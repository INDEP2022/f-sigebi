import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const COLUMNS_GOODS_LIST_EXTDOM = {
  goodId: { title: 'No. Bien', sort: false },
  description: {
    title: 'Descripción',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      if (value == 'null' || value == 'undefined') {
        return '';
      }

      return value ? value : '';
    },
  },
  unit: { title: 'Unidad', sort: false },
  quantity: { title: 'Cantidad', sort: false },
  status: { title: 'Estatus', sort: false },
  extDomProcess: { title: 'Proceso', sort: false },
  seleccion: {
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

export const COLUMNS_GOODS_LIST_EXTDOM_2 = {
  goodId: { title: 'No. Bien', sort: false },
  description: {
    title: 'Descripción',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      if (value == 'null' || value == 'undefined') {
        return '';
      }

      return value ? value : '';
    },
  },
  unit: { title: 'Unidad', sort: false },
  quantity: { title: 'Cantidad', sort: false },
  status: { title: 'Estatus', sort: false },
  extDomProcess: { title: 'Proceso', sort: false },
  seleccion: {
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
