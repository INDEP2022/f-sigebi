import { CustomDateDayFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-mounth-custom/custom-date-day-filter';

export const CUSTOMERS_COLUMNS = {
  id: {
    title: 'Cve. Cliente',
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
    title: 'Cve. Vendedor',
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
    title: 'Cve. Municipal',
    sort: false,
  },
  stateId: {
    title: 'Cve. Estatal',
    sort: false,
  },
  blackListDate: {
    title: 'Fecha de Lista Negra',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
  releaseDate: {
    title: 'Fecha de Liberación',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
  penaltyId: {
    title: 'Cve. de Penalización',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value ? value.penaltyId : value;
    },
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
    valuePrepareFunction: (value: any) => {
      return value ? value.name : value;
    },
  },
  freeDate: {
    title: 'Fecha Liberado',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
  registryNumber: {
    title: 'No. Registro',
    sort: false,
  },
  economicAgreementKey: {
    title: 'Cve. de Actividad Económica',
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
    title: 'Cve. de Representante',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value ? value.id : value;
    },
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
    title: 'CLABE Interbancaria',
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
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
  penalizeUser: {
    title: 'Usuario Penalizado',
    sort: false,
  },
};
