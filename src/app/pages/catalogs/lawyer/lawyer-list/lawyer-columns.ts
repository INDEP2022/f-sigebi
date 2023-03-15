import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const LAWYER_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  office: {
    title: 'Despacho',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.name;
    },
  },
  name: {
    title: 'Nombre',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
  },
  street: {
    title: 'Calle',
    type: 'string',
    sort: false,
  },
  streetNumber: {
    title: 'No. Exterior',
    type: 'string',
    sort: false,
  },
  apartmentNumber: {
    title: 'No. Interior',
    type: 'number',
    sort: false,
  },
  suburb: {
    title: 'Colonia',
    type: 'string',
    sort: false,
  },
  delegation: {
    title: 'Delegación',
    type: 'string',
  },
  zipCode: {
    title: 'Código postal',
    type: 'number',
    sort: false,
  },
  rfc: {
    title: 'RFC',
    type: 'string',
    sort: false,
  },
  phone: {
    title: 'Teléfono',
    type: 'string',
    sort: false,
  },
};
