import { DatePipe } from '@angular/common';

export const COLUMNS = {
  usuariotpvto: {
    title: 'Usuario',
    sort: false,
  },
  nombre: {
    title: 'Nombre',
    sort: false,
  },
  fecha_registro: {
    title: 'Fecha',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
  },
};
