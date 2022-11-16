import { SelectEventTypeComponent } from 'src/app/shared/render-components/select-event-type/select-event-type.component';

const options : any[]=[
  { value: 'Muebles', title: 'Muebles' },
  { value: 'Inmuebles', title: 'Inmuebles' },
  { value: 'Remesas', title: 'Remesas' },
  { value: 'Disponibles', title: 'Disponibles' },
  { value: 'Validar SIRSAE', title: 'Validar SIRSAE' }
];

export const COLUMNS = {
  status: {
    title: 'Estatus',
    sort: false,
    filter: false
  },
  descripcion: {
    title: 'Descripción',
    sort: false,
    filter: false
  },
  area: {
    title: 'Área',
    sort: false,
    filter: false,
    defaultValue: 'Muebles',
    editor: {
      type: 'list',
      config: {
        list: options
      }
    }
  },
  eventType: {
    title: 'Tipo de Evento',
    sort: false,
    filter: false,
    editor: {
      type: 'custom',
      component: SelectEventTypeComponent,
    },
  },
};
