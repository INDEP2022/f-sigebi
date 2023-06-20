import { DatePipe } from '@angular/common';

export const EMAIL_COLUMNS = {
  // cveScreen: {
  //   title: 'cve Pantalla',
  //   sort: false,
  // },

  id: {
    title: 'Usuario',
    sort: false,
  },
  name: {
    title: 'Nombre',
    sort: false,
  },
  rfc: {
    title: 'RFC',
    sort: false,
  },
  usuario: {
    title: 'Delegación',
    sort: false,
    valuePrepareFunction: (value: any) => {
      console.log(value);
      if (value === null) {
        return (value = '');
      } else {
        return value.delegationNumber;
      }
    },
  },
  email: {
    title: 'Email',
    sort: false,
  },
  registryNumber: {
    title: 'No. registro',
    sort: false,
  },
  curp: {
    title: 'Cv. Reg. Poblacion',
    sort: false,
  },
  street: {
    title: 'Calle',
    sort: false,
  },
  suburb: {
    title: 'Colonia',
    sort: false,
  },
  zipCode: {
    title: 'Código postal',
    sort: false,
  },
  phone: {
    title: 'Teléfono',
    sort: false,
  },
  profession: {
    title: 'Profesión',
    sort: false,
  },
  positionKey: {
    title: 'Cv. Cargo',
    sort: false,
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
  daysValidityPass: {
    title: 'Vig. Pass.',
    sort: false,
  },
  /*passLastChangeDate:{
    title: 'Cv. Cargo',
    sort: false,
  },*/
  passUpdate: {
    title: 'Actualización pass.',
    sort: false,
  },
  userSirsae: {
    title: 'Usr. SIRSAE.',
    sort: false,
  },
  sendEmail: {
    title: 'Env. Correo',
    sort: false,
  },
  attribAsign: {
    title: 'Asig. Atributos',
    sort: false,
  },
  clkdetSirsae: {
    title: 'Clrdet SIRSAE',
    sort: false,
  },
  exchangeAlias: {
    title: 'Usr. Intercambio',
    sort: false,
  },
  clkdet: {
    title: 'Clkdet',
    sort: false,
  },
  clkid: {
    title: 'Clkid',
    sort: false,
  },
  profileMimKey: {
    title: 'Cv. Perfil',
    sort: false,
  },
  nameAd: {
    title: 'Agr. Nombre',
    sort: false,
  },
  posPrevKey: {
    title: 'Cv. Cargo Ant.',
    sort: false,
  },
  // typeD: {
  //   title: 'Tipo de destino',
  //   sort: false,
  // },
};
