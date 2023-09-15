export const GRV_DETALLES_COLUMNS = {
  id: {
    title: 'Id.',
    sort: false,
  },
  name: {
    title: 'Descripción',
    sort: false,
  },
  total: {
    title: 'Total Lotes',
    sort: false,
  },
  porcentaje: {
    title: 'Porcentaje',
    sort: false,
  },
};

export const GV_LOTES_COLUMNS = {
  lote_publico: {
    title: 'Lote Público',
    sort: false,
  },
  id_lote: {
    title: 'Id. Lote',
    sort: false,
  },
  id_estatusvta: {
    title: 'Id. Estatus',
    sort: false,
  },
  id_evento: {
    title: 'Id. Evento',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    sort: false,
  },
  cliente: {
    title: 'Cliente',
    sort: false,
  },
  coordinador_reg: {
    title: 'Coordinador Reg',
    sort: false,
  },
  no_transferente: {
    title: 'Transferente',
    sort: false,
  },
  transferente: {
    title: 'Detalle',
    sort: false,
  },
};

export const BIEN_LOTES_COLUMNS = {
  no_bien: {
    title: 'No. Bien',
    sort: false,
  },
  estatus: {
    title: 'Estatus',
    sort: false,
  },
  fec_cambio: {
    title: 'Fecha de Cambio',
    sort: false,
    valuePrepareFunction: (text: string) => {
      if (text) {
        const parts = text.split('T')[0].split('-'); // Obtener la parte de la fecha y dividirla
        if (parts.length === 3) {
          const [year, month, day] = parts;
          return `${day}/${month}/${year}`;
        }
      }
      return '';
    },
  },
  usuario_cambio: {
    title: 'Usuario de Cambio',
    sort: false,
  },
  programa_cambio_estatus: {
    title: 'Programa',
    sort: false,
  },
  motivo_cambio: {
    title: 'Motivo de Cambio',
    sort: false,
  },
  no_registro: {
    title: 'No. Registro',
    sort: false,
  },
  proceso_ext_dom: {
    title: 'Proceso',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    sort: false,
  },
};
