const options: any[] = [
  { value: 'Muebles', title: 'Muebles' },
  { value: 'Inmuebles', title: 'Inmuebles' },
  { value: 'Remesas', title: 'Remesas' },
  { value: 'Disponibles', title: 'Disponibles' },
  { value: 'Validar SIRSAE', title: 'Validar SIRSAE' },
];

export const COLUMNS = {
  goodStatus: {
    title: 'Estatus',
    sort: false,
    filter: true,
  },
  description: {
    title: 'Descripción',
    sort: false,
    filter: true,
  },
  processStatus: {
    title: 'Estatus del proceso',
    sort: false,
    filter: true,
  },
  quantity: {
    title: 'Cantidad',
    sort: false,
    filter: true,
  },
  transferentDestiny: {
    title: 'Destino',
    sort: false,
    filter: true,
  },
};
