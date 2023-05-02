export const CUSTOMERS_COLUMNS = {
  id: {
    title: 'Clave Clientes',
    sort: false,
  },
  reasonName: {
    title: 'Nombre Razón',
    sort: false,
  },
  rfc: {
    title: 'RFC',
    sort: false,
  },

  street: {
    title: 'Calle',
    sort: false,
  },
  city: {
    title: 'Ciudad',
    sort: false,
  },
  colony: {
    title: 'Colonia',
    sort: false,
  },
  delegation: {
    title: 'Delegación',
    sort: false,
  },
  zipCode: {
    title: 'Código Postal',
    sort: false,
  },
  country: {
    title: 'País',
    sort: false,
  },
  fax: {
    title: 'Fax',
    sort: false,
  },
  sellerId: {
    title: 'Clave vendedor',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value ? value.id : value;
    },
  },
  phone: {
    title: 'Teléfono',
    sort: false,
  },
  mailWeb: {
    title: 'E-mail',
    sort: false,
  },
  state: {
    title: 'Estado',
    sort: false,
  },
  curp: {
    title: 'CURP',
    sort: false,
  },
  blackList: {
    title: 'Lista negra',
    sort: false,
  },
  paternalSurname: {
    title: 'Apellido Paterno',
    sort: false,
  },
  maternalSurname: {
    title: 'Apellido Materno',
    sort: false,
  },
  municipalityId: {
    title: 'Clave municipal',
    sort: false,
  },
  stateId: {
    title: 'Clave estatal',
    sort: false,
  },
  blackListDate: {
    title: 'Fecha de lista negra',
    sort: false,
  },
  releaseDate: {
    title: 'Fecha de liberación',
    sort: false,
  },
  penaltyId: {
    title: 'Clave de penalización',
    sort: false,
  },
  personType: {
    title: 'Tipo de persona',
    sort: false,
  },
  approvedRfc: {
    title: 'RFC aprobado',
    sort: false,
  },
  userFree: {
    title: 'Usuario liberado',
    sort: false,
  },
  freeDate: {
    title: 'Fecha libera',
    sort: false,
  },
  registryNumber: {
    title: 'No. Registro',
    sort: false,
  },
  economicAgreementKey: {
    title: 'Clave de actividad económica',
    sort: false,
  },
  identificationType: {
    title: 'Tipo de identificación',
    sort: false,
  },
  identificationNumber: {
    title: 'No. Identificación',
    sort: false,
  },
  agentId: {
    title: 'Clave de representante',
    sort: false,
  },
  outsideNumber: {
    title: 'No. Exterior',
    sort: false,
  },
  insideNumber: {
    title: 'No. Interior',
    sort: false,
  },
  password: {
    title: 'Contraseña',
    sort: false,
  },
  user: {
    title: 'Usuario',
    sort: false,
  },
  interbankKey: {
    title: 'CLABE',
    sort: false,
  },
  bank: {
    title: 'Banco',
    sort: false,
  },
  branch: {
    title: 'Sucursal',
    sort: false,
  },
  checksAccount: {
    title: 'Cuenta de cheques',
    sort: false,
  },
  penaltyInitDate: {
    title: 'Fecha inicial de penalización',
    sort: false,
  },
  penalizeUser: {
    title: 'Usuario penalizado',
    sort: false,
  },
};
