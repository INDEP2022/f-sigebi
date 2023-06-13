import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const DOCUMENTS_COLUMNS = {
  cveDocument: {
    title: 'Documento',
    type: 'string',
    sort: false,
  },
  descripcion: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
  },
  selection: {
    title: 'Selección',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
    hide: false,
  },
};
