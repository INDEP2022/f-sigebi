export const CUSTOMERS_COLUMNS = {
  id: {
    title: 'Clave Cliente',
    sort: false,
  },
  reasonName: {
    title: 'Nombre o Razón Social',
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
    title: 'Clave Vendedor',
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
    title: 'Lista Negra',
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
    title: 'Clave Municipal',
    sort: false,
  },
  stateId: {
    title: 'Clave Estatal',
    sort: false,
  },
  blackListDate: {
    title: 'Fecha de Lista Negra',
    sort: false,
  },
  releaseDate: {
    title: 'Fecha de Liberación',
    sort: false,
  },
  penaltyId: {
    title: 'Clave de Penalización',
    sort: false,
  },
  personType: {
    title: 'Tipo de Persona',
    sort: false,
  },
  approvedRfc: {
    title: 'RFC Aprobado',
    sort: false,
  },
  userFree: {
    title: 'Usuario Liberado',
    sort: false,
  },
  freeDate: {
    title: 'Fecha Libera',
    sort: false,
  },
  registryNumber: {
    title: 'No. Registro',
    sort: false,
  },
  economicAgreementKey: {
    title: 'Clave de Actividad Económica',
    sort: false,
  },
  identificationType: {
    title: 'Tipo de Identificación',
    sort: false,
  },
  identificationNumber: {
    title: 'No. Identificación',
    sort: false,
  },
  agentId: {
    title: 'Clave de Representante',
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
    title: 'Cuenta de Cheques',
    sort: false,
  },
  penaltyInitDate: {
    title: 'Fecha Inicial de Penalización',
    sort: false,
  },
  penalizeUser: {
    title: 'Usuario Penalizado',
    sort: false,
  },
};
