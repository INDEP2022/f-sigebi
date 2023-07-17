export const USER_COLUMNS = {
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
