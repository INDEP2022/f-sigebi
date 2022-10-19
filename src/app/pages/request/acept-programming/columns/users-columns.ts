export const USER_COLUMNS = {
    user: {
        title: 'Usuario',
        type: 'string',
        sort: false
    },

    email: {
        title: 'Correo electronico',
        type: 'string',
        sort: false
    },

    chargeUser: {
        title: 'Cargo del usuario',
        type: 'string',
        sort: false
    }
}

export interface IUser {
    user: string;
    email: string;
    chargeUser: string;
}

export interface IEstate {
    
}