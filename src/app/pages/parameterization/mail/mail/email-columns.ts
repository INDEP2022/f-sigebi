import { DatePipe } from '@angular/common';

export const EMAIL_COLUMNS = {
  // cveScreen: {
  //   title: 'cve Pantalla',
  //   sort: false,
  // },

  id: {
    title: 'Usuario',
    sort: false,
    type: 'string',
  },
  name: {
    title: 'Nombre',
    sort: false,
    type: 'string',
  },
  rfc: {
    title: 'RFC',
    sort: false,
    type: 'string',
  },
  userDetail: {
    title: 'Delegación',
    sort: false,
    type: 'string',
    valuePrepareFunction: (value: any) => {
      console.log(value);
      if (value === null) {
        return (value = '');
      } else {
        return value.delegationNumber;
      }
    },

    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.delegationNumber;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  email: {
    title: 'Email',
    sort: false,
    type: 'string',
  },
  registryNumber: {
    title: 'No. registro',
    sort: false,
    type: 'number',
  },
  curp: {
    title: 'Cv. Reg. Poblacion',
    sort: false,
    type: 'string',
  },
  street: {
    title: 'Calle',
    sort: false,
    type: 'string',
  },
  suburb: {
    title: 'Colonia',
    sort: false,
    type: 'string',
  },
  zipCode: {
    title: 'Código postal',
    sort: false,
    type: 'number',
  },
  phone: {
    title: 'Teléfono',
    sort: false,
    type: 'string',
  },
  profession: {
    title: 'Profesión',
    sort: false,
    type: 'string',
  },
  positionKey: {
    title: 'Cv. Cargo',
    sort: false,
    type: 'string',
  },
  firstTimeLoginDate: {
    title: 'Fecha inicio',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
      return formatted;
    },
  },
  /*daysValidityPass: {
    title: 'Vig. Pass.',
    sort: false,
  },
  passLastChangeDate:{
    title: 'Cv. Cargo',
    sort: false,
  },
  passUpdate: {
    title: 'Actualización pass.',
    sort: false,
  },*/
  userSirsae: {
    title: 'Usr. SIRSAE.',
    sort: false,
    type: 'string',
  },
  sendEmail: {
    title: 'Env. Correo',
    sort: false,
    type: 'number',
  },
  attribAsign: {
    title: 'Asig. Atributos',
    sort: false,
    type: 'number',
  },
  clkdetSirsae: {
    title: 'Clkdet SIRSAE',
    sort: false,
  },
  exchangeAlias: {
    title: 'Usr. Intercambio',
    sort: false,
    type: 'string',
  },
  clkdet: {
    title: 'Clkdet',
    sort: false,
    type: 'number',
  },
  clkid: {
    title: 'Clkid',
    sort: false,
    type: 'string',
  },
  profileMimKey: {
    title: 'Cv. Perfil',
    sort: false,
    type: 'string',
  },
  nameAd: {
    title: 'Agr. Nombre',
    sort: false,
    type: 'string',
  },
  posPrevKey: {
    title: 'Cv. Cargo Ant.',
    sort: false,
    type: 'string',
  },
  // typeD: {
  //   title: 'Tipo de destino',
  //   sort: false,
  // },
};
