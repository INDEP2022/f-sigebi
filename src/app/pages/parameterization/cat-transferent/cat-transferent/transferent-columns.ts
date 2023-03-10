export const TRANSFERENT_COLUMNS = {
  id: {
    title: 'No.',
    sort: false,
  },
  nameTransferent: {
    title: 'Nombre',
    sort: false,
  },
  keyTransferent: {
    title: 'Clave',
    sort: false,
  },
  typeTransferent: {
    title: 'Tipo',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value == 'NO') return 'No obligatorio ';
      if (value == 'CE') return 'Asegurado';

      return value;
    },
  },
  /*userCreation: {
    title: 'Usuario creado',
    sort: false,
  },
  dateCreation: {
    title: 'Fecha creación',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },
  },
  userUpdate: {
    title: 'Usuario actualizado',
    sort: false,
  },
  dateUpdate: {
    title: 'Fecha actualización',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },
  },
 
  version: {
    title: 'Versión',
    sort: false,
  },
  status: {
    title: 'Estado',
    sort: false,
  },
  dateBegOperation: {
    title: 'Fecha de pago de operación',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },
  },
  dateFinalOperation: {
    title: 'Fecha final de operación',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },
  },
  assignor: {
    title: 'Mandato cedente',
    sort: false,
  },
  objectCharge: {
    title: 'Objeto encargo',
    sort: false,
  },
  sector: {
    title: 'Sector',
    sort: false,
  },
  formalization: {
    title: 'Formalización',
    sort: false,
  },
  dateFormalization: {
    title: 'Fecha de formalización',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },
  },
  entity: {
    title: 'Entidad',
    sort: false,
  },
  amedingAgree: {
    title: 'Convenio modificator',
    sort: false,
  },
  dateAmeding: {
    title: 'Fecha de convenio modificatorio',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `
        ${text ? text.split('T')[0] : ''}  
      `;
    },
  },
  typeGoods: {
    title: 'Tipo bien',
    sort: false,
  },
  custodyGuardGoods: {
    title: 'Guardia custodia bien',
    sort: false,
  },
  destinyGoods: {
    title: 'Destino bien',
    sort: false,
  },
  daysAdminGoods: {
    title: 'Días admin bien',
    sort: false,
  },
  cvman: {
    title: 'CVMAN',
    sort: false,
  },
  indcap: {
    title: 'INCAP',
    sort: false,
  },
  active: {
    title: 'Activo',
    sort: false,
  },
  risk: {
    title: 'Riesgo',
    sort: false,
  },*/
};
