import { DatePipe } from '@angular/common';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const ACT_DESTRUCTION_COLUMNS = {
  numRegister: {
    title: 'No.',
    sort: false,
  },
  numFile: {
    title: 'Expediente',
    sort: false,
  },
  keysProceedings: {
    title: 'Acta',
    sort: false,
  },
  id: {
    title: 'No. Acta',
    sort: false,
  },
  elaborationDate: {
    title: 'Fecha',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy', 'UTC');
      return formatted;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  statusProceedings: {
    title: 'Estatus',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'CERRADA')
        return '<strong><span class="badge badge-pill badge-soft-info">CERRADA</span></strong>';
      if (value == 'ABIERTA')
        return '<strong><span class="badge badge-pill badge-soft-info">ABIERTA</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'CERRADA', title: 'CERRADA' },
          { value: 'ABIERTA', title: 'ABIERTA' },
        ],
      },
    },
  },
};

export const ACT_DESTRUCTION_DETAIL_COLUMNS = {
  good: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
  },
  receive: {
    title: 'Recibido',
    type: 'html',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == '1')
        return '<strong><span class="badge badge-pill badge-soft-info">SI</span></strong>';
      if (value == '0')
        return '<strong><span class="badge badge-pill badge-soft-info">NO</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: '1', title: 'SI' },
          { value: '0', title: 'NO' },
        ],
      },
    },
  },
};
