export const USER_COLUMNS = {
  username: {
    title: 'Usuario',
    type: 'string',
    sort: false,
  },

  email: {
    title: 'Correo Electrónico',
    type: 'string',
    sort: false,
  },

  employeetype: {
    title: 'Tipo Usuario',
    type: 'string',
    sort: false,
  },
};

export const USER_COLUMNS_SHOW = {
  user: {
    title: 'Usuario',
    type: 'string',
    sort: false,
  },

  email: {
    title: 'Correo Electrónico',
    type: 'string',
    sort: false,
  },

  userCharge: {
    title: 'Cargo del Usuario',
    type: 'string',
    sort: false,
  },
};

export interface IUser {
  user: string;
  email: string;
  chargeUser: string;
}

export interface IEstate {}
