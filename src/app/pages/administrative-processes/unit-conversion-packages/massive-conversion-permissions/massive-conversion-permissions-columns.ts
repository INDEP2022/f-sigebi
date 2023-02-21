import { IUserAccessAreas } from 'src/app/core/models/ms-users/users-access-areas-model';

export const PERMISSIONSUSER_COLUMNS = {
  usuario: {
    title: 'Usuario',
    valuePrepareFunction: (value: IUserAccessAreas) => {
      return value.user;
    },
    sort: false,
  },
  name: {
    title: 'Nombre',
    sort: false,
  },
  s: {
    title: 'S',
    sort: false,
  },
  n: {
    title: 'N',
    sort: false,
  },
};
export const PRIVILEGESUSER_COLUMNS = {
  proy: {
    title: 'PROY.',
    width: '5%',
    sort: false,
  },
  val: {
    title: 'VAL.',
    width: '5%',
    sort: false,
  },
  aut: {
    title: 'AUT.',
    width: '5%',
    sort: false,
  },
  cerr: {
    title: 'CERR.',
    width: '5%',
    sort: false,
  },
  can: {
    title: 'CAN.',
    width: '5%',
    sort: false,
  },
};
