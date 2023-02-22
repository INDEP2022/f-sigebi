//Components
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  event: {
    title: 'Id Evento',
    sort: false,
  },
  eventKey: {
    title: 'Clave',
    sort: false,
  },
  eventType: {
    title: 'Tipo',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  phase: {
    title: 'Fase',
    sort: false,
  },
  year: {
    title: 'Año',
    sort: false,
  },
  warrantyDate: {
    title: 'Fecha Garantía',
    sort: false,
  },
  isPublished: {
    title: 'Publicar',
    sort: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction: (instance: any) => {},
  },
};
