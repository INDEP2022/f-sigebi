import { format } from 'date-fns';

export const LOG_TABLE_COLUMNS = {
  modifictiondate: {
    title: 'Fecha de Registro',
    sort: false,
    valuePrepareFunction: (_date: string) =>
      _date ? format(new Date(_date), 'dd/MM/yyyy') : '',
  },
  usr_modif: {
    title: 'Usuario',
    sort: false,
  },
  username: {
    title: 'Nombre Usuario',
    sort: false,
  },
  cad_modif1: {
    title: 'Modificación',
    sort: false,
  },
  modif3: {
    title: 'Observaciones',
    sort: false,
    valuePrepareFunction: (user: string, row: any) => {
      if (!row.bitacora_id) {
        return '';
      }
      return `USUARIO SOLICITÓ: ${row.usuario_req}
      DESCRIPCIÓN: ${row.observ}`;
    },
  },
  // table: {
  //   title: 'Tabla',
  //   sort: false,
  // },
};
