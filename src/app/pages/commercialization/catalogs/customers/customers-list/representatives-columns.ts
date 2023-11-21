import { CustomDateDayFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-mounth-custom/custom-date-day-filter';

export const REPRESENTATIVES_COLUMNS = {
  id: {
    title: 'Cve. Representante',
    sort: false,
  },
  reasonName: {
    title: 'Nombre o Razón Social',
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
  dateBorn: {
    title: 'Fecha de Nacimiento',
    sort: false,
    valuePrepareFunction: (date: string) => {
      const dateObj = new Date(date);
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateDayFilterComponent,
    },
  },
  rfc: {
    title: 'RFC',
    sort: false,
  },
  curp: {
    title: 'CURP',
    sort: false,
  },
  personType: {
    title: 'Tipo de Persona',
    sort: false,
  },
  identificationType: {
    title: 'Tipo de Identificación',
    sort: false,
  },
  autEmiIndentify: {
    title: 'Autorizador de Emisión de Identificación',
    sort: false,
  },
  identificationNumber: {
    title: 'No. de Identificación',
    sort: false,
  },
  escrowNumber: {
    title: 'No de Fideicomiso',
    sort: false,
  },
  nationalityKey: {
    title: 'Cve. de Nacionalidad',
    sort: false,
  },
  countryOriginKey: {
    title: 'Cve. de País de Nacimiento',
    sort: false,
  },
  street: {
    title: 'Calle',
    sort: false,
  },
  outsideNumber: {
    title: 'No. Exterior',
    sort: false,
  },
  insisdeNumber: {
    title: 'No. Interior',
    sort: false,
  },
  city: {
    title: 'Ciudad',
    sort: false,
  },
  suburb: {
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
  state: {
    title: 'Estado',
    sort: false,
  },
  homeCountryKey: {
    title: 'Cve. de País Domicilio',
    sort: false,
  },
  fax: {
    title: 'Fax',
    sort: false,
  },
  countryPhoneKey: {
    title: 'Cve. de Teléfono del País',
    sort: false,
  },
  phone: {
    title: 'Teléfono',
    sort: false,
  },
  mailWeb: {
    title: 'Correo Electrónico',
    sort: false,
  },
  ecoActivityKey: {
    title: 'Cve. de Actividad Económica',
    sort: false,
  },
  repAssociatedId: {
    title: 'Cve. Representante Asociado',
    sort: false,
  },
  registerNumber: {
    title: 'No. Registro',
    sort: false,
  },
};
