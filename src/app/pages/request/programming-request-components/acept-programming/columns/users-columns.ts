export const USER_COLUMNS = {
  user: {
    title: 'Usuario',
    type: 'string',
    sort: false,
  },

  email: {
    title: 'Correo electrónico',
    type: 'string',
    sort: false,
  },

  userCharge: {
    title: 'Tipo usuario',
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
    title: 'Correo electrónico',
    type: 'string',
    sort: false,
  },

  userCharge: {
    title: 'Cargo del usuario',
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
