export const HISTORICAL_GOOD_SITUATION_COLUMNS = {
  descripcion: {
    title: 'Situación',
    sort: false,
    valuePrepareFunction: (value: string) => value ?? 'Estatus no habilitado',
  },
  fec_cambio: {
    title: 'Fecha Cambio',
    sort: false,
    valuePrepareFunction: (value: string) => formatDate(value),
  },
  usuario_cambio: {
    title: 'Usuario',
    sort: false,
  },
  motivo_cambio: {
    title: 'Motivo Cambio',
    sort: false,
  },
  proceso_ext_dom: {
    title: 'Proceso',
    sort: false,
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}
