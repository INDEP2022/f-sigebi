export const ACTAS_COLUMNS = {
  cve_acta: {
    title: 'Clave',
    sort: false,
  },
  tipo_acta: {
    title: 'Tipo',
    sort: false,
  },
  fecha_elab: {
    title: 'Fecha de Elaboración',
    sort: false,
    valuePrepareFunction: (date: string) => {
      return date ? date.split('T')[0].split('-').reverse().join('/') : '';
    },
  },
};
