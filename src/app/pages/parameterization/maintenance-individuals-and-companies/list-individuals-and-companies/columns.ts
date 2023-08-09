export const COLUMNS = {
  id: {
    title: 'No. Persona',
    sort: false,
  },
  personName: {
    title: 'Nombre',
    sort: false,
  },
  name: {
    title: 'Apellido Paterno y Materno',
    sort: false,
  },
  manager: {
    title: 'Representante',
    sort: false,
  },
  typePerson: {
    title: 'Tipo Persona',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'M') return 'Persona moral';
      if (value == 'F') return 'Persona física';

      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'M', title: 'Persona moral' },
          { value: 'F', title: 'Persona física' },
        ],
      },
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
  street: {
    title: 'Calle',
    sort: false,
  },
  apartmentNumber: {
    title: 'No. Interior',
    sort: false,
  },
  streetNumber: {
    title: 'No. Exterior',
    sort: false,
  },
  phone: {
    title: 'Teléfono',
    sort: false,
  },
  zipCode: {
    title: 'Código Postal',
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
  keyEntFed: {
    title: 'Ent. Federativa',
    sort: false,
  },
  observations: {
    title: 'Observaciones',
    sort: false,
  },
  curriculum: {
    title: 'Currículum',
    sort: false,
    type: 'html',
    valuePrepareFunction: (value: string) => {
      if (value == 'S')
        return '<strong><span class="badge badge-pill badge-success">SI</span></strong>';
      if (value == 'N')
        return '<strong><span class="badge badge-pill badge-warning">NO</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'S', title: 'SI' },
          { value: 'N', title: 'NO' },
        ],
      },
    },
  },
  keyOperation: {
    title: 'Giro',
    sort: false,
  },
  numberDeep: {
    title: 'No. Escritura',
    sort: false,
  },
  profile: {
    title: 'Perfil',
    sort: false,
  },
};
